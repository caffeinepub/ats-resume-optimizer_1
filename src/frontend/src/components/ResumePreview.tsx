import type { Profile, ResumeData } from "../hooks/useResumeData";

type TemplateId = "modern" | "minimal" | "software" | "datascience";

interface Props {
  resume: ResumeData;
  profile: Profile;
  template?: TemplateId;
  scale?: number;
}

function SectionHeader({ title, color }: { title: string; color?: string }) {
  return (
    <div
      style={{
        borderBottom: "2px solid",
        borderColor: color || "#1a1a2e",
        marginBottom: 8,
        paddingBottom: 4,
        marginTop: 16,
      }}
    >
      <h3
        style={{
          fontSize: 12,
          fontWeight: 700,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: color || "#1a1a2e",
          margin: 0,
        }}
      >
        {title}
      </h3>
    </div>
  );
}

export default function ResumePreview({
  resume,
  profile,
  template = "modern",
  scale,
}: Props) {
  const accentColors: Record<TemplateId, string> = {
    modern: "#0a5c44",
    minimal: "#1a1a1a",
    software: "#1d4ed8",
    datascience: "#7c3aed",
  };

  const accent = accentColors[template];
  const allSummary = resume.summary || profile.summary;

  const containerStyle: React.CSSProperties = {
    fontFamily: "'Plus Jakarta Sans', 'Helvetica Neue', Arial, sans-serif",
    fontSize: 11,
    lineHeight: 1.5,
    color: "#1a1a1a",
    background: "white",
    padding: "40px 48px",
    minHeight: 900,
    ...(scale
      ? {
          transform: `scale(${scale})`,
          transformOrigin: "top left",
          width: `${100 / scale}%`,
        }
      : {}),
  };

  const strip = (url: string) => url.replace(/^https?:\/\//i, "");

  return (
    <div style={containerStyle}>
      <div
        style={{
          borderBottom: `3px solid ${accent}`,
          paddingBottom: 16,
          marginBottom: 4,
        }}
      >
        <h1
          style={{
            fontSize: 24,
            fontWeight: 800,
            color: accent,
            margin: 0,
            letterSpacing: "-0.01em",
          }}
        >
          {profile.fullName || "Your Name"}
        </h1>
        <div
          style={{
            display: "flex",
            gap: 12,
            marginTop: 6,
            flexWrap: "wrap",
            fontSize: 10,
            color: "#555",
          }}
        >
          {profile.email && <span>✉ {profile.email}</span>}
          {profile.phone && <span>☏ {profile.phone}</span>}
          {profile.location && <span>⌖ {profile.location}</span>}
          {profile.linkedinUrl && (
            <span style={{ color: "#0077b5" }}>
              in/
              {strip(profile.linkedinUrl).replace(/.*linkedin\.com\/in\//i, "")}
            </span>
          )}
          {profile.githubUsername && (
            <span>⌥ github.com/{profile.githubUsername}</span>
          )}
          {profile.portfolioUrl && <span>⊕ {strip(profile.portfolioUrl)}</span>}
        </div>
      </div>

      {allSummary && (
        <>
          <SectionHeader title="Professional Summary" color={accent} />
          <p style={{ margin: 0, color: "#333", fontSize: 11 }}>{allSummary}</p>
        </>
      )}

      {resume.skills.length > 0 && (
        <>
          <SectionHeader title="Technical Skills" color={accent} />
          <p style={{ margin: 0, color: "#333" }}>
            {resume.skills.join(" • ")}
          </p>
        </>
      )}

      {resume.experience.length > 0 && (
        <>
          <SectionHeader title="Work Experience" color={accent} />
          {resume.experience.map((exp, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: ordered items
            <div key={i} style={{ marginBottom: 12 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                }}
              >
                <div>
                  <span style={{ fontWeight: 700, fontSize: 12 }}>
                    {exp.jobTitle}
                  </span>
                  {exp.company && (
                    <span style={{ color: "#555", fontWeight: 500 }}>
                      {" "}
                      | {exp.company}
                    </span>
                  )}
                </div>
                <span
                  style={{ fontSize: 10, color: "#777", whiteSpace: "nowrap" }}
                >
                  {exp.duration}
                </span>
              </div>
              <ul style={{ margin: "4px 0 0", paddingLeft: 16 }}>
                {exp.bullets.filter(Boolean).map((b, bi) => (
                  // biome-ignore lint/suspicious/noArrayIndexKey: ordered items
                  <li key={bi} style={{ marginBottom: 2, color: "#333" }}>
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </>
      )}

      {resume.projects.length > 0 && (
        <>
          <SectionHeader title="Projects" color={accent} />
          {resume.projects.map((p, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: ordered items
            <div key={i} style={{ marginBottom: 12 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                }}
              >
                <span style={{ fontWeight: 700, fontSize: 12 }}>{p.name}</span>
                {p.techStack && (
                  <span style={{ fontSize: 10, color: "#777" }}>
                    {p.techStack}
                  </span>
                )}
              </div>
              {p.description && (
                <p style={{ margin: "2px 0", color: "#555", fontSize: 10 }}>
                  {p.description}
                </p>
              )}
              <ul style={{ margin: "2px 0 0", paddingLeft: 16 }}>
                {p.bullets.filter(Boolean).map((b, bi) => (
                  // biome-ignore lint/suspicious/noArrayIndexKey: ordered items
                  <li key={bi} style={{ marginBottom: 2, color: "#333" }}>
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </>
      )}

      {resume.education.length > 0 && (
        <>
          <SectionHeader title="Education" color={accent} />
          {resume.education.map((edu) => (
            <div
              key={edu.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 4,
              }}
            >
              <div>
                <span style={{ fontWeight: 600 }}>{edu.degree}</span>
                {edu.school && (
                  <span style={{ color: "#555" }}> | {edu.school}</span>
                )}
              </div>
              <span style={{ color: "#777", fontSize: 10 }}>{edu.year}</span>
            </div>
          ))}
        </>
      )}

      {resume.certifications.length > 0 && (
        <>
          <SectionHeader title="Certifications" color={accent} />
          {resume.certifications.map((c) => (
            <div
              key={c.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 3,
              }}
            >
              <div>
                <span style={{ fontWeight: 600 }}>{c.name}</span>
                {c.issuer && (
                  <span style={{ color: "#555" }}> | {c.issuer}</span>
                )}
              </div>
              <span style={{ color: "#777", fontSize: 10 }}>{c.year}</span>
            </div>
          ))}
        </>
      )}
    </div>
  );
}
