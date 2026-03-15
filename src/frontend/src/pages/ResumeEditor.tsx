import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { ChevronDown, Plus, Sparkles, Trash2, Wand2, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import ResumePreview from "../components/ResumePreview";
import type {
  CertificationItem,
  EducationItem,
  ExperienceItem,
  GitHubRepo,
  Profile,
  ProjectItem,
  ResumeData,
} from "../hooks/useResumeData";
import { enhanceSummary, improveBullet } from "../utils/atsUtils";

interface Props {
  resume: ResumeData;
  setResume: (r: ResumeData | ((prev: ResumeData) => ResumeData)) => void;
  profile: Profile;
}

function genId() {
  return Math.random().toString(36).slice(2, 9);
}

interface BulletImproveModalProps {
  open: boolean;
  original: string;
  improved: string;
  onAccept: () => void;
  onClose: () => void;
}

function BulletImproveModal({
  open,
  original,
  improved,
  onAccept,
  onClose,
}: BulletImproveModalProps) {
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent data-ocid="bullet.dialog" className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display flex items-center gap-2">
            <Wand2 size={16} className="text-primary" /> AI Bullet Improver
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="p-3 rounded-lg bg-destructive/5 border border-destructive/10">
            <p className="text-xs font-semibold text-muted-foreground mb-1">
              Original
            </p>
            <p className="text-sm">{original}</p>
          </div>
          <div className="p-3 rounded-lg bg-success/5 border border-success/10">
            <p className="text-xs font-semibold text-muted-foreground mb-1">
              Improved
            </p>
            <p className="text-sm font-medium">{improved}</p>
          </div>
        </div>
        <DialogFooter>
          <Button
            type="button"
            data-ocid="bullet.cancel_button"
            variant="outline"
            onClick={onClose}
          >
            Keep Original
          </Button>
          <Button
            type="button"
            data-ocid="bullet.confirm_button"
            onClick={onAccept}
          >
            Accept Improvement
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function ResumeEditor({ resume, setResume, profile }: Props) {
  const [skillInput, setSkillInput] = useState("");
  const [bulletModal, setBulletModal] = useState<{
    open: boolean;
    original: string;
    improved: string;
    callback: (s: string) => void;
  }>({ open: false, original: "", improved: "", callback: () => {} });

  const updateResume = (key: keyof ResumeData, value: unknown) => {
    setResume((prev) => ({ ...prev, [key]: value }));
  };

  const addSkill = () => {
    const trimmed = skillInput.trim();
    if (!trimmed) return;
    if (resume.skills.includes(trimmed)) {
      toast.error("Skill already added");
      return;
    }
    updateResume("skills", [...resume.skills, trimmed]);
    setSkillInput("");
  };
  const removeSkill = (skill: string) =>
    updateResume(
      "skills",
      resume.skills.filter((s) => s !== skill),
    );

  const addExperience = () => {
    const newExp: ExperienceItem = {
      id: genId(),
      jobTitle: "",
      company: "",
      duration: "",
      bullets: [""],
    };
    updateResume("experience", [...resume.experience, newExp]);
  };
  const updateExp = (id: string, key: keyof ExperienceItem, value: unknown) => {
    updateResume(
      "experience",
      resume.experience.map((e) => (e.id === id ? { ...e, [key]: value } : e)),
    );
  };
  const removeExp = (id: string) =>
    updateResume(
      "experience",
      resume.experience.filter((e) => e.id !== id),
    );

  const addProject = () => {
    const newP: ProjectItem = {
      id: genId(),
      name: "",
      description: "",
      techStack: "",
      bullets: [""],
    };
    updateResume("projects", [...resume.projects, newP]);
  };
  const updateProject = (
    id: string,
    key: keyof ProjectItem,
    value: unknown,
  ) => {
    updateResume(
      "projects",
      resume.projects.map((p) => (p.id === id ? { ...p, [key]: value } : p)),
    );
  };
  const removeProject = (id: string) =>
    updateResume(
      "projects",
      resume.projects.filter((p) => p.id !== id),
    );
  const importFromGithub = () => {
    const newProjects: ProjectItem[] = profile.githubRepos
      .slice(0, 5)
      .map((repo: GitHubRepo) => ({
        id: genId(),
        name: repo.name,
        description: repo.description || "",
        techStack: repo.language || "",
        bullets: [
          `Built with ${repo.language || "modern technologies"}`,
          repo.description || "",
        ].filter(Boolean),
      }));
    updateResume("projects", [...resume.projects, ...newProjects]);
    toast.success(`Imported ${newProjects.length} projects from GitHub`);
  };

  const addEducation = () => {
    const newEd: EducationItem = {
      id: genId(),
      degree: "",
      school: "",
      year: "",
    };
    updateResume("education", [...resume.education, newEd]);
  };
  const updateEdu = (id: string, key: keyof EducationItem, value: string) => {
    updateResume(
      "education",
      resume.education.map((e) => (e.id === id ? { ...e, [key]: value } : e)),
    );
  };
  const removeEdu = (id: string) =>
    updateResume(
      "education",
      resume.education.filter((e) => e.id !== id),
    );

  const addCert = () => {
    const newC: CertificationItem = {
      id: genId(),
      name: "",
      issuer: "",
      year: "",
    };
    updateResume("certifications", [...resume.certifications, newC]);
  };
  const updateCert = (
    id: string,
    key: keyof CertificationItem,
    value: string,
  ) => {
    updateResume(
      "certifications",
      resume.certifications.map((c) =>
        c.id === id ? { ...c, [key]: value } : c,
      ),
    );
  };
  const removeCert = (id: string) =>
    updateResume(
      "certifications",
      resume.certifications.filter((c) => c.id !== id),
    );

  const handleImproveBullet = (
    original: string,
    callback: (s: string) => void,
  ) => {
    const improved = improveBullet(original);
    setBulletModal({ open: true, original, improved, callback });
  };

  const handleEnhanceSummary = () => {
    const enhanced = enhanceSummary(resume.summary, "Software Engineer");
    updateResume("summary", enhanced);
    toast.success("Summary enhanced with AI!");
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground">
          Resume Editor
        </h1>
        <p className="text-muted-foreground mt-1">
          Edit each section of your resume with AI assistance.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
        <div className="xl:col-span-3">
          <Tabs defaultValue="summary">
            <TabsList
              data-ocid="editor.tab"
              className="grid w-full grid-cols-3 lg:grid-cols-6 h-auto gap-1 p-1"
            >
              <TabsTrigger value="summary" className="text-xs">
                Summary
              </TabsTrigger>
              <TabsTrigger value="skills" className="text-xs">
                Skills
              </TabsTrigger>
              <TabsTrigger value="experience" className="text-xs">
                Experience
              </TabsTrigger>
              <TabsTrigger value="projects" className="text-xs">
                Projects
              </TabsTrigger>
              <TabsTrigger value="education" className="text-xs">
                Education
              </TabsTrigger>
              <TabsTrigger value="certifications" className="text-xs">
                Certs
              </TabsTrigger>
            </TabsList>

            <TabsContent value="summary" className="mt-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-display">
                    Professional Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Textarea
                    data-ocid="editor.summary.textarea"
                    value={resume.summary}
                    onChange={(e) => updateResume("summary", e.target.value)}
                    placeholder="Write a compelling professional summary..."
                    rows={6}
                  />
                  <Button
                    type="button"
                    data-ocid="editor.summary.primary_button"
                    variant="outline"
                    onClick={handleEnhanceSummary}
                    className="gap-2 text-sm"
                  >
                    <Sparkles size={14} className="text-primary" />
                    AI Enhance Summary
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="skills" className="mt-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-display">
                    Technical Skills
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      data-ocid="editor.skills.input"
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      placeholder="Add a skill (e.g. React, Python...)"
                      onKeyDown={(e) => e.key === "Enter" && addSkill()}
                    />
                    <Button
                      type="button"
                      data-ocid="editor.skills.primary_button"
                      onClick={addSkill}
                      variant="outline"
                      className="shrink-0"
                    >
                      <Plus size={14} />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {resume.skills.map((skill, i) => (
                      <Badge
                        key={skill}
                        variant="secondary"
                        className="gap-1.5 pr-1.5 py-1"
                      >
                        {skill}
                        <button
                          type="button"
                          data-ocid={`editor.skills.delete_button.${i + 1}`}
                          onClick={() => removeSkill(skill)}
                          className="ml-0.5 hover:text-destructive"
                        >
                          <X size={11} />
                        </button>
                      </Badge>
                    ))}
                    {resume.skills.length === 0 && (
                      <p
                        className="text-sm text-muted-foreground"
                        data-ocid="editor.skills.empty_state"
                      >
                        No skills added yet. Start typing and press Enter.
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="experience" className="mt-4 space-y-4">
              <div className="flex justify-end">
                <Button
                  type="button"
                  data-ocid="editor.experience.primary_button"
                  onClick={addExperience}
                  variant="outline"
                  size="sm"
                  className="gap-2"
                >
                  <Plus size={14} /> Add Experience
                </Button>
              </div>
              {resume.experience.length === 0 && (
                <Card>
                  <CardContent
                    className="py-8 text-center"
                    data-ocid="editor.experience.empty_state"
                  >
                    <p className="text-muted-foreground text-sm">
                      No experience added yet.
                    </p>
                  </CardContent>
                </Card>
              )}
              {resume.experience.map((exp, idx) => (
                <Card
                  key={exp.id}
                  data-ocid={`editor.experience.item.${idx + 1}`}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-medium">
                        {exp.jobTitle || `Experience #${idx + 1}`}
                      </CardTitle>
                      <Button
                        type="button"
                        data-ocid={`editor.experience.delete_button.${idx + 1}`}
                        variant="ghost"
                        size="sm"
                        onClick={() => removeExp(exp.id)}
                        className="text-destructive h-7 w-7 p-0"
                      >
                        <Trash2 size={13} />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        placeholder="Job Title"
                        value={exp.jobTitle}
                        onChange={(e) =>
                          updateExp(exp.id, "jobTitle", e.target.value)
                        }
                      />
                      <Input
                        placeholder="Company"
                        value={exp.company}
                        onChange={(e) =>
                          updateExp(exp.id, "company", e.target.value)
                        }
                      />
                    </div>
                    <Input
                      placeholder="Duration (e.g. Jan 2022 – Present)"
                      value={exp.duration}
                      onChange={(e) =>
                        updateExp(exp.id, "duration", e.target.value)
                      }
                    />
                    <div className="space-y-2">
                      <Label className="text-xs">Bullet Points</Label>
                      {exp.bullets.map((bullet, bi) => (
                        // biome-ignore lint/suspicious/noArrayIndexKey: bullets ordered by position
                        <div key={bi} className="flex gap-2 items-start">
                          <Textarea
                            value={bullet}
                            onChange={(e) => {
                              const newBullets = [...exp.bullets];
                              newBullets[bi] = e.target.value;
                              updateExp(exp.id, "bullets", newBullets);
                            }}
                            placeholder="Describe your achievement..."
                            rows={2}
                            className="text-sm"
                          />
                          <div className="flex flex-col gap-1">
                            <Button
                              type="button"
                              data-ocid={`editor.experience.edit_button.${idx + 1}`}
                              variant="ghost"
                              size="sm"
                              className="h-7 w-7 p-0 text-primary"
                              onClick={() =>
                                handleImproveBullet(bullet, (improved) => {
                                  const newBullets = [...exp.bullets];
                                  newBullets[bi] = improved;
                                  updateExp(exp.id, "bullets", newBullets);
                                })
                              }
                            >
                              <Wand2 size={12} />
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="h-7 w-7 p-0 text-muted-foreground"
                              onClick={() => {
                                const newBullets = exp.bullets.filter(
                                  (_, i) => i !== bi,
                                );
                                updateExp(
                                  exp.id,
                                  "bullets",
                                  newBullets.length ? newBullets : [""],
                                );
                              }}
                            >
                              <X size={12} />
                            </Button>
                          </div>
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="gap-1.5 text-xs h-7"
                        onClick={() =>
                          updateExp(exp.id, "bullets", [...exp.bullets, ""])
                        }
                      >
                        <Plus size={12} /> Add Bullet
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="projects" className="mt-4 space-y-4">
              <div className="flex justify-end gap-2">
                {profile.githubRepos.length > 0 && (
                  <Button
                    type="button"
                    data-ocid="editor.projects.secondary_button"
                    onClick={importFromGithub}
                    variant="outline"
                    size="sm"
                    className="gap-2"
                  >
                    <ChevronDown size={14} /> Import from GitHub
                  </Button>
                )}
                <Button
                  type="button"
                  data-ocid="editor.projects.primary_button"
                  onClick={addProject}
                  variant="outline"
                  size="sm"
                  className="gap-2"
                >
                  <Plus size={14} /> Add Project
                </Button>
              </div>
              {resume.projects.length === 0 && (
                <Card>
                  <CardContent
                    className="py-8 text-center"
                    data-ocid="editor.projects.empty_state"
                  >
                    <p className="text-muted-foreground text-sm">
                      No projects added yet.
                    </p>
                  </CardContent>
                </Card>
              )}
              {resume.projects.map((proj, idx) => (
                <Card
                  key={proj.id}
                  data-ocid={`editor.projects.item.${idx + 1}`}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-medium">
                        {proj.name || `Project #${idx + 1}`}
                      </CardTitle>
                      <Button
                        type="button"
                        data-ocid={`editor.projects.delete_button.${idx + 1}`}
                        variant="ghost"
                        size="sm"
                        onClick={() => removeProject(proj.id)}
                        className="text-destructive h-7 w-7 p-0"
                      >
                        <Trash2 size={13} />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Input
                      placeholder="Project Name"
                      value={proj.name}
                      onChange={(e) =>
                        updateProject(proj.id, "name", e.target.value)
                      }
                    />
                    <Textarea
                      placeholder="Short description..."
                      value={proj.description}
                      onChange={(e) =>
                        updateProject(proj.id, "description", e.target.value)
                      }
                      rows={2}
                    />
                    <Input
                      placeholder="Tech Stack (e.g. React, Node.js, PostgreSQL)"
                      value={proj.techStack}
                      onChange={(e) =>
                        updateProject(proj.id, "techStack", e.target.value)
                      }
                    />
                    <div className="space-y-2">
                      <Label className="text-xs">Key Highlights</Label>
                      {proj.bullets.map((b, bi) => (
                        // biome-ignore lint/suspicious/noArrayIndexKey: bullets ordered by position
                        <div key={bi} className="flex gap-2 items-start">
                          <Textarea
                            value={b}
                            onChange={(e) => {
                              const nb = [...proj.bullets];
                              nb[bi] = e.target.value;
                              updateProject(proj.id, "bullets", nb);
                            }}
                            placeholder="Highlight..."
                            rows={2}
                            className="text-sm"
                          />
                          <div className="flex flex-col gap-1">
                            <Button
                              type="button"
                              data-ocid={`editor.projects.edit_button.${idx + 1}`}
                              variant="ghost"
                              size="sm"
                              className="h-7 w-7 p-0 text-primary"
                              onClick={() =>
                                handleImproveBullet(b, (improved) => {
                                  const nb = [...proj.bullets];
                                  nb[bi] = improved;
                                  updateProject(proj.id, "bullets", nb);
                                })
                              }
                            >
                              <Wand2 size={12} />
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="h-7 w-7 p-0 text-muted-foreground"
                              onClick={() => {
                                const nb = proj.bullets.filter(
                                  (_, i) => i !== bi,
                                );
                                updateProject(
                                  proj.id,
                                  "bullets",
                                  nb.length ? nb : [""],
                                );
                              }}
                            >
                              <X size={12} />
                            </Button>
                          </div>
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="gap-1.5 text-xs h-7"
                        onClick={() =>
                          updateProject(proj.id, "bullets", [
                            ...proj.bullets,
                            "",
                          ])
                        }
                      >
                        <Plus size={12} /> Add Highlight
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="education" className="mt-4 space-y-4">
              <div className="flex justify-end">
                <Button
                  type="button"
                  data-ocid="editor.education.primary_button"
                  onClick={addEducation}
                  variant="outline"
                  size="sm"
                  className="gap-2"
                >
                  <Plus size={14} /> Add Education
                </Button>
              </div>
              {resume.education.length === 0 && (
                <Card>
                  <CardContent
                    className="py-8 text-center"
                    data-ocid="editor.education.empty_state"
                  >
                    <p className="text-muted-foreground text-sm">
                      No education added yet.
                    </p>
                  </CardContent>
                </Card>
              )}
              {resume.education.map((edu, idx) => (
                <Card
                  key={edu.id}
                  data-ocid={`editor.education.item.${idx + 1}`}
                >
                  <CardContent className="pt-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">
                        Education #{idx + 1}
                      </span>
                      <Button
                        type="button"
                        data-ocid={`editor.education.delete_button.${idx + 1}`}
                        variant="ghost"
                        size="sm"
                        onClick={() => removeEdu(edu.id)}
                        className="text-destructive h-7 w-7 p-0"
                      >
                        <Trash2 size={13} />
                      </Button>
                    </div>
                    <Input
                      placeholder="Degree (e.g. B.S. Computer Science)"
                      value={edu.degree}
                      onChange={(e) =>
                        updateEdu(edu.id, "degree", e.target.value)
                      }
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        placeholder="School"
                        value={edu.school}
                        onChange={(e) =>
                          updateEdu(edu.id, "school", e.target.value)
                        }
                      />
                      <Input
                        placeholder="Year (e.g. 2020)"
                        value={edu.year}
                        onChange={(e) =>
                          updateEdu(edu.id, "year", e.target.value)
                        }
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="certifications" className="mt-4 space-y-4">
              <div className="flex justify-end">
                <Button
                  type="button"
                  data-ocid="editor.certs.primary_button"
                  onClick={addCert}
                  variant="outline"
                  size="sm"
                  className="gap-2"
                >
                  <Plus size={14} /> Add Certification
                </Button>
              </div>
              {resume.certifications.length === 0 && (
                <Card>
                  <CardContent
                    className="py-8 text-center"
                    data-ocid="editor.certs.empty_state"
                  >
                    <p className="text-muted-foreground text-sm">
                      No certifications added yet.
                    </p>
                  </CardContent>
                </Card>
              )}
              {resume.certifications.map((cert, idx) => (
                <Card key={cert.id} data-ocid={`editor.certs.item.${idx + 1}`}>
                  <CardContent className="pt-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">
                        Cert #{idx + 1}
                      </span>
                      <Button
                        type="button"
                        data-ocid={`editor.certs.delete_button.${idx + 1}`}
                        variant="ghost"
                        size="sm"
                        onClick={() => removeCert(cert.id)}
                        className="text-destructive h-7 w-7 p-0"
                      >
                        <Trash2 size={13} />
                      </Button>
                    </div>
                    <Input
                      placeholder="Certification Name"
                      value={cert.name}
                      onChange={(e) =>
                        updateCert(cert.id, "name", e.target.value)
                      }
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        placeholder="Issuer (e.g. AWS, Google)"
                        value={cert.issuer}
                        onChange={(e) =>
                          updateCert(cert.id, "issuer", e.target.value)
                        }
                      />
                      <Input
                        placeholder="Year"
                        value={cert.year}
                        onChange={(e) =>
                          updateCert(cert.id, "year", e.target.value)
                        }
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          </Tabs>
        </div>

        <div className="xl:col-span-2">
          <div className="sticky top-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold font-display">
                Live Preview
              </h3>
              <Badge variant="outline" className="text-xs">
                Modern Professional
              </Badge>
            </div>
            <div
              className="border rounded-xl overflow-hidden shadow-sm"
              style={{
                maxHeight: "calc(100vh - 160px)",
                overflowY: "auto",
              }}
            >
              <ResumePreview
                resume={resume}
                profile={profile}
                template="modern"
                scale={0.65}
              />
            </div>
          </div>
        </div>
      </div>

      <BulletImproveModal
        open={bulletModal.open}
        original={bulletModal.original}
        improved={bulletModal.improved}
        onAccept={() => {
          bulletModal.callback(bulletModal.improved);
          setBulletModal((p) => ({ ...p, open: false }));
          toast.success("Bullet point improved!");
        }}
        onClose={() => setBulletModal((p) => ({ ...p, open: false }))}
      />
    </div>
  );
}
