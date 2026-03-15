import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";
import { Menu } from "lucide-react";
import { useState } from "react";
import Sidebar, { type Page } from "./components/Sidebar";
import { useResumeData } from "./hooks/useResumeData";
import ATSScore from "./pages/ATSScore";
import DownloadResume from "./pages/DownloadResume";
import JobDescription from "./pages/JobDescription";
import ProfileImport from "./pages/ProfileImport";
import ResumeEditor from "./pages/ResumeEditor";

export default function App() {
  const [activePage, setActivePage] = useState<Page>("profile");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const {
    profile,
    setProfile,
    resume,
    setResume,
    job,
    setJob,
    score,
    setScore,
  } = useResumeData();

  const renderPage = () => {
    switch (activePage) {
      case "profile":
        return <ProfileImport profile={profile} setProfile={setProfile} />;
      case "job":
        return <JobDescription job={job} setJob={setJob} />;
      case "editor":
        return (
          <ResumeEditor
            resume={resume}
            setResume={setResume}
            profile={profile}
          />
        );
      case "score":
        return (
          <ATSScore
            resume={resume}
            profile={profile}
            job={job}
            score={score}
            setScore={setScore}
          />
        );
      case "download":
        return <DownloadResume resume={resume} profile={profile} job={job} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      {sidebarOpen && (
        // biome-ignore lint/a11y/useKeyWithClickEvents: overlay backdrop
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div
        className={`fixed md:static z-50 md:z-auto inset-y-0 left-0 transform transition-transform duration-300 md:transform-none ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <Sidebar
          activePage={activePage}
          onNavigate={(page) => {
            setActivePage(page);
            setSidebarOpen(false);
          }}
        />
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="md:hidden flex items-center gap-3 px-4 py-3 border-b bg-card">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(true)}
            className="p-1.5"
          >
            <Menu size={18} />
          </Button>
          <span className="font-display font-bold text-sm">ATS Optimizer</span>
        </header>

        <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full">
          {renderPage()}
        </main>

        <footer className="px-6 py-4 border-t text-center no-print">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()}. Built with love using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              caffeine.ai
            </a>
          </p>
        </footer>
      </div>

      <Toaster position="top-right" richColors />
    </div>
  );
}
