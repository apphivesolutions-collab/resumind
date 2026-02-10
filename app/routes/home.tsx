import Navbar from "~/components/Navbar";

import ResumeCard from "~/components/ResumeCard";
import { usePuterStore } from "~/lib/puter";
import { Link, useNavigate } from "react-router";
import type { MetaArgs } from "react-router";
import { useEffect, useState } from "react";

export function meta({ }: MetaArgs) {
  return [
    { title: "ResuMind - The AI-Powered Resume Builder & Analyzer" },
    { name: "description", content: "Stop guessing if your resume is good enough. Get instant AI feedback, check your ATS score, and draft professional content in seconds with ResuMind." },
    { property: "og:title", content: "ResuMind - The AI-Powered Resume Builder & Analyzer" },
    { property: "og:description", content: "Stop guessing if your resume is good enough. Get instant AI feedback, check your ATS score, and draft professional content in seconds with ResuMind." },
    { property: "og:image", content: "https://resumind-ai-cyan.vercel.app/resumind-og-image.png?v=2" },
    { property: "og:url", content: "https://resumind-ai-cyan.vercel.app/" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:image", content: "https://resumind-ai-cyan.vercel.app/resumind-og-image.png?v=2" },
  ];
}

export default function Home() {
  const { auth, kv } = usePuterStore();
  const navigate = useNavigate();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loadingResumes, setLoadingResumes] = useState(false);

  useEffect(() => {
    if (!auth.isAuthenticated) navigate("/auth?next=/");
  }, [auth.isAuthenticated]);

  useEffect(() => {
    const loadResumes = async () => {
      setLoadingResumes(true);
      const resumes = (await kv.list("resume:*", true)) as KVItem[];

      const parsedResumes = resumes?.map(
        (resume) => JSON.parse(resume.value) as Resume,
      );

      console.log("Parsed Resumes", parsedResumes);
      setResumes(parsedResumes || []);
      setLoadingResumes(false);
    };
    loadResumes();
  }, []);
  return (
    <main className='bg-gradient relative min-h-screen overflow-x-hidden'>
      {/* Background Ambience */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-neon-purple/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-neon-blue/20 rounded-full blur-[120px] animate-pulse delay-1000" />
      </div>

      <Navbar />
      <section className="main-section">
        <div className="page-heading animate-fade-in">
          <h1 className="glow-text">Track your Applications <br /> & Resume Ratings</h1>
          {!loadingResumes && resumes.length === 0 ? (
            <h2 className="mt-4">No Resumes found. Upload yours to get AI Feedback</h2>
          ) : (
            <h2 className="mt-4">Review your submissions and check AI-powered feedback</h2>
          )}
        </div>
        {loadingResumes && (
          <div className="flex flex-col items-center justify-center p-20">
            <div className="w-20 h-20 border-4 border-neon-purple border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {!loadingResumes && resumes.length > 0 && (
          <div className="resumes-section animate-[fadeIn_0.5s_ease-out_0.2s_forwards] opacity-0">
            {resumes.map((resume) => (
              <ResumeCard key={resume.id} resume={resume} />
            ))}
          </div>
        )}

        {!loadingResumes && resumes.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-4 mt-10 animate-[fadeIn_0.5s_ease-out_0.3s_forwards] opacity-0">
            <Link
              to={"/upload"}
              className="primary-button w-fit text-xl font-semibold !px-12 !py-4 shadow-lg shadow-neon-blue/30"
            >
              Upload Resume
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}
