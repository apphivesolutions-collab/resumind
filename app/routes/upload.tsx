import Navbar from "~/components/Navbar";
import React, { useEffect, useMemo, useState } from "react";
import FileUploader from "~/components/FileUploader";
import { usePuterStore } from "~/lib/puter";
import { useNavigate } from "react-router";
import { convertPdfToImage } from "~/lib/pdf2Img";
import { generateUUID } from "~/lib/utils";
import { prepareInstructions } from "../../constants";
import type { MetaArgs } from "react-router";

export function meta({ }: MetaArgs) {
  return [
    { title: "Resumind AI | UPLOAD" },
    { name: "description", content: "Upload your Resume to get AI Feedback" },
  ];
}

const Upload = () => {
  const [processing, setProcessing] = useState<boolean>(false);
  const [statusText, setStatusText] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);

  const [companyName, setCompanyName] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");

  const [showRules, setShowRules] = useState(false);

  const { auth, isLoading, fs, ai, kv } = usePuterStore();
  const navigate = useNavigate();

  useEffect(() => {
    // Show rules modal on visiting /upload
    setShowRules(true);
  }, []);

  const canAnalyze = useMemo(() => {
    return (
      !processing &&
      companyName.trim().length > 0 &&
      jobTitle.trim().length > 0 &&
      jobDescription.trim().length > 0 &&
      !!file
    );
  }, [processing, companyName, jobTitle, jobDescription, file]);

  const handleFileSelect = (file: File | null) => {
    setFile(file);
  };

  const handleAnalyze = async ({
    companyName,
    jobTitle,
    jobDescription,
    file,
  }: {
    companyName: string;
    jobTitle: string;
    jobDescription: string;
    file: File;
  }) => {
    // Guard: ensure all inputs are provided
    if (!companyName || !jobTitle || !jobDescription || !file) {
      setStatusText("Please complete all fields and upload your resume.");
      return;
    }
    setProcessing(true);
    setStatusText("Uploading the File...");
    const uploadedFile = await fs.upload([file]);
    if (!uploadedFile) {
      setProcessing(false);
      return setStatusText("Error: Failed to upload Files ");
    }

    setStatusText("Converting Pdf to Image...");
    const image = await convertPdfToImage(file);
    if (!image.file) {
      setProcessing(false);
      return setStatusText("Error: Failed to convert PDF to Image");
    }

    setStatusText("Uploading Image...");
    const uploadedImage = await fs.upload([image.file]);
    if (!uploadedImage) {
      setProcessing(false);
      return setStatusText("Error: Failed to upload Image");
    }

    setStatusText("Preparing ATS Analysis...");

    const uuid = generateUUID();

    const data = {
      id: uuid,
      resumePath: uploadedFile.path,
      imagePath: uploadedImage.path,
      companyName,
      jobTitle,
      jobDescription,
      feedback: "",
    } as const;
    await kv.set(`resume:${uuid}`, JSON.stringify(data));
    setStatusText("Analyzing...");

    const feedback = await ai.feedback(
      uploadedFile.path,
      prepareInstructions({ jobDescription, jobTitle }),
    );

    if (!feedback) {
      setProcessing(false);
      return setStatusText("Error: AI failed to Analyze Resume");
    }
    const feedbackText =
      typeof feedback.message.content === "string"
        ? feedback.message.content
        : feedback.message.content[0].text;

    const parsed = JSON.parse(feedbackText);
    const finalData = { ...data, feedback: parsed };
    await kv.set(`resume:${uuid}`, JSON.stringify(finalData));
    setStatusText("Analyzing Complete, Redirecting...");
    console.log("Navigating to:", `/resume/${uuid}`);
    navigate(`/resume/${uuid}`);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!canAnalyze || !file) return;
    handleAnalyze({ companyName, jobTitle, jobDescription, file });
  };

  return (
    <main className='bg-gradient relative min-h-screen overflow-x-hidden pb-20'>
      {/* Background Ambience */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[20%] right-[-10%] w-[50%] h-[50%] bg-neon-purple/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-neon-blue/10 rounded-full blur-[120px] animate-pulse delay-1000" />
      </div>

      <Navbar />

      {/* Rules Modal */}
      {showRules && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity duration-300"
            onClick={() => setShowRules(false)}
          />
          <div className="relative w-full max-w-xl animate-[fadeIn_0.3s_ease-out] p-[1px] bg-gradient-to-br from-neon-blue via-neon-purple to-neon-pink rounded-2xl shadow-[0_0_50px_rgba(168,85,247,0.4)]">
            <div className="bg-dark-bg rounded-2xl p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4">
                <button
                  aria-label="Close"
                  className="rounded-full p-2 text-gray-400 hover:bg-white/10 hover:text-white transition-colors"
                  onClick={() => setShowRules(false)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="h-6 w-6"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-neon-blue to-neon-purple mb-4">
                Before you upload
              </h3>

              <p className="text-gray-300 mb-6 leading-relaxed">
                To generate accurate, role-specific feedback, please provide
                authentic details:
              </p>

              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-neon-blue/20 text-neon-blue flex items-center justify-center text-sm font-bold">1</span>
                  <span className="text-gray-300">Enter the real company name you’re applying to.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-neon-purple/20 text-neon-purple flex items-center justify-center text-sm font-bold">2</span>
                  <span className="text-gray-300">Use the exact job title from the posting.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-neon-pink/20 text-neon-pink flex items-center justify-center text-sm font-bold">3</span>
                  <span className="text-gray-300">Paste a clear, complete job description.</span>
                </li>
              </ul>

              <div className="flex justify-end">
                <button
                  className="primary-button w-auto px-8"
                  onClick={() => setShowRules(false)}
                >
                  I Understand
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <section className="main-section max-w-4xl mx-auto px-6">
        <div className="page-heading w-full">
          <h1 className="glow-text mb-2">Smart feedback for your Dream Job!</h1>

          {processing ? (
            <div className="flex flex-col items-center gap-6 py-10 w-full bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 animate-pulse">
              <h2 className="text-neon-blue font-bold tracking-wider animate-pulse">{statusText}</h2>
              <div className="relative w-24 h-24">
                <div className="absolute inset-0 rounded-full border-4 border-neon-purple/30"></div>
                <div className="absolute inset-0 rounded-full border-4 border-t-neon-purple animate-spin"></div>
              </div>
            </div>
          ) : (
            <h2 className="text-gray-400 font-light">Submit your Resume for an ATS Score and Improvement Tips</h2>
          )}

          {!processing && (
            <form className="flex flex-col gap-6 mt-12 w-full p-8 bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl shadow-2xl" onSubmit={handleSubmit}>
              <div className="form-div">
                <label htmlFor="company-name" className="text-neon-blue">Company Name</label>
                <input
                  type="text"
                  name="company-name"
                  id="company-name"
                  placeholder="e.g. Google, Microsoft, Startup Inc."
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="focus:shadow-[0_0_15px_#3b82f680]"
                  required
                />
              </div>
              <div className="form-div">
                <label htmlFor="job-title" className="text-neon-purple">Job Title</label>
                <input
                  type="text"
                  name="job-title"
                  id="job-title"
                  placeholder="e.g. Senior Frontend Engineer"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  className="focus:shadow-[0_0_15px_#a855f780]"
                  required
                />
              </div>
              <div className="form-div">
                <label htmlFor="job-description" className="text-neon-pink">Job Description</label>
                <textarea
                  rows={8}
                  name="job-description"
                  id="job-description"
                  placeholder="Paste the full job description here..."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  className="focus:shadow-[0_0_15px_#ec489980]"
                  required
                />
              </div>
              <div className="form-div w-full">
                <label htmlFor="uploader" className="text-white mb-4">Upload Resume (PDF)</label>
                <FileUploader onFileSelect={handleFileSelect} />
              </div>

              <button
                className={`primary-button mt-4 text-lg py-4 ${!canAnalyze ? "opacity-50 cursor-not-allowed grayscale" : "shadow-[0_0_30px_rgba(168,85,247,0.4)]"}`}
                type="submit"
                disabled={!canAnalyze}
                aria-disabled={!canAnalyze}
              >
                Analyze Resume
              </button>
            </form>
          )}
        </div>
      </section>
    </main>
  );
};
export default Upload;
