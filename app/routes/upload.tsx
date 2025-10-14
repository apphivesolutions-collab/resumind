import Navbar from "~/components/Navbar";
import React, { useEffect, useMemo, useState } from "react";
import FileUploader from "~/components/FileUploader";
import { usePuterStore } from "~/lib/puter";
import { useNavigate } from "react-router";
import { convertPdfToImage } from "~/lib/pdf2Img";
import { genrateUUID } from "~/lib/utils";
import { prepareInstructions } from "../../constants";

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

    const uuid = genrateUUID();

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
    navigate(`/resume/${uuid}`);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!canAnalyze || !file) return;
    handleAnalyze({ companyName, jobTitle, jobDescription, file });
  };

  return (
    <main className='bg-[url("/images/bg-main.svg")] bg-cover'>
      <Navbar />

      {/* Rules Modal */}
      {showRules && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-200"
            onClick={() => setShowRules(false)}
          />
          <div className="relative mx-4 w-full max-w-xl scale-95 animate-[fadeIn_200ms_ease-out] rounded-2xl bg-white p-6 shadow-xl ring-1 ring-black/5">
            <div className="flex items-start justify-between gap-4">
              <h3 className="text-lg font-semibold text-gray-900">Before you upload</h3>
              <button
                aria-label="Close"
                className="rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                onClick={() => setShowRules(false)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5"><path fillRule="evenodd" d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z" clipRule="evenodd"/></svg>
              </button>
            </div>
            <p className="mt-2 text-sm text-gray-600">
              To generate accurate, role-specific feedback, please provide authentic details:
            </p>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-gray-700">
              <li>Enter the real company name you’re applying to.</li>
              <li>Use the exact job title from the posting.</li>
              <li>Paste a clear, complete job description.</li>
            </ul>
            <div className="mt-4 flex justify-end">
              <button className="primary-button" onClick={() => setShowRules(false)}>
                I Understand
              </button>
            </div>
          </div>
        </div>
      )}

      <section className="main-section">
        <div className="page-heading">
          <h1>Smart feedback for your Dream Job!</h1>
          {processing ? (
            <>
              <h2>{statusText}</h2>
              <img
                className="w-full pt-0"
                src="/images/resume-scan.gif"
                alt={"Resume Scan"}
              />
            </>
          ) : (
            <h2>Submit your Resume for an ATS Score and Improvement Tips</h2>
          )}
          {!processing && (
            <form className="flex flex-col gap-4 mt-8" onSubmit={handleSubmit}>
              <div className="form-div">
                <label htmlFor="company-name">Company Name</label>
                <input
                  type="text"
                  name="company-name"
                  id="company-name"
                  placeholder="Company Name"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  required
                />
              </div>
              <div className="form-div">
                <label htmlFor="job-title">Job Title</label>
                <input
                  type="text"
                  name="job-title"
                  id="job-title"
                  placeholder="Job Title"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  required
                />
              </div>
              <div className="form-div">
                <label htmlFor="job-description">Job Description</label>
                <textarea
                  rows={5}
                  name="job-description"
                  id="job-description"
                  placeholder="Job Description"
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  required
                />
              </div>
              <div className="form-div">
                <label htmlFor="uploader">Uploader</label>
                <FileUploader onFileSelect={handleFileSelect} />
              </div>

              <button
                className={`primary-button ${!canAnalyze ? "opacity-50 cursor-not-allowed" : ""}`}
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
