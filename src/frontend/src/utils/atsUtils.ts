import type {
  JobData,
  Profile,
  ResumeData,
  ScoreData,
} from "../hooks/useResumeData";

const TECH_KEYWORDS = [
  "React",
  "React.js",
  "ReactJS",
  "Vue",
  "Vue.js",
  "Angular",
  "Svelte",
  "JavaScript",
  "TypeScript",
  "Python",
  "Java",
  "Go",
  "Golang",
  "Rust",
  "C++",
  "C#",
  "Ruby",
  "PHP",
  "Swift",
  "Kotlin",
  "Node.js",
  "NodeJS",
  "Express",
  "FastAPI",
  "Django",
  "Flask",
  "Spring",
  "Laravel",
  "HTML",
  "CSS",
  "SASS",
  "SCSS",
  "Tailwind",
  "Bootstrap",
  "SQL",
  "PostgreSQL",
  "MySQL",
  "MongoDB",
  "Redis",
  "Cassandra",
  "DynamoDB",
  "Firebase",
  "AWS",
  "GCP",
  "Azure",
  "Docker",
  "Kubernetes",
  "Terraform",
  "Ansible",
  "Git",
  "GitHub",
  "GitLab",
  "CI/CD",
  "Jenkins",
  "GitHub Actions",
  "REST API",
  "GraphQL",
  "gRPC",
  "WebSocket",
  "OAuth",
  "Machine Learning",
  "Deep Learning",
  "TensorFlow",
  "PyTorch",
  "scikit-learn",
  "NLP",
  "LLM",
  "Pandas",
  "NumPy",
  "Matplotlib",
  "Jupyter",
  "Microservices",
  "Serverless",
  "Event-driven",
  "Agile",
  "Scrum",
  "Kanban",
  "Linux",
  "Unix",
  "Bash",
  "Shell",
  "PowerShell",
  "Elasticsearch",
  "Kafka",
  "RabbitMQ",
  "NGINX",
  "Apache",
  "Next.js",
  "Nuxt.js",
  "Gatsby",
  "Remix",
  "Jest",
  "Cypress",
  "Playwright",
  "Mocha",
  "Selenium",
  "Webpack",
  "Vite",
  "Rollup",
  "Figma",
  "UX",
  "UI",
  "Product Design",
  "Data Engineering",
  "ETL",
  "Data Pipeline",
  "Spark",
  "Hadoop",
  "Airflow",
  "Blockchain",
  "Web3",
  "Solidity",
];

const STOP_WORDS = new Set([
  "the",
  "a",
  "an",
  "and",
  "or",
  "but",
  "in",
  "on",
  "at",
  "to",
  "for",
  "of",
  "with",
  "by",
  "from",
  "as",
  "is",
  "was",
  "are",
  "were",
  "be",
  "been",
  "being",
  "have",
  "has",
  "had",
  "do",
  "does",
  "did",
  "will",
  "would",
  "could",
  "should",
  "may",
  "might",
  "can",
  "this",
  "that",
  "these",
  "those",
  "we",
  "you",
  "they",
  "it",
  "he",
  "she",
  "our",
  "your",
  "their",
  "its",
  "who",
  "which",
  "what",
  "how",
  "when",
  "where",
  "why",
  "not",
  "no",
  "nor",
  "so",
  "yet",
  "both",
  "either",
  "neither",
  "each",
  "few",
  "more",
  "most",
  "other",
  "some",
  "such",
  "than",
  "too",
  "very",
  "just",
  "also",
  "about",
  "above",
  "after",
  "before",
  "between",
  "during",
  "including",
  "until",
  "experience",
  "work",
  "team",
  "ability",
  "strong",
  "required",
  "preferred",
  "skills",
  "responsibilities",
  "requirements",
  "qualifications",
]);

export function extractKeywords(text: string): string[] {
  const lower = text.toLowerCase();
  const matched = TECH_KEYWORDS.filter((kw) =>
    lower.includes(kw.toLowerCase()),
  );

  // Also extract capitalized non-stop words
  const words = text.split(/[\s,;.!?]+/);
  const extraKeywords = words.filter((w) => {
    if (w.length < 2) return false;
    if (STOP_WORDS.has(w.toLowerCase())) return false;
    if (/^[A-Z]/.test(w) && w.length > 2) return true;
    if (w.includes("+") || w.includes("#")) return true;
    return false;
  });

  const combined = [...new Set([...matched, ...extraKeywords])];
  return combined.slice(0, 40);
}

export function detectJobTitle(text: string): string {
  const titles = [
    "Senior Software Engineer",
    "Software Engineer",
    "Frontend Engineer",
    "Backend Engineer",
    "Full Stack Engineer",
    "Full Stack Developer",
    "Frontend Developer",
    "Backend Developer",
    "Data Scientist",
    "Data Engineer",
    "ML Engineer",
    "Machine Learning Engineer",
    "DevOps Engineer",
    "Platform Engineer",
    "SRE",
    "Site Reliability Engineer",
    "Product Manager",
    "Engineering Manager",
    "Tech Lead",
    "Principal Engineer",
    "iOS Developer",
    "Android Developer",
    "Mobile Developer",
    "QA Engineer",
    "Security Engineer",
    "Cloud Engineer",
  ];
  const lower = text.toLowerCase();
  return (
    titles.find((t) => lower.includes(t.toLowerCase())) ?? "Software Engineer"
  );
}

export function detectExperienceLevel(text: string): string {
  const lower = text.toLowerCase();
  if (
    lower.includes("senior") ||
    lower.includes("sr.") ||
    lower.includes("lead") ||
    lower.includes("5+ years") ||
    lower.includes("7+ years")
  )
    return "Senior";
  if (
    lower.includes("junior") ||
    lower.includes("jr.") ||
    lower.includes("entry") ||
    lower.includes("0-2 years") ||
    lower.includes("1-2 years")
  )
    return "Junior";
  if (
    lower.includes("mid") ||
    lower.includes("3-5 years") ||
    lower.includes("2-4 years")
  )
    return "Mid-level";
  return "Mid-level";
}

export function extractRequiredSkills(text: string): string[] {
  return TECH_KEYWORDS.filter((kw) =>
    text.toLowerCase().includes(kw.toLowerCase()),
  ).slice(0, 20);
}

export function computeAtsScore(
  resume: ResumeData,
  profile: Profile,
  job: JobData,
): ScoreData {
  const allText = [
    profile.summary,
    resume.summary,
    resume.skills.join(" "),
    ...resume.experience.flatMap((e) => [e.jobTitle, e.company, ...e.bullets]),
    ...resume.projects.flatMap((p) => [
      p.name,
      p.description,
      p.techStack,
      ...p.bullets,
    ]),
    ...resume.education.map((e) => e.degree),
  ]
    .join(" ")
    .toLowerCase();

  const keywords = job.keywords;
  const matched = keywords.filter((kw) => allText.includes(kw.toLowerCase()));
  const missing = keywords.filter((kw) => !allText.includes(kw.toLowerCase()));

  const keywordScore =
    keywords.length > 0 ? (matched.length / keywords.length) * 100 : 0;

  const reqSkills = job.requiredSkills;
  const matchedSkills = reqSkills.filter((s) =>
    allText.includes(s.toLowerCase()),
  ).length;
  const skillsScore =
    reqSkills.length > 0 ? (matchedSkills / reqSkills.length) * 100 : 50;

  const sections = [
    resume.summary || profile.summary,
    resume.skills.length > 0,
    resume.experience.length > 0,
    resume.projects.length > 0,
    resume.education.length > 0,
  ];
  const filledSections = sections.filter(Boolean).length;
  const completenessScore = (filledSections / sections.length) * 100;

  const hasRelevantExp = resume.experience.some((e) =>
    job.keywords.some(
      (kw) =>
        e.jobTitle.toLowerCase().includes(kw.toLowerCase()) ||
        e.bullets.some((b) => b.toLowerCase().includes(kw.toLowerCase())),
    ),
  );
  const experienceScore = hasRelevantExp ? 80 : 40;

  const overall =
    keywordScore * 0.4 + skillsScore * 0.3 + completenessScore * 0.3;

  const suggestions: string[] = [];
  if (keywordScore < 60)
    suggestions.push(`Add missing keywords: ${missing.slice(0, 3).join(", ")}`);
  if (resume.skills.length < 8)
    suggestions.push("Add more technical skills to improve keyword matching");
  if (resume.experience.length === 0)
    suggestions.push("Add work experience entries to your resume");
  if (resume.projects.length === 0)
    suggestions.push("Add projects to demonstrate your technical skills");
  if (!resume.summary && !profile.summary)
    suggestions.push("Add a professional summary tailored to this role");
  if (resume.experience.some((e) => e.bullets.length < 2))
    suggestions.push(
      "Expand experience bullet points with measurable achievements",
    );
  if (missing.length > 0)
    suggestions.push(
      `Include these high-value keywords: ${missing.slice(0, 5).join(", ")}`,
    );

  return {
    overall: Math.round(Math.min(overall, 100)),
    keywordScore: Math.round(keywordScore),
    skillsScore: Math.round(skillsScore),
    completenessScore: Math.round(completenessScore),
    experienceScore: Math.round(experienceScore),
    matchedKeywords: matched,
    missingKeywords: missing,
    suggestions,
  };
}

const ACTION_VERBS = [
  "Developed",
  "Implemented",
  "Architected",
  "Optimized",
  "Led",
  "Reduced",
  "Increased",
  "Delivered",
  "Automated",
  "Integrated",
  "Designed",
  "Built",
  "Deployed",
  "Managed",
  "Launched",
  "Collaborated",
  "Engineered",
  "Migrated",
  "Refactored",
  "Accelerated",
  "Streamlined",
  "Established",
  "Improved",
];

export function improveBullet(bullet: string): string {
  const lower = bullet.toLowerCase().trim();
  // Remove weak starts
  const weakStarts = [
    "worked on",
    "helped with",
    "was responsible for",
    "responsible for",
    "did",
    "made",
  ];
  let cleaned = bullet;
  for (const weak of weakStarts) {
    if (lower.startsWith(weak)) {
      cleaned = bullet.slice(weak.length).trim();
      if (cleaned) cleaned = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
      break;
    }
  }
  // Add action verb if not starting with one
  const startsWithVerb = ACTION_VERBS.some((v) =>
    cleaned.toLowerCase().startsWith(v.toLowerCase()),
  );
  if (!startsWithVerb) {
    const verb = ACTION_VERBS[Math.floor(Math.random() * ACTION_VERBS.length)];
    cleaned = `${verb} ${cleaned.charAt(0).toLowerCase()}${cleaned.slice(1)}`;
  }
  // Add metric hint if no numbers
  if (!/\d/.test(cleaned)) {
    const metrics = [
      ", improving performance by 30%",
      ", reducing load time by 25%",
      ", increasing team efficiency by 20%",
      ", serving 10K+ users",
    ];
    cleaned += metrics[Math.floor(Math.random() * metrics.length)];
  }
  return cleaned;
}

export function enhanceSummary(summary: string, jobTitle: string): string {
  const adjectives = [
    "results-driven",
    "innovative",
    "experienced",
    "passionate",
    "detail-oriented",
  ];
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  if (!summary.trim()) {
    return `${adj.charAt(0).toUpperCase() + adj.slice(1)} ${jobTitle} with a strong background in building scalable, high-performance solutions. Proven track record of delivering impactful projects and collaborating with cross-functional teams to drive business outcomes.`;
  }
  return `${adj.charAt(0).toUpperCase() + adj.slice(1)} professional — ${summary.trim()}`;
}

export function generateCoverLetter(profile: Profile, job: JobData): string {
  return `Dear Hiring Manager,

I am writing to express my strong interest in the ${job.jobTitle || "open position"} role at your organization. As a dedicated professional with expertise in ${job.requiredSkills.slice(0, 3).join(", ") || "software development"}, I am confident in my ability to make a meaningful contribution to your team.

${profile.summary || "I bring a strong technical background and a passion for building high-quality software solutions."}

Throughout my career, I have developed deep proficiency in ${job.keywords.slice(0, 4).join(", ") || "modern technologies"}, allowing me to deliver robust and scalable solutions. I am particularly drawn to this opportunity because it aligns with my expertise and career aspirations.

I am eager to bring my skills and experience to your team and contribute to your mission. I would welcome the opportunity to discuss how my background can benefit your organization.

Thank you for your time and consideration.

Warm regards,
${profile.fullName || "[Your Name]"}
${profile.email || ""}
${profile.phone || ""}
${profile.linkedinUrl ? `LinkedIn: ${profile.linkedinUrl}` : ""}`;
}
