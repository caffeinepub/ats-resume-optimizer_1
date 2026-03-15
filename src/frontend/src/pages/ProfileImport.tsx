import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Code2,
  ExternalLink,
  Github,
  Loader2,
  RefreshCw,
  Save,
  Star,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { GitHubRepo, Profile } from "../hooks/useResumeData";

interface Props {
  profile: Profile;
  setProfile: (p: Profile | ((prev: Profile) => Profile)) => void;
}

export default function ProfileImport({ profile, setProfile }: Props) {
  const [fetchingGithub, setFetchingGithub] = useState(false);

  const update = (key: keyof Profile, value: string) => {
    setProfile((prev) => ({ ...prev, [key]: value }));
  };

  const fetchGitHub = async () => {
    if (!profile.githubUsername.trim()) {
      toast.error("Enter a GitHub username first");
      return;
    }
    setFetchingGithub(true);
    try {
      const res = await fetch(
        `https://api.github.com/users/${profile.githubUsername}/repos?sort=updated&per_page=20`,
      );
      if (!res.ok) throw new Error("GitHub user not found");
      const repos: GitHubRepo[] = await res.json();
      setProfile((prev) => ({ ...prev, githubRepos: repos }));
      toast.success(`Fetched ${repos.length} repositories!`);
    } catch {
      toast.error("Failed to fetch GitHub data. Check the username.");
    } finally {
      setFetchingGithub(false);
    }
  };

  const saveProfile = () => {
    toast.success("Profile saved successfully!");
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground">
          Profile Import
        </h1>
        <p className="text-muted-foreground mt-1">
          Enter your professional details and import data from LinkedIn and
          GitHub.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal Info */}
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
              <Label htmlFor="linkedinUrl">LinkedIn URL</Label>
              <Input
                id="linkedinUrl"
                data-ocid="profile.linkedin.input"
                value={profile.linkedinUrl}
                onChange={(e) => update("linkedinUrl", e.target.value)}
                placeholder="https://linkedin.com/in/janedoe"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="summary">Professional Summary</Label>
              <Textarea
                id="summary"
                data-ocid="profile.summary.textarea"
                value={profile.summary}
                onChange={(e) => update("summary", e.target.value)}
                placeholder="Briefly describe your professional background and key strengths..."
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        {/* GitHub Import */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-display flex items-center gap-2">
              <Github size={16} /> GitHub Integration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="githubUsername">GitHub Username</Label>
              <div className="flex gap-2">
                <Input
                  id="githubUsername"
                  data-ocid="profile.github.input"
                  value={profile.githubUsername}
                  onChange={(e) => update("githubUsername", e.target.value)}
                  placeholder="janedoe"
                  onKeyDown={(e) => e.key === "Enter" && fetchGitHub()}
                />
                <Button
                  type="button"
                  data-ocid="profile.github.primary_button"
                  onClick={fetchGitHub}
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
            </div>

            {profile.githubRepos.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground font-medium">
                  {profile.githubRepos.length} repositories found
                </p>
                <div className="max-h-72 overflow-y-auto space-y-2 pr-1">
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
              <Label htmlFor="importedResumeText">Paste Existing Resume</Label>
              <Textarea
                id="importedResumeText"
                data-ocid="profile.resume.textarea"
                value={profile.importedResumeText}
                onChange={(e) => update("importedResumeText", e.target.value)}
                placeholder="Paste your existing resume content here..."
                rows={6}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end">
        <Button
          type="button"
          data-ocid="profile.save.primary_button"
          onClick={saveProfile}
          className="gap-2"
        >
          <Save size={14} />
          Save Profile
        </Button>
      </div>
    </div>
  );
}
