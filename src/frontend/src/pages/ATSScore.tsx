import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  AlertCircle,
  CheckCircle2,
  Lightbulb,
  RefreshCw,
  TrendingUp,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import type {
  JobData,
  Profile,
  ResumeData,
  ScoreData,
} from "../hooks/useResumeData";
import { computeAtsScore } from "../utils/atsUtils";

interface Props {
  resume: ResumeData;
  profile: Profile;
  job: JobData;
  score: ScoreData;
  setScore: (s: ScoreData | ((prev: ScoreData) => ScoreData)) => void;
}

function ScoreRing({ score, size = 160 }: { score: number; size?: number }) {
  const radius = (size - 20) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color =
    score >= 70
      ? "oklch(0.55 0.17 145)"
      : score >= 40
        ? "oklch(0.72 0.16 68)"
        : "oklch(0.55 0.22 25)";
  const label = score >= 70 ? "Excellent" : score >= 40 ? "Good" : "Needs Work";

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90" aria-hidden="true">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="oklch(0.9 0.01 220)"
          strokeWidth="12"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="12"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="score-ring transition-all duration-1000"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-display font-bold" style={{ color }}>
          {score}%
        </span>
        <span className="text-xs font-medium text-muted-foreground mt-0.5">
          {label}
        </span>
      </div>
    </div>
  );
}

export default function ATSScore({
  resume,
  profile,
  job,
  score,
  setScore,
}: Props) {
  const [animated, setAnimated] = useState(false);

  const refreshScore = () => {
    if (!job.analyzed) {
      toast.error("Please analyze a job description first");
      return;
    }
    const newScore = computeAtsScore(resume, profile, job);
    setScore(newScore);
    setAnimated(false);
    setTimeout(() => setAnimated(true), 50);
    toast.success("ATS score refreshed!");
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: run once on mount
  useEffect(() => {
    if (job.analyzed && score.overall === 0) {
      const newScore = computeAtsScore(resume, profile, job);
      setScore(newScore);
    }
    setTimeout(() => setAnimated(true), 100);
  }, []);

  const breakdown = [
    { label: "Keyword Match", value: score.keywordScore, icon: TrendingUp },
    { label: "Skills Match", value: score.skillsScore, icon: CheckCircle2 },
    {
      label: "Section Completeness",
      value: score.completenessScore,
      icon: CheckCircle2,
    },
    {
      label: "Experience Relevance",
      value: score.experienceScore,
      icon: TrendingUp,
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">
            ATS Score
          </h1>
          <p className="text-muted-foreground mt-1">
            See how well your resume matches the job description.
          </p>
        </div>
        <Button
          type="button"
          data-ocid="score.refresh.primary_button"
          onClick={refreshScore}
          variant="outline"
          className="gap-2"
        >
          <RefreshCw size={14} /> Refresh Score
        </Button>
      </div>

      {!job.analyzed ? (
        <Card data-ocid="score.empty_state">
          <CardContent className="py-16 text-center">
            <AlertCircle className="mx-auto text-warning mb-3" size={32} />
            <p className="font-semibold">No job description analyzed yet</p>
            <p className="text-sm text-muted-foreground mt-1">
              Go to Job Description and analyze a job posting first.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-base font-display text-center">
                Overall ATS Score
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center space-y-4">
              <div data-ocid="score.panel">
                <ScoreRing score={animated ? score.overall : 0} size={180} />
              </div>
              <div className="w-full space-y-2">
                {breakdown.map((b) => (
                  <div key={b.label} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">{b.label}</span>
                      <span className="font-medium">{b.value}%</span>
                    </div>
                    <Progress
                      value={animated ? b.value : 0}
                      className="h-1.5"
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="lg:col-span-2 space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-display flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-success" />
                  Matched Keywords
                  <Badge variant="secondary" className="ml-auto">
                    {score.matchedKeywords.length}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {score.matchedKeywords.length === 0 ? (
                  <p
                    className="text-sm text-muted-foreground"
                    data-ocid="score.matched.empty_state"
                  >
                    No keywords matched yet.
                  </p>
                ) : (
                  <div className="flex flex-wrap gap-1.5">
                    {score.matchedKeywords.map((kw) => (
                      <span
                        key={kw}
                        className="tag-chip"
                        style={{
                          background: "oklch(0.55 0.17 145 / 0.1)",
                          color: "oklch(0.4 0.15 145)",
                          border: "1px solid oklch(0.55 0.17 145 / 0.3)",
                        }}
                      >
                        <CheckCircle2 size={10} />
                        {kw}
                      </span>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-display flex items-center gap-2">
                  <AlertCircle size={14} className="text-destructive" />
                  Missing Keywords
                  <Badge variant="secondary" className="ml-auto">
                    {score.missingKeywords.length}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {score.missingKeywords.length === 0 ? (
                  <p
                    className="text-sm text-muted-foreground"
                    data-ocid="score.missing.empty_state"
                  >
                    All keywords matched! 🎉
                  </p>
                ) : (
                  <div className="flex flex-wrap gap-1.5">
                    {score.missingKeywords.map((kw) => (
                      <span
                        key={kw}
                        className="tag-chip"
                        style={{
                          background: "oklch(0.55 0.22 25 / 0.08)",
                          color: "oklch(0.45 0.2 25)",
                          border: "1px solid oklch(0.55 0.22 25 / 0.25)",
                        }}
                      >
                        <AlertCircle size={10} />
                        {kw}
                      </span>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-display flex items-center gap-2">
                  <Lightbulb size={14} className="text-warning" />
                  Improvement Suggestions
                </CardTitle>
              </CardHeader>
              <CardContent>
                {score.suggestions.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    Your resume looks great!
                  </p>
                ) : (
                  <ol className="space-y-2">
                    {score.suggestions.map((s, i) => (
                      <li
                        // biome-ignore lint/suspicious/noArrayIndexKey: suggestions are ordered
                        key={i}
                        data-ocid={`score.suggestions.item.${i + 1}`}
                        className="flex gap-3 text-sm"
                      >
                        <span
                          className="shrink-0 flex items-center justify-center w-5 h-5 rounded-full text-xs font-bold"
                          style={{
                            background: "oklch(0.72 0.16 68 / 0.15)",
                            color: "oklch(0.55 0.16 68)",
                          }}
                        >
                          {i + 1}
                        </span>
                        <span className="text-foreground">{s}</span>
                      </li>
                    ))}
                  </ol>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
