# ATS Resume Optimizer

## Current State
New project. No existing code.

## Requested Changes (Diff)

### Add
- User profile input: LinkedIn URL, GitHub URL, manual experience/skills fields
- GitHub repository data extraction via HTTP outcalls (repos, languages, descriptions, contributions)
- Job description input + ATS keyword extraction (rule-based parsing)
- ATS compatibility scoring (0-100%) based on keyword match, skills match, section completeness
- Resume builder with sections: Summary, Skills, Projects, Experience, Education, Certifications
- 4 ATS-friendly resume templates (Modern Professional, Minimal, Software Dev, Data Science)
- Resume editing dashboard with section-by-section editing
- Real-time resume preview
- AI-style bullet point suggestions (rule-based action verb insertion)
- ATS keyword match visualization
- Export: browser print-to-PDF, clipboard copy as plain text
- Sidebar navigation: Profile Import, Job Description, Resume Editor, ATS Score, Download
- Motoko backend: store user profiles, resume data, job descriptions per user

### Modify
- N/A (new project)

### Remove
- N/A (new project)

## Implementation Plan
1. Select components: http-outcalls (GitHub API), blob-storage (resume file upload), authorization (per-user data)
2. Generate Motoko backend with: user profile CRUD, resume sections CRUD, job description storage, ATS score storage
3. Frontend: sidebar layout, 5 main views (Profile, Job Description, Resume Editor, ATS Score, Download)
4. GitHub API integration via http-outcalls to fetch repos and languages
5. Client-side ATS scoring engine: keyword extraction, match calculation, score computation
6. Resume templates as React components with print CSS
7. Export via window.print() with print-specific CSS
