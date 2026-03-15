import { useCallback, useState } from "react";

export interface GitHubRepo {
  name: string;
  description: string;
  language: string;
  html_url: string;
  stargazers_count: number;
  topics: string[];
}

export interface Profile {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedinUrl: string;
  githubUsername: string;
  portfolioUrl: string;
  summary: string;
  importedResumeText: string;
  githubRepos: GitHubRepo[];
}

export interface ExperienceItem {
  id: string;
  jobTitle: string;
  company: string;
  duration: string;
  bullets: string[];
}

export interface ProjectItem {
  id: string;
  name: string;
  description: string;
  techStack: string;
  bullets: string[];
}

export interface EducationItem {
  id: string;
  degree: string;
  school: string;
  year: string;
}

export interface CertificationItem {
  id: string;
  name: string;
  issuer: string;
  year: string;
}

export interface ResumeData {
  summary: string;
  skills: string[];
  experience: ExperienceItem[];
  projects: ProjectItem[];
  education: EducationItem[];
  certifications: CertificationItem[];
}

export interface JobData {
  description: string;
  keywords: string[];
  requiredSkills: string[];
  experienceLevel: string;
  jobTitle: string;
  analyzed: boolean;
}

export interface ScoreData {
  overall: number;
  keywordScore: number;
  skillsScore: number;
  completenessScore: number;
  experienceScore: number;
  matchedKeywords: string[];
  missingKeywords: string[];
  suggestions: string[];
}

const defaultProfile: Profile = {
  fullName: "",
  email: "",
  phone: "",
  location: "",
  linkedinUrl: "",
  githubUsername: "",
  portfolioUrl: "",
  summary: "",
  importedResumeText: "",
  githubRepos: [],
};

const defaultResume: ResumeData = {
  summary: "",
  skills: [],
  experience: [],
  projects: [],
  education: [],
  certifications: [],
};

const defaultJob: JobData = {
  description: "",
  keywords: [],
  requiredSkills: [],
  experienceLevel: "",
  jobTitle: "",
  analyzed: false,
};

const defaultScore: ScoreData = {
  overall: 0,
  keywordScore: 0,
  skillsScore: 0,
  completenessScore: 0,
  experienceScore: 0,
  matchedKeywords: [],
  missingKeywords: [],
  suggestions: [],
};

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw) as T;
    return { ...fallback, ...(parsed as object) } as T;
  } catch {
    return fallback;
  }
}

function save<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function useResumeData() {
  const [profile, setProfileState] = useState<Profile>(() =>
    load("ats_profile", defaultProfile),
  );
  const [resume, setResumeState] = useState<ResumeData>(() =>
    load("ats_resume", defaultResume),
  );
  const [job, setJobState] = useState<JobData>(() =>
    load("ats_job", defaultJob),
  );
  const [score, setScoreState] = useState<ScoreData>(() =>
    load("ats_score", defaultScore),
  );

  const setProfile = useCallback(
    (updater: Profile | ((prev: Profile) => Profile)) => {
      setProfileState((prev) => {
        const next = typeof updater === "function" ? updater(prev) : updater;
        save("ats_profile", next);
        return next;
      });
    },
    [],
  );

  const setResume = useCallback(
    (updater: ResumeData | ((prev: ResumeData) => ResumeData)) => {
      setResumeState((prev) => {
        const next = typeof updater === "function" ? updater(prev) : updater;
        save("ats_resume", next);
        return next;
      });
    },
    [],
  );

  const setJob = useCallback(
    (updater: JobData | ((prev: JobData) => JobData)) => {
      setJobState((prev) => {
        const next = typeof updater === "function" ? updater(prev) : updater;
        save("ats_job", next);
        return next;
      });
    },
    [],
  );

  const setScore = useCallback(
    (updater: ScoreData | ((prev: ScoreData) => ScoreData)) => {
      setScoreState((prev) => {
        const next = typeof updater === "function" ? updater(prev) : updater;
        save("ats_score", next);
        return next;
      });
    },
    [],
  );

  return {
    profile,
    setProfile,
    resume,
    setResume,
    job,
    setJob,
    score,
    setScore,
  };
}
