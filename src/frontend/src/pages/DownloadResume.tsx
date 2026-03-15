import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Check, Copy, Download, FileText, Sparkles } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import ResumePreview from "../components/ResumePreview";
import type { JobData, Profile, ResumeData } from "../hooks/useResumeData";
import { generateCoverLetter } from "../utils/atsUtils";

type TemplateId = "modern" | "minimal" | "software" | "datascience";

const TEMPLATES = [
  {
    id: "modern" as TemplateId,
    name: "Modern Professional",
    desc: "Clean executive layout with strong typography",
    badge: "Popular",
  },
  {
    id: "minimal" as TemplateId,
    name: "Minimal ATS",
    desc: "Ultra-clean format optimized for ATS parsing",
    badge: "ATS Best",
  },
  {
    id: "software" as TemplateId,
    name: "Software Developer",
    desc: "Tech-focused with skills and projects highlighted",
    badge: "Dev Focused",
  },
  {
    id: "datascience" as TemplateId,
    name: "Data Science",
    desc: "Analytics-oriented with research and projects",
    badge: "Data Focused",
  },
];

interface Props {
  resume: ResumeData;
  profile: Profile;
  job: JobData;
}

function resumeToPlainText(resume: ResumeData, profile: Profile): string {
  const lines: string[] = [];
  lines.push(profile.fullName || "[Your Name]");
  lines.push(
    [profile.email, profile.phone, profile.location]
      .filter(Boolean)
      .join(" | "),
  );
  if (profile.linkedinUrl) lines.push(profile.linkedinUrl);
  lines.push("");
  if (resume.summary || profile.summary) {
    lines.push("PROFESSIONAL SUMMARY");
    lines.push("--------------------");
    lines.push(resume.summary || profile.summary);
    lines.push("");
  }
  if (resume.skills.length) {
    lines.push("TECHNICAL SKILLS");
    lines.push("----------------");
    lines.push(resume.skills.join(" • "));
    lines.push("");
  }
  if (resume.experience.length) {
    lines.push("WORK EXPERIENCE");
    lines.push("---------------");
    for (const exp of resume.experience) {
      lines.push(`${exp.jobTitle} | ${exp.company}`);
      lines.push(exp.duration);
      for (const b of exp.bullets) if (b) lines.push(`• ${b}`);
      lines.push("");
    }
  }
  if (resume.projects.length) {
    lines.push("PROJECTS");
    lines.push("--------");
    for (const p of resume.projects) {
      lines.push(`${p.name} | ${p.techStack}`);
      if (p.description) lines.push(p.description);
      for (const b of p.bullets) if (b) lines.push(`• ${b}`);
      lines.push("");
    }
  }
  if (resume.education.length) {
    lines.push("EDUCATION");
    lines.push("---------");
    for (const edu of resume.education)
      lines.push(`${edu.degree} | ${edu.school} | ${edu.year}`);
    lines.push("");
  }
  if (resume.certifications.length) {
    lines.push("CERTIFICATIONS");
    lines.push("--------------");
    for (const c of resume.certifications)
      lines.push(`${c.name} | ${c.issuer} | ${c.year}`);
  }
  return lines.join("\n");
}

export default function DownloadResume({ resume, profile, job }: Props) {
  const [selectedTemplate, setSelectedTemplate] =
    useState<TemplateId>("modern");
  const [coverLetterOpen, setCoverLetterOpen] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");
  const [copied, setCopied] = useState(false);

  const handlePrint = () => window.print();

  const handleCopyText = async () => {
    const text = resumeToPlainText(resume, profile);
    await navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Resume copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleGenerateCoverLetter = () => {
    const letter = generateCoverLetter(profile, job);
    setCoverLetter(letter);
    setCoverLetterOpen(true);
  };

  const copyCoverLetter = async () => {
    await navigator.clipboard.writeText(coverLetter);
    toast.success("Cover letter copied!");
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="no-print">
        <h1 className="text-2xl font-display font-bold text-foreground">
          Download Resume
        </h1>
        <p className="text-muted-foreground mt-1">
          Choose a template and export your ATS-optimized resume.
        </p>
      </div>

      <div className="no-print">
        <h2 className="text-sm font-semibold font-display mb-3">
          Choose Template
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {TEMPLATES.map((t, i) => (
            <button
              key={t.id}
              type="button"
              data-ocid={`download.template.item.${i + 1}`}
              onClick={() => setSelectedTemplate(t.id)}
              className={`text-left p-4 rounded-xl border-2 transition-all duration-200 hover:shadow-md ${
                selectedTemplate === t.id
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/40"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div
                  className="w-6 h-6 rounded-md flex items-center justify-center"
                  style={{
                    background:
                      selectedTemplate === t.id
                        ? "oklch(var(--primary))"
                        : "oklch(var(--muted))",
                  }}
                >
                  <FileText
                    size={12}
                    style={{
                      color:
                        selectedTemplate === t.id
                          ? "white"
                          : "oklch(var(--muted-foreground))",
                    }}
                  />
                </div>
                <Badge variant="secondary" className="text-xs py-0 h-5">
                  {t.badge}
                </Badge>
              </div>
              <p className="text-sm font-semibold leading-tight">{t.name}</p>
              <p className="text-xs text-muted-foreground mt-1 leading-snug">
                {t.desc}
              </p>
            </button>
          ))}
        </div>
      </div>

      <div className="no-print flex flex-wrap gap-3">
        <Button
          type="button"
          data-ocid="download.pdf.primary_button"
          onClick={handlePrint}
          className="gap-2"
        >
          <Download size={14} /> Download PDF
        </Button>
        <Button
          type="button"
          data-ocid="download.copy.secondary_button"
          onClick={handleCopyText}
          variant="outline"
          className="gap-2"
        >
          {copied ? (
            <Check size={14} className="text-success" />
          ) : (
            <Copy size={14} />
          )}
          {copied ? "Copied!" : "Copy Plain Text"}
        </Button>
        <Button
          type="button"
          data-ocid="download.cover.secondary_button"
          onClick={handleGenerateCoverLetter}
          variant="outline"
          className="gap-2"
        >
          <Sparkles size={14} className="text-primary" /> Generate Cover Letter
        </Button>
      </div>

      <div className="print-area border rounded-xl overflow-hidden shadow-sm">
        <ResumePreview
          resume={resume}
          profile={profile}
          template={selectedTemplate}
        />
      </div>

      <Dialog open={coverLetterOpen} onOpenChange={setCoverLetterOpen}>
        <DialogContent
          data-ocid="download.cover.dialog"
          className="max-w-2xl max-h-[80vh] overflow-y-auto"
        >
          <DialogHeader>
            <DialogTitle className="font-display">
              Generated Cover Letter
            </DialogTitle>
          </DialogHeader>
          <pre className="whitespace-pre-wrap text-sm leading-relaxed font-body p-4 rounded-lg bg-muted/30">
            {coverLetter}
          </pre>
          <DialogFooter className="gap-2">
            <Button
              type="button"
              data-ocid="download.cover.cancel_button"
              variant="outline"
              onClick={() => setCoverLetterOpen(false)}
            >
              Close
            </Button>
            <Button
              type="button"
              data-ocid="download.cover.confirm_button"
              onClick={copyCoverLetter}
              className="gap-2"
            >
              <Copy size={14} /> Copy Letter
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
