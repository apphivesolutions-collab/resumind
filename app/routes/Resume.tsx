import { Link, useNavigate, useParams } from "react-router";
import { usePuterStore } from "~/lib/puter";
import { useEffect, useState } from "react";
import Summary from "~/components/Summary";
import Details from "~/components/Details";
import ATS from "~/components/ATS";

export function meta({}: Route.MetaArgs) {
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
  const navigate = useNavigate();
  useEffect(() => {
    const loadResume = async () => {
      const resume = await kv.get(`resume:${id}`);
      if (!resume) return;
      const data = JSON.parse(resume);

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
    if (!isLoading && !auth.isAuthenticated)
      navigate(`/auth?next=/resume/${id}`);
  }, [isLoading]);

  return (
    <main className="!pt-0">
      <nav className="resume-nav">
        <Link to="/" className="back-button">
          <img src="/icons/back.svg" alt="back" className="w-2.5 h-2.5" />
          <span className="text-sm text-gray-800 font-semibold">
            Go back to Homepage
          </span>
        </Link>
      </nav>
      <div className="flex flex-row w-full max-lg:flex-col-reverse">
        <section className="feedback-section bg-[url('/images/bg-small.svg')] bg-cover items-center justify-center sticky top-0 h-[100vh] ">
          {imageUrl && resumeUrl && (
            <div className="animate-in fade-in duration-1000 gradient-border max-sm:m-0 h-[90%] max-w-xl:h-fit w-fit">
              <a href={resumeUrl} target="_blank" rel="noopener noreferrer">
                <img
                  src={imageUrl}
                  className="h-full w-full object-contain rounded-2xl"
                  alt={"Resume Image"}
                  title={"Resume"}
                />
              </a>
            </div>
          )}
        </section>
        <section className="feedback-section">
          <h2 className="text-4xl !text-black font-bold">Resume Review</h2>
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
            <img
              src="/images/resume-scan-2.gif"
              alt={"Resume Scan"}
              className="w-full"
            />
          )}
        </section>
      </div>
    </main>
  );
};

export default Resume;
