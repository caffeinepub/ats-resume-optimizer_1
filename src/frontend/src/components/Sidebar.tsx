import { cn } from "@/lib/utils";
import {
  BarChart2,
  Download,
  Edit3,
  FileCheck,
  FileText,
  User,
} from "lucide-react";

export type Page = "profile" | "job" | "editor" | "score" | "download";

const NAV_ITEMS = [
  {
    id: "profile" as Page,
    label: "Profile Import",
    icon: User,
    ocid: "nav.profile.link",
  },
  {
    id: "job" as Page,
    label: "Job Description",
    icon: FileText,
    ocid: "nav.job.link",
  },
  {
    id: "editor" as Page,
    label: "Resume Editor",
    icon: Edit3,
    ocid: "nav.editor.link",
  },
  {
    id: "score" as Page,
    label: "ATS Score",
    icon: BarChart2,
    ocid: "nav.score.link",
  },
  {
    id: "download" as Page,
    label: "Download Resume",
    icon: Download,
    ocid: "nav.download.link",
  },
];

interface SidebarProps {
  activePage: Page;
  onNavigate: (page: Page) => void;
}

export default function Sidebar({ activePage, onNavigate }: SidebarProps) {
  return (
    <aside
      className="w-64 min-h-screen flex flex-col"
      style={{ background: "oklch(var(--sidebar-bg))" }}
    >
      <div
        className="px-4 py-6 flex items-center gap-3"
        style={{ borderBottom: "1px solid oklch(var(--sidebar-border))" }}
      >
        <img
          src="/assets/generated/ats-logo-transparent.dim_80x80.png"
          alt="ATS Logo"
          className="w-8 h-8"
        />
        <div>
          <div
            className="font-display font-bold text-sm"
            style={{ color: "oklch(var(--sidebar-text-active))" }}
          >
            ATS Optimizer
          </div>
          <div
            className="text-xs"
            style={{ color: "oklch(var(--sidebar-text))" }}
          >
            Resume Intelligence
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        <div
          className="text-xs font-semibold uppercase tracking-widest mb-3 px-3"
          style={{ color: "oklch(0.45 0.015 240)" }}
        >
          Workflow
        </div>
        {NAV_ITEMS.map((item, idx) => (
          <button
            key={item.id}
            type="button"
            data-ocid={item.ocid}
            onClick={() => onNavigate(item.id)}
            className={cn(
              "sidebar-nav-item w-full",
              activePage === item.id && "active",
            )}
          >
            <span
              className="flex items-center justify-center w-6 h-6 rounded-md text-xs font-bold"
              style={{
                background: "oklch(var(--sidebar-border))",
                color: "oklch(var(--sidebar-accent))",
              }}
            >
              {idx + 1}
            </span>
            <item.icon size={15} />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div
        className="px-4 py-4"
        style={{ borderTop: "1px solid oklch(var(--sidebar-border))" }}
      >
        <div className="flex items-center gap-2 mb-1">
          <FileCheck
            size={14}
            style={{ color: "oklch(var(--sidebar-accent))" }}
          />
          <span
            className="text-xs font-medium"
            style={{ color: "oklch(var(--sidebar-text))" }}
          >
            ATS-Ready Format
          </span>
        </div>
        <p className="text-xs" style={{ color: "oklch(0.4 0.01 240)" }}>
          Your resume follows ATS best practices
        </p>
      </div>
    </aside>
  );
}
