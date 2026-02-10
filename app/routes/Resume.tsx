import { Link, useNavigate, useParams } from "react-router";
import { usePuterStore } from "~/lib/puter";
import { useEffect, useState } from "react";
import Summary from "~/components/Summary";
import Details from "~/components/Details";
import ATS from "~/components/ATS";
import { generateATSReportPDF } from "~/lib/pdfGenerator";
import { Download, ChevronLeft } from "lucide-react";
import type { MetaArgs } from "react-router";

export function meta({ }: MetaArgs) {
  return [
    { title: "Resumind AI | REVIEW" },
    { name: "description", content: "Detailed Review of your Resume" },
  ];
}

const Resume = () => {
  const { id } = useParams();
  const { auth, isLoading, fs, kv } = usePuterStore();
  const [resumeUrl, setResumeUrl] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [fullData, setFullData] = useState<any>(null); // Store full data for PDF
  const [downloading, setDownloading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loadResume = async () => {
      const resume = await kv.get(`resume:${id}`);
      if (!resume) return;
      const data = JSON.parse(resume);
      setFullData(data); // Save for PDF

      const resumeBlob = await fs.read(data.resumePath);
      if (!resumeBlob) return;
      const pdfBlob = new Blob([resumeBlob], { type: "application/pdf" });
      const resumeUrl = URL.createObjectURL(pdfBlob);
      setResumeUrl(resumeUrl);

      const imageBlob = await fs.read(data.imagePath);
      if (!imageBlob) return;
      const imageUrl = URL.createObjectURL(imageBlob);
      setImageUrl(imageUrl);

      setFeedback(data.feedback);
    };

    loadResume();
  }, [id]);

  useEffect(() => {
    console.log("Resume.tsx: Auth check", { isLoading, isAuthenticated: auth.isAuthenticated });
    if (!isLoading && !auth.isAuthenticated) {
      console.log("Resume.tsx: Redirecting to auth");
      navigate(`/auth?next=/resume/${id}`);
    }
  }, [isLoading, auth.isAuthenticated, id]);

  const handleDownloadPDF = () => {
    if (!fullData) return;
    setDownloading(true);
    try {
      generateATSReportPDF(fullData);
    } catch (e) {
      console.error(e);
      alert("Failed to generate PDF");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <main className="!pt-0 bg-dark-bg min-h-screen">
      <nav className="resume-nav">
        <Link to="/" className="back-button group">
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-semibold">
            Back to Homepage
          </span>
        </Link>
        {feedback && (
          <button
            onClick={handleDownloadPDF}
            disabled={downloading}
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl px-4 py-2 text-sm font-semibold text-white transition-all hover:shadow-[0_0_15px_#a855f74d] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="w-4 h-4" />
            {downloading ? "Generating..." : "Download Report"}
          </button>
        )}
      </nav>
      <div className="flex flex-row w-full max-lg:flex-col-reverse">
        <section className="feedback-section bg-dark-bg/50 items-center justify-center sticky top-0 h-[calc(100vh-80px)] max-lg:h-auto max-lg:relative">
          {imageUrl && resumeUrl && (
            <div className="animate-in fade-in duration-1000 p-[1px] bg-gradient-to-br from-neon-blue via-neon-purple to-neon-pink rounded-2xl max-sm:m-0 h-[90%] max-w-xl:h-fit w-fit shadow-[0_0_50px_#3b82f633]">
              <div className="h-full w-full bg-dark-bg rounded-2xl overflow-hidden">
                <a href={resumeUrl} target="_blank" rel="noopener noreferrer">
                  <img
                    src={imageUrl}
                    className="h-full w-full object-contain hover:scale-105 transition-transform duration-500"
                    alt={"Resume Image"}
                    title={"Resume"}
                  />
                </a>
              </div>
            </div>
          )}
        </section>
        <section className="feedback-section overflow-y-auto">
          <h2 className="text-4xl !text-white font-bold glow-text">Resume Analysis</h2>
          {feedback ? (
            <div className="flex flex-col gap-8 animate-in fade-in duration-1000">
              <Summary feedback={feedback} />
              <ATS
                score={feedback.ATS.score || 0}
                suggestions={feedback.ATS.tips}
              />
              <Details feedback={feedback} />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-[50vh] gap-4">
              <div className="w-16 h-16 border-4 border-neon-purple border-t-transparent rounded-full animate-spin" />
              <p className="text-gray-400 animate-pulse">Analyzing your resume...</p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
};

export default Resume;
