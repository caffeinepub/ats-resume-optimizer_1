import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Briefcase, CheckCircle2, Search, Tag, TrendingUp } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { JobData } from "../hooks/useResumeData";
import {
  detectExperienceLevel,
  detectJobTitle,
  extractKeywords,
  extractRequiredSkills,
} from "../utils/atsUtils";

interface Props {
  job: JobData;
  setJob: (j: JobData | ((prev: JobData) => JobData)) => void;
}

export default function JobDescription({ job, setJob }: Props) {
  const [description, setDescription] = useState(job.description);

  const analyzeJob = () => {
    if (description.trim().length < 50) {
      toast.error(
        "Please paste a more complete job description (at least 50 characters)",
      );
      return;
    }
    const keywords = extractKeywords(description);
    const requiredSkills = extractRequiredSkills(description);
    const jobTitle = detectJobTitle(description);
    const experienceLevel = detectExperienceLevel(description);

    setJob({
      description,
      keywords,
      requiredSkills,
      jobTitle,
      experienceLevel,
      analyzed: true,
    });
    toast.success(`Analysis complete — ${keywords.length} keywords found!`);
  };

  const wordCount = description.trim().split(/\s+/).filter(Boolean).length;
  const charCount = description.length;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground">
          Job Description Analyzer
        </h1>
        <p className="text-muted-foreground mt-1">
          Paste the job description to extract ATS keywords and skill
          requirements.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-display flex items-center gap-2">
            <Search size={16} /> Paste Job Description
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Textarea
            data-ocid="job.description.textarea"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Paste the full job description here. Include requirements, responsibilities, and qualifications for best results..."
            rows={12}
            className="font-body text-sm leading-relaxed"
          />
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              {wordCount} words · {charCount} characters
            </span>
            <Button
              type="button"
              data-ocid="job.analyze.primary_button"
              onClick={analyzeJob}
              className="gap-2"
            >
              <Search size={14} />
              Analyze Job
            </Button>
          </div>
        </CardContent>
      </Card>

      {job.analyzed && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in">
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-display flex items-center gap-2">
                <Briefcase size={16} /> Detected Job Info
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-primary/5 border border-primary/10">
                <div>
                  <p className="text-xs text-muted-foreground">Job Title</p>
                  <p className="font-semibold text-foreground">
                    {job.jobTitle}
                  </p>
                </div>
                <Briefcase size={20} className="text-primary" />
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div>
                  <p className="text-xs text-muted-foreground">
                    Experience Level
                  </p>
                  <p className="font-semibold text-foreground">
                    {job.experienceLevel}
                  </p>
                </div>
                <TrendingUp size={20} className="text-muted-foreground" />
              </div>
              <Separator />
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                  Required Skills
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {job.requiredSkills.map((skill) => (
                    <Badge
                      key={skill}
                      className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20"
                    >
                      <CheckCircle2 size={10} className="mr-1" />
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base font-display flex items-center gap-2">
                <Tag size={16} /> ATS Keywords
                <Badge variant="secondary" className="ml-auto text-xs">
                  {job.keywords.length} found
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground mb-3">
                These keywords are used by ATS systems to filter candidates.
                Make sure your resume includes them.
              </p>
              <div className="flex flex-wrap gap-1.5">
                {job.keywords.map((kw) => (
                  <span
                    key={kw}
                    className="tag-chip bg-muted text-foreground border border-border hover:bg-accent hover:text-accent-foreground transition-colors"
                  >
                    {kw}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
