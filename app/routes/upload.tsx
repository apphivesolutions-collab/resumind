import Navbar from "~/components/Navbar";
import React, { useState } from "react";
import FileUploader from "~/components/FileUploader";
import { usePuterStore } from "~/lib/puter";
import { useNavigate } from "react-router";
import { convertPdfToImage } from "~/lib/pdf2Img";
import { genrateUUID } from "~/lib/utils";
import { prepareInstructions } from "../../constants";

const Upload = () => {
  const [processing, setProcessing] = useState<boolean>(false);
  const [statusText, setStatusText] = useState<string>("");
  const [file, setFile] = useState<File | null>();

  const { auth, isLoading, fs, ai, kv } = usePuterStore();
  const navigate = useNavigate();

  const temp = genrateUUID();
  console.log(temp);

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
    if (companyName && jobTitle && jobDescription === null) return;
    setProcessing(true);
    setStatusText("Uploading the File...");
    const uploadedFile = await fs.upload([file]);
    if (!uploadedFile) return setStatusText("Error: Failed to upload Files ");

    setStatusText("Converting Pdf to Image...");
    const image = await convertPdfToImage(file);
    if (!image.file)
      return setStatusText("Error: Failed to convert PDF to Image");

    setStatusText("Uploading Image...");
    const uploadedImage = await fs.upload([image.file]);
    if (!uploadedImage) return setStatusText("Error: Failed to upload Image");

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
    };
    await kv.set(`resume:${uuid}`, JSON.stringify(data));
    setStatusText("Analyzing...");

    const feedback = await ai.feedback(
      uploadedFile.path,
      prepareInstructions({ jobDescription, jobTitle }),
    );

    if (!feedback) return setStatusText("Error: AI failed to Analyze Resume");
    const feedbackText =
      typeof feedback.message.content === "string"
        ? feedback.message.content
        : feedback.message.content[0].text;

    data.feedback = JSON.parse(feedbackText);
    await kv.set(`resume:${uuid}`, JSON.stringify(data));
    setStatusText("Analyzing Complete, Redirecting...");
    console.log(data);
    navigate(`/resume/${uuid}`);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget.closest("form");
    if (!form) return;
    const formData = new FormData(form);
    const companyName = formData.get("company-name") as string;
    const jobTitle = formData.get("job-title") as string;
    const jobDescription = formData.get("job-description") as string;

    if (!file) return;
    handleAnalyze({ companyName, jobTitle, jobDescription, file });
  };

  return (
    <main className='bg-[url("/images/bg-main.svg")] bg-cover'>
      <Navbar />
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
            <form className="flex flex-col gap 4 mt-8" onClick={handleSubmit}>
              <div className="form-div">
                <label htmlFor="company-name">Company Name</label>
                <input
                  type="text"
                  name="company-name"
                  id="company-name"
                  placeholder="Company Name"
                />
              </div>
              <div className="form-div">
                <label htmlFor="job-title">Job Title</label>
                <input
                  type="text"
                  name="job-title"
                  id="job-title"
                  placeholder="Job Title"
                />
              </div>
              <div className="form-div">
                <label htmlFor="job-description">Job Description</label>
                <textarea
                  rows={5}
                  name="job-description"
                  id="job-description"
                  placeholder="Job Description"
                />
              </div>
              <div className="form-div">
                <label htmlFor="uploader">Uploader</label>
                <FileUploader onFileSelect={handleFileSelect} />
              </div>

              <button className="primary-button" type="submit">
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
