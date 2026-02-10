import { Link } from "react-router";
import ScoreCircle from "~/components/ScoreCircle";
import { useEffect, useState } from "react";
import { usePuterStore } from "~/lib/puter";

const ResumeCard = ({
  resume: { id, companyName, jobTitle, feedback, imagePath },
}: {
  resume: Resume;
}) => {
  const { fs } = usePuterStore();
  const [resumeUrl, setResumeUrl] = useState("");

  useEffect(() => {
    const loadResume = async () => {
      const blob = await fs.read(imagePath);
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      setResumeUrl(url);
    };
    loadResume();
  }, [imagePath]);
  return (
    <Link
      to={`/resume/${id}`}
      className="resume-card animate-in fade-in duration-1000 group"
    >
      <div className="flex items-center justify-between w-full">
        <div className="flex flex-col gap-1 w-full overflow-hidden">
          {companyName && (
            <h2 className="!text-white font-bold text-xl truncate group-hover:text-neon-blue transition-colors duration-300">{companyName}</h2>
          )}
          {jobTitle && (
            <h3 className="text-sm font-medium text-gray-400 truncate">{jobTitle}</h3>
          )}
          {!companyName && !jobTitle && (
            <h2 className="!text-white font-bold">Resume</h2>
          )}
        </div>
        <div className="flex-shrink-0 ml-4 scale-90">
          <ScoreCircle score={feedback.overallScore} />
        </div>
      </div>
      {resumeUrl && (
        <div className="relative rounded-2xl overflow-hidden border border-white/5 animate-in fade-in duration-1000 h-[350px]">
          <div className="absolute inset-0 bg-gradient-to-t from-dark-bg via-transparent to-transparent opacity-50 z-10" />
          <img
            src={resumeUrl}
            alt="resume"
            className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-700"
          />
        </div>
      )}
    </Link>
  );
};
export default ResumeCard;
