import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  Briefcase,
  CheckCircle2,
  FolderOpen,
  Search,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { JobData } from "../hooks/useResumeData";
import {
  detectExperienceLevel,
  detectJobTitle,
  extractExperienceRequirements,
  extractKeywords,
  extractProjectRequirements,
  extractRequiredSkills,
  extractTechnicalSkills,
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
    const technicalSkills = extractTechnicalSkills(description);
    const experienceRequirements = extractExperienceRequirements(description);
    const projectRequirements = extractProjectRequirements(description);
    const keywords = extractKeywords(description);
    const requiredSkills = extractRequiredSkills(description);
    const jobTitle = detectJobTitle(description);
    const experienceLevel = detectExperienceLevel(description);

    setJob({
      description,
      keywords,
      requiredSkills,
      technicalSkills,
      experienceRequirements,
      projectRequirements,
      jobTitle,
      experienceLevel,
      analyzed: true,
    });
    toast.success(
      `Analysis complete — ${technicalSkills.length} technical skills, ${experienceRequirements.length} experience requirements found`,
    );
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
          Paste the job description to extract technical skills, experience
          requirements, and project domains.
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
        <div className="space-y-6 animate-fade-in">
          {/* Card 1: Detected Job Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-display flex items-center gap-2">
                <Briefcase size={16} /> Detected Job Info
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
              </div>
            </CardContent>
          </Card>

          {/* Cards 2-4 in grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Card 2: Technical Skills */}
            <Card className="lg:col-span-1">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-display flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-success" />
                  Technical Skills Required
                  <Badge variant="secondary" className="ml-auto text-xs">
                    {job.technicalSkills.length}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {job.technicalSkills.length === 0 ? (
                  <p
                    className="text-sm text-muted-foreground"
                    data-ocid="job.technical.empty_state"
                  >
                    No specific tech skills detected.
                  </p>
                ) : (
                  <div className="flex flex-wrap gap-1.5">
                    {job.technicalSkills.map((skill) => (
                      <Badge
                        key={skill}
                        className="bg-success/10 text-success border-success/20 hover:bg-success/20 gap-1"
                      >
                        <CheckCircle2 size={9} />
                        {skill}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Card 3: Experience Requirements */}
            <Card className="lg:col-span-1">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-display flex items-center gap-2">
                  <TrendingUp size={14} className="text-primary" />
                  Experience Requirements
                  <Badge variant="secondary" className="ml-auto text-xs">
                    {job.experienceRequirements.length}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {job.experienceRequirements.length === 0 ? (
                  <p
                    className="text-sm text-muted-foreground"
                    data-ocid="job.experience.empty_state"
                  >
                    No explicit experience requirements found.
                  </p>
                ) : (
                  <ul className="space-y-2">
                    {job.experienceRequirements.map((req) => (
                      <li key={req} className="flex items-start gap-2 text-sm">
                        <TrendingUp
                          size={14}
                          className="text-primary mt-0.5 shrink-0"
                        />
                        <span className="text-foreground">{req}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>

            {/* Card 4: Project / Domain Areas */}
            <Card className="lg:col-span-1">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-display flex items-center gap-2">
                  <FolderOpen size={14} className="text-warning" />
                  Required Project / Domain Areas
                  <Badge variant="secondary" className="ml-auto text-xs">
                    {job.projectRequirements.length}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {job.projectRequirements.length === 0 ? (
                  <p
                    className="text-sm text-muted-foreground"
                    data-ocid="job.project.empty_state"
                  >
                    No specific project domains detected.
                  </p>
                ) : (
                  <div className="flex flex-wrap gap-1.5">
                    {job.projectRequirements.map((proj) => (
                      <span
                        key={proj}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                        style={{
                          background: "oklch(0.72 0.16 68 / 0.12)",
                          color: "oklch(0.5 0.14 68)",
                          border: "1px solid oklch(0.72 0.16 68 / 0.3)",
                        }}
                      >
                        {proj}
                      </span>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Required Skills section */}
          {job.requiredSkills.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-display flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-primary" />
                  All Required Skills
                  <Badge variant="secondary" className="ml-auto text-xs">
                    {job.requiredSkills.length}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
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
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
