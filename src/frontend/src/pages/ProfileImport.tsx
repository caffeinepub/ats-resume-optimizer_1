import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Briefcase,
  Code2,
  Download,
  ExternalLink,
  FileText,
  Github,
  Globe,
  Info,
  Linkedin,
  Loader2,
  RefreshCw,
  Save,
  Sparkles,
  Star,
  Upload,
} from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import type {
  GitHubRepo,
  JobData,
  Profile,
  ResumeData,
} from "../hooks/useResumeData";

interface Props {
  profile: Profile;
  setProfile: (p: Profile | ((prev: Profile) => Profile)) => void;
  setResume?: (r: ResumeData | ((prev: ResumeData) => ResumeData)) => void;
  job?: JobData;
}

function extractGithubUsername(input: string): string {
  const trimmed = input.trim();
  try {
    const url = new URL(trimmed);
    if (url.hostname === "github.com") {
      return url.pathname.split("/").filter(Boolean)[0] || trimmed;
    }
  } catch {
    // plain username
  }
  return trimmed;
}

function extractLinkedInHandle(input: string): string {
  const trimmed = input.trim();
  try {
    const url = new URL(trimmed);
    if (url.hostname.includes("linkedin.com")) {
      const parts = url.pathname.split("/").filter(Boolean);
      const inIdx = parts.indexOf("in");
      if (inIdx !== -1 && parts[inIdx + 1]) return parts[inIdx + 1];
    }
  } catch {
    // plain handle
  }
  return trimmed;
}

function scoreRepoRelevance(repo: GitHubRepo, job?: JobData): number {
  if (
    !job ||
    (!job.description &&
      job.keywords.length === 0 &&
      job.requiredSkills.length === 0)
  ) {
    return 0;
  }

  const jobText = [
    job.description,
    ...job.keywords,
    ...job.requiredSkills,
    job.jobTitle,
  ]
    .join(" ")
    .toLowerCase();

  const repoText = [
    repo.name,
    repo.description || "",
    repo.language || "",
    ...(repo.topics ?? []),
  ]
    .join(" ")
    .toLowerCase();

  let score = 0;

  // Score against explicit keywords and required skills
  const terms = [...job.keywords, ...job.requiredSkills].map((k) =>
    k.toLowerCase(),
  );

  for (const term of terms) {
    if (term && repoText.includes(term)) score += 2;
  }

  // Word overlap with full job description
  const jobWords = jobText.split(/\W+/).filter((w) => w.length > 3);
  const repoWords = new Set(repoText.split(/\W+/).filter((w) => w.length > 3));
  for (const word of jobWords) {
    if (repoWords.has(word)) score += 1;
  }

  return score;
}

export default function ProfileImport({
  profile,
  setProfile,
  setResume,
  job,
}: Props) {
  const [fetchingGithub, setFetchingGithub] = useState(false);
  const [generatingResume, setGeneratingResume] = useState(false);
  const resumeFileRef = useRef<HTMLInputElement>(null);

  const hasJobDescription = !!(
    job?.analyzed &&
    (job.description || job.keywords.length > 0)
  );

  const update = (key: keyof Profile, value: string) => {
    setProfile((prev) => ({ ...prev, [key]: value }));
  };

  const fetchGitHub = async (inputOverride?: string): Promise<GitHubRepo[]> => {
    const raw = inputOverride ?? profile.githubUsername;
    const username = extractGithubUsername(raw);
    if (!username) {
      toast.error("Enter a GitHub username or URL first");
      return [];
    }
    setProfile((prev) => ({ ...prev, githubUsername: username }));
    setFetchingGithub(true);
    try {
      const res = await fetch(
        `https://api.github.com/users/${username}/repos?sort=updated&per_page=20`,
      );
      if (!res.ok) throw new Error("GitHub user not found");
      const repos: GitHubRepo[] = await res.json();

      const userRes = await fetch(`https://api.github.com/users/${username}`);
      let ghUser: {
        name?: string;
        bio?: string;
        blog?: string;
        location?: string;
        email?: string;
      } = {};
      if (userRes.ok) ghUser = await userRes.json();

      setProfile((prev) => ({
        ...prev,
        githubUsername: username,
        githubRepos: repos,
        fullName: prev.fullName || ghUser.name || "",
        summary: prev.summary || ghUser.bio || "",
        location: prev.location || ghUser.location || "",
        email: prev.email || ghUser.email || "",
        portfolioUrl: prev.portfolioUrl || ghUser.blog || "",
      }));

      toast.success(`Fetched ${repos.length} repositories from GitHub!`);
      return repos;
    } catch {
      toast.error("Failed to fetch GitHub data. Check the username or URL.");
      return [];
    } finally {
      setFetchingGithub(false);
    }
  };

  const generateResumeFromLinks = async () => {
    if (!profile.githubUsername && !profile.linkedinUrl) {
      toast.error("Enter at least a GitHub URL or LinkedIn URL first.");
      return;
    }
    setGeneratingResume(true);
    try {
      let repos = profile.githubRepos;
      if (profile.githubUsername && repos.length === 0) {
        repos = await fetchGitHub(profile.githubUsername);
      }

      if (!setResume) {
        toast.info("Profile saved. Go to Resume Editor to review your resume.");
        return;
      }

      // Score and sort repos by relevance to job description
      const scored = repos
        .map((repo) => ({ repo, score: scoreRepoRelevance(repo, job) }))
        .sort((a, b) => b.score - a.score);

      // Take top 2 most relevant repos (or all if fewer than 2)
      const topRepos = scored.slice(0, 2).map((s) => s.repo);

      const projects = topRepos.map((repo) => ({
        id: Math.random().toString(36).slice(2, 9),
        name: repo.name
          .replace(/-/g, " ")
          .replace(/\b\w/g, (c) => c.toUpperCase()),
        description: repo.description || "",
        techStack: [
          ...(repo.language ? [repo.language] : []),
          ...(repo.topics?.slice(0, 3) ?? []),
        ].join(", "),
        bullets: [
          repo.description
            ? `Developed ${repo.description}`
            : `Built an open-source project using ${repo.language || "modern technologies"}.`,
          repo.stargazers_count > 0
            ? `Achieved ${repo.stargazers_count} GitHub stars, reflecting strong community adoption.`
            : "Implemented clean, maintainable code following software engineering best practices.",
        ],
      }));

      const langSet = new Set<string>();
      for (const r of repos) {
        if (r.language) langSet.add(r.language);
        for (const t of r.topics ?? []) langSet.add(t);
      }
      const skills = Array.from(langSet).slice(0, 20);

      const linkedInHandle = profile.linkedinUrl
        ? extractLinkedInHandle(profile.linkedinUrl)
        : null;
      const summary =
        profile.summary ||
        `Software engineer with hands-on experience in ${
          skills.slice(0, 3).join(", ") || "software development"
        }. Passionate about building impactful open-source projects${
          linkedInHandle ? " with a proven professional track record" : ""
        }.`;

      setResume((prev) => ({
        ...prev,
        summary,
        skills: prev.skills.length ? prev.skills : skills,
        projects: prev.projects.length ? prev.projects : projects,
      }));

      toast.success(
        hasJobDescription
          ? "Added 2 most relevant GitHub projects based on your job description!"
          : "ATS-friendly resume generated! Review it in the Resume Editor.",
      );
    } catch {
      toast.error("Could not generate resume. Please try again.");
    } finally {
      setGeneratingResume(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground">
          Profile Import
        </h1>
        <p className="text-muted-foreground mt-1">
          Paste your LinkedIn and GitHub URLs to auto-generate an ATS-friendly
          resume.
        </p>
      </div>

      <Card className="border-primary/30 bg-primary/5">
        <CardContent className="py-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex-1">
            <p className="text-sm font-semibold">
              Auto-Generate Resume from Links
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Fill in your LinkedIn and/or GitHub URL below, then click
              Generate. We'll pull your repos, skills, and projects
              automatically.
            </p>
            {hasJobDescription && (
              <p className="text-xs text-muted-foreground mt-1.5 flex items-center gap-1.5">
                <Info size={11} className="text-primary shrink-0" />
                Job description detected — only the 2 most relevant repos will
                be added.
              </p>
            )}
          </div>
          <Button
            type="button"
            data-ocid="profile.generate.primary_button"
            onClick={generateResumeFromLinks}
            disabled={generatingResume}
            className="gap-2 shrink-0"
          >
            {generatingResume ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Sparkles size={14} />
            )}
            {generatingResume ? "Generating..." : "Generate Resume"}
          </Button>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-display">
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  data-ocid="profile.input"
                  value={profile.fullName}
                  onChange={(e) => update("fullName", e.target.value)}
                  placeholder="Jane Doe"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  data-ocid="profile.email.input"
                  type="email"
                  value={profile.email}
                  onChange={(e) => update("email", e.target.value)}
                  placeholder="jane@example.com"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  data-ocid="profile.phone.input"
                  value={profile.phone}
                  onChange={(e) => update("phone", e.target.value)}
                  placeholder="+1 (555) 000-0000"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  data-ocid="profile.location.input"
                  value={profile.location}
                  onChange={(e) => update("location", e.target.value)}
                  placeholder="San Francisco, CA"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor="linkedinUrl"
                className="flex items-center gap-1.5"
              >
                <Linkedin size={13} className="text-[#0077b5]" />
                LinkedIn URL
              </Label>
              <Input
                id="linkedinUrl"
                data-ocid="profile.linkedin.input"
                value={profile.linkedinUrl}
                onChange={(e) => update("linkedinUrl", e.target.value)}
                placeholder="https://linkedin.com/in/janedoe"
              />
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor="portfolioUrl"
                className="flex items-center gap-1.5"
              >
                <Briefcase size={13} className="text-primary" />
                Portfolio / Website
              </Label>
              <div className="relative flex items-center">
                <Globe
                  size={14}
                  className="absolute left-3 text-muted-foreground pointer-events-none"
                />
                <Input
                  id="portfolioUrl"
                  data-ocid="profile.portfolio.input"
                  value={profile.portfolioUrl}
                  onChange={(e) => update("portfolioUrl", e.target.value)}
                  placeholder="https://yourportfolio.com"
                  className="pl-8"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="summary">Professional Summary</Label>
              <Textarea
                id="summary"
                data-ocid="profile.summary.textarea"
                value={profile.summary}
                onChange={(e) => update("summary", e.target.value)}
                placeholder="Briefly describe your professional background..."
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base font-display flex items-center gap-2">
              <Github size={16} /> GitHub Integration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="githubUsername">GitHub Username or URL</Label>
              <div className="flex gap-2">
                <Input
                  id="githubUsername"
                  data-ocid="profile.github.input"
                  value={profile.githubUsername}
                  onChange={(e) => update("githubUsername", e.target.value)}
                  placeholder="janedoe or https://github.com/janedoe"
                  onKeyDown={(e) => e.key === "Enter" && fetchGitHub()}
                />
                <Button
                  type="button"
                  data-ocid="profile.github.primary_button"
                  onClick={() => fetchGitHub()}
                  disabled={fetchingGithub}
                  variant="outline"
                  className="shrink-0"
                >
                  {fetchingGithub ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <RefreshCw size={14} />
                  )}
                  <span className="ml-1.5">
                    {fetchingGithub ? "Fetching..." : "Fetch"}
                  </span>
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Supports full URLs like{" "}
                <code className="font-mono text-xs">
                  https://github.com/janedoe
                </code>
              </p>
            </div>

            {profile.githubRepos.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground font-medium">
                  {profile.githubRepos.length} repositories found
                </p>
                <div className="max-h-64 overflow-y-auto space-y-2 pr-1">
                  {profile.githubRepos.map((repo: GitHubRepo) => (
                    <div
                      key={repo.name}
                      className="p-2.5 rounded-lg border bg-muted/30 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <Code2 size={12} className="shrink-0 text-primary" />
                          <span className="text-sm font-medium truncate">
                            {repo.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          {repo.language && (
                            <Badge variant="secondary" className="text-xs py-0">
                              {repo.language}
                            </Badge>
                          )}
                          {repo.stargazers_count > 0 && (
                            <span className="flex items-center gap-0.5 text-xs text-muted-foreground">
                              <Star size={10} />
                              {repo.stargazers_count}
                            </span>
                          )}
                          <a
                            href={repo.html_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-muted-foreground hover:text-primary"
                          >
                            <ExternalLink size={12} />
                          </a>
                        </div>
                      </div>
                      {repo.description && (
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                          {repo.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="importedResumeText">Existing Resume</Label>
                <div className="flex items-center gap-1.5">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    data-ocid="profile.resume.upload_button"
                    className="h-7 px-2 text-xs gap-1.5"
                    onClick={() => resumeFileRef.current?.click()}
                  >
                    <Upload size={12} />
                    Upload file
                  </Button>
                  <input
                    ref={resumeFileRef}
                    type="file"
                    accept=".txt,.pdf,.doc,.docx"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      if (!file.name.endsWith(".txt")) {
                        toast.info(
                          "For best results, upload a .txt version of your resume",
                        );
                      }
                      const reader = new FileReader();
                      reader.onload = (ev) => {
                        const text = ev.target?.result as string;
                        if (text) update("importedResumeText", text);
                      };
                      reader.readAsText(file);
                    }}
                  />
                  {profile.importedResumeText.trim().length > 0 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      data-ocid="profile.resume.secondary_button"
                      className="h-7 px-2 text-xs gap-1.5"
                      onClick={() => {
                        const blob = new Blob([profile.importedResumeText], {
                          type: "text/plain",
                        });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement("a");
                        a.href = url;
                        a.download = "resume_uploaded.txt";
                        a.click();
                        URL.revokeObjectURL(url);
                      }}
                    >
                      <Download size={12} />
                      Download
                    </Button>
                  )}
                </div>
              </div>
              <Textarea
                id="importedResumeText"
                data-ocid="profile.resume.textarea"
                value={profile.importedResumeText}
                onChange={(e) => update("importedResumeText", e.target.value)}
                placeholder="Paste your existing resume content here, or upload a .txt file..."
                rows={5}
              />
              {profile.importedResumeText.trim().length > 0 && (
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-primary/5 border border-primary/10 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <FileText size={14} className="text-primary" />
                    <span>
                      Resume loaded (
                      {
                        profile.importedResumeText
                          .trim()
                          .split(/\s+/)
                          .filter(Boolean).length
                      }{" "}
                      words)
                    </span>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    data-ocid="profile.resume.analyze_button"
                    className="h-7 px-2.5 text-xs gap-1.5"
                    onClick={() =>
                      toast.info("Go to ATS Score to see your resume match!")
                    }
                  >
                    Analyze vs Job Description
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end">
        <Button
          type="button"
          data-ocid="profile.save.primary_button"
          onClick={() => toast.success("Profile saved!")}
          className="gap-2"
        >
          <Save size={14} />
          Save Profile
        </Button>
      </div>
    </div>
  );
}
