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

// Unused but kept for potential external use
export { STOP_WORDS };

export function extractKeywords(text: string): string[] {
  const lower = text.toLowerCase();
  const matched = TECH_KEYWORDS.filter((kw) =>
    lower.includes(kw.toLowerCase()),
  );
  return [...new Set(matched)].slice(0, 40);
}

export function extractTechnicalSkills(text: string): string[] {
  const lower = text.toLowerCase();
  return TECH_KEYWORDS.filter((kw) => lower.includes(kw.toLowerCase())).slice(
    0,
    30,
  );
}

export function extractExperienceRequirements(text: string): string[] {
  const results: string[] = [];
  const lower = text.toLowerCase();

  const yearPatterns: [RegExp, string][] = [
    [/\b0[\s-]*1\s*years?/i, "0-1 year experience"],
    [/\b1[\s-]*2\s*years?/i, "1-2 years of experience"],
    [/\b2[\s-]*3\s*years?/i, "2-3 years of experience"],
    [/\b3[\s-]*5\s*years?/i, "3-5 years of experience"],
    [/\b5[\s-]*7\s*years?/i, "5-7 years of experience"],
    [/\b7\+\s*years?/i, "7+ years of experience required"],
    [/\b5\+\s*years?/i, "5+ years of experience required"],
    [/\b3\+\s*years?/i, "3+ years of experience required"],
    [/\b2\+\s*years?/i, "2+ years of experience required"],
    [/\b1\+\s*years?/i, "1+ year of experience required"],
    [/\b(\d+)\+\s*years?/i, "Multiple years of experience required"],
  ];

  for (const [pattern, label] of yearPatterns) {
    if (pattern.test(text) && !results.includes(label)) {
      results.push(label);
      break;
    }
  }

  if (lower.includes("senior") || lower.includes("sr.")) {
    results.push("Senior level position");
  }
  if (lower.includes("junior") || lower.includes("jr.")) {
    results.push("Junior level position");
  }
  if (lower.includes("mid-level") || lower.includes("mid level")) {
    results.push("Mid-level position");
  }
  if (lower.includes("entry level") || lower.includes("entry-level")) {
    results.push("Entry level position");
  }
  if (
    lower.includes("internship") ||
    lower.includes("intern") ||
    lower.includes("co-op")
  ) {
    results.push("Internship experience preferred");
  }
  if (
    lower.includes("fresher") ||
    lower.includes("new graduate") ||
    lower.includes("fresh graduate") ||
    lower.includes("recent graduate")
  ) {
    results.push("Open to fresh graduates / new graduates");
  }
  if (lower.includes("lead") || lower.includes("tech lead")) {
    results.push("Leadership / tech lead experience expected");
  }
  if (lower.includes("team player") || lower.includes("cross-functional")) {
    results.push("Team collaboration experience required");
  }

  return [...new Set(results)];
}

export function extractProjectRequirements(text: string): string[] {
  const DOMAIN_KEYWORDS = [
    "web application",
    "mobile app",
    "API",
    "microservices",
    "data pipeline",
    "machine learning model",
    "e-commerce",
    "SaaS",
    "cloud infrastructure",
    "dashboard",
    "real-time",
    "distributed system",
    "open source",
    "full stack",
    "backend service",
    "frontend application",
    "data warehouse",
    "CI/CD pipeline",
    "REST API",
    "GraphQL API",
    "authentication system",
    "payment integration",
    "recommendation system",
    "search engine",
    "content management",
    "analytics platform",
  ];

  const lower = text.toLowerCase();
  const results: string[] = [];

  for (const kw of DOMAIN_KEYWORDS) {
    if (lower.includes(kw.toLowerCase())) {
      results.push(kw.charAt(0).toUpperCase() + kw.slice(1));
    }
  }

  // Also capture phrases after trigger words
  const triggerPhrases = [
    /experience with ([A-Za-z][A-Za-z0-9\s-]{3,30}?)(?=[,.]|\band\b|\bor\b|$)/gi,
    /knowledge of ([A-Za-z][A-Za-z0-9\s-]{3,30}?)(?=[,.]|\band\b|\bor\b|$)/gi,
    /familiarity with ([A-Za-z][A-Za-z0-9\s-]{3,30}?)(?=[,.]|\band\b|\bor\b|$)/gi,
    /background in ([A-Za-z][A-Za-z0-9\s-]{3,30}?)(?=[,.]|\band\b|\bor\b|$)/gi,
    /projects? in ([A-Za-z][A-Za-z0-9\s-]{3,30}?)(?=[,.]|\band\b|\bor\b|$)/gi,
  ];

  for (const pattern of triggerPhrases) {
    let match = pattern.exec(text);
    while (match !== null) {
      const captured = match[1].trim();
      if (captured.length > 3 && !results.includes(captured)) {
        results.push(captured);
      }
      match = pattern.exec(text);
    }
  }

  return [...new Set(results)].slice(0, 10);
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

export function optimizeResumeForJob(
  resume: ResumeData,
  _profile: Profile,
  job: JobData,
): ResumeData {
  // Merge missing required skills
  const existingSkillsLower = resume.skills.map((s) => s.toLowerCase());
  const newSkills = job.technicalSkills.filter(
    (s) => !existingSkillsLower.includes(s.toLowerCase()),
  );
  const mergedSkills = [...resume.skills, ...newSkills];

  // Enhance summary
  const topSkills = job.technicalSkills.slice(0, 3).join(", ");
  const tailoredIntro = job.jobTitle
    ? `Results-driven ${job.jobTitle} with expertise in ${topSkills || "modern technologies"}. `
    : "";
  const updatedSummary = resume.summary
    ? `${tailoredIntro}${resume.summary}`
    : tailoredIntro ||
      `Experienced professional skilled in ${
        job.requiredSkills.slice(0, 4).join(", ") ||
        "modern software development"
      }. Passionate about delivering high-quality solutions aligned with business goals.`;

  // Enhance experience bullets with missing keywords
  const relevantKeywords = [
    ...job.requiredSkills,
    ...job.technicalSkills,
  ].filter(Boolean);

  const updatedExperience = resume.experience.map((exp) => {
    const expText = [...exp.bullets, exp.jobTitle].join(" ").toLowerCase();
    // Find a keyword not already in this experience
    const missingKw = relevantKeywords.find(
      (kw) => !expText.includes(kw.toLowerCase()),
    );
    if (!missingKw) return exp;

    const extraBullet = `Leveraged ${missingKw} to improve system performance and delivery quality`;
    return { ...exp, bullets: [...exp.bullets, extraBullet] };
  });

  return {
    ...resume,
    skills: mergedSkills,
    summary: updatedSummary,
    experience: updatedExperience,
  };
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
  const startsWithVerb = ACTION_VERBS.some((v) =>
    cleaned.toLowerCase().startsWith(v.toLowerCase()),
  );
  if (!startsWithVerb) {
    const verb = ACTION_VERBS[Math.floor(Math.random() * ACTION_VERBS.length)];
    cleaned = `${verb} ${cleaned.charAt(0).toLowerCase()}${cleaned.slice(1)}`;
  }
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
