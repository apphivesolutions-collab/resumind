import { useBuilderStore } from "~/lib/builderStore";
import { Sparkles, Loader2, CheckCircle2, RefreshCw } from "lucide-react";
import { useAIHelper } from "~/lib/aiHelper";
import { useState } from "react";
import { toast } from "sonner";

const SummarySection = () => {
    const {
        resume,
        updateSummary,
        jobContext,
        updateJobContext,
        summaryOptions,
        setSummaryOptions,
        selectedSummaryIndex,
        selectSummary
    } = useBuilderStore();

    const { generateSummaryOptions } = useAIHelper();
    const [isGenerating, setIsGenerating] = useState(false);

    const handleGenerateSummaries = async () => {
        // Validation
        if (!jobContext.jobTitle.trim()) {
            toast.error("Please enter your job title first");
            return;
        }

        if (!jobContext.experienceLevel) {
            toast.error("Please select your experience level");
            return;
        }

        // Check if we have some baseline data
        const hasData = resume.experience.length > 0 || resume.education.length > 0 || resume.skills.length > 0;

        if (!hasData) {
            toast.error("Please add some experience, education, or skills first");
            return;
        }

        setIsGenerating(true);
        const toastId = toast.loading("Generating professional summary options...");

        try {
            const skills = resume.skills.map((s) => s.name);
            const options = await generateSummaryOptions(
                jobContext.jobTitle,
                jobContext.experienceLevel,
                skills,
                jobContext.jobDescription || undefined
            );

            if (options && options.length > 0) {
                setSummaryOptions(options);
                toast.success(`Generated ${options.length} summary options!`);
            } else {
                throw new Error("No summaries generated");
            }
        } catch (error) {
            console.error("Summary generation error:", error);
            toast.error("Failed to generate summaries. Please try again.");
        } finally {
            setIsGenerating(false);
            toast.dismiss(toastId);
        }
    };

    const handleSelectSummary = (index: number) => {
        selectSummary(index);
        toast.success("Summary selected!");
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Job Context Section */}
            <div className="space-y-4 bg-gradient-to-r from-neon-blue/10 to-neon-purple/10 p-5 rounded-xl border border-white/5">
                <div>
                    <h3 className="font-semibold text-white mb-1">Career Context</h3>
                    <p className="text-xs text-gray-400">Help AI understand your career to generate tailored summaries</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-medium text-gray-300 mb-2">
                            Job Title / Target Role <span className="text-red-400">*</span>
                        </label>
                        <input
                            type="text"
                            value={jobContext.jobTitle}
                            onChange={(e) => updateJobContext('jobTitle', e.target.value)}
                            placeholder="e.g., Senior Frontend Developer"
                            className="w-full"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-gray-300 mb-2">
                            Experience Level <span className="text-red-400">*</span>
                        </label>
                        <select
                            value={jobContext.experienceLevel}
                            onChange={(e) => updateJobContext('experienceLevel', e.target.value)}
                            className="w-full px-5 py-3.5 bg-white/[0.08] border border-white/20 rounded-xl text-sm font-medium text-text-primary focus:outline-none focus:border-neon-purple/70 focus:bg-white/[0.10] transition-all duration-300"
                        >
                            <option value="">Select Level</option>
                            <option value="internship">Internship</option>
                            <option value="entry">Entry-Level (0-2 years)</option>
                            <option value="mid">Mid-Level (2-5 years)</option>
                            <option value="senior">Senior (5-10 years)</option>
                            <option value="executive">Executive (10+ years)</option>
                            <option value="freelance">Freelance / Contractor</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-medium text-gray-300 mb-2">
                        Target Job Description (Optional)
                    </label>
                    <p className="text-xs text-gray-400 mb-2">Paste a job description to tailor your summary with relevant keywords</p>
                    <textarea
                        value={jobContext.jobDescription}
                        onChange={(e) => updateJobContext('jobDescription', e.target.value)}
                        placeholder="Paste the job description you're targeting..."
                        rows={4}
                        className="text-xs"
                    />
                </div>

                <button
                    onClick={handleGenerateSummaries}
                    disabled={isGenerating}
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-neon-purple to-neon-blue text-white px-6 py-3 rounded-xl font-bold hover:shadow-[0_0_25px_rgba(147,51,234,0.5)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isGenerating ? (
                        <>
                            <Loader2 size={18} className="animate-spin" />
                            <span>Generating Summaries...</span>
                        </>
                    ) : (
                        <>
                            <Sparkles size={18} />
                            <span>Generate Professional Summaries</span>
                        </>
                    )}
                </button>
            </div>

            {/* Summary Options Display */}
            {summaryOptions.length > 0 && (
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-white">Choose Your Summary</h3>
                        <button
                            onClick={handleGenerateSummaries}
                            disabled={isGenerating}
                            className="flex items-center gap-2 text-xs text-neon-purple hover:text-neon-blue transition-colors"
                        >
                            <RefreshCw size={14} />
                            <span>Regenerate</span>
                        </button>
                    </div>
                    <p className="text-xs text-gray-400">Select the summary that best represents you (you can edit it after selecting)</p>

                    <div className="grid gap-4">
                        {summaryOptions.map((option, index) => (
                            <div
                                key={index}
                                onClick={() => handleSelectSummary(index)}
                                className={`
                                    relative p-4 rounded-xl border cursor-pointer transition-all duration-300
                                    ${selectedSummaryIndex === index
                                        ? 'bg-neon-purple/10 border-neon-purple shadow-[0_0_20px_rgba(147,51,234,0.3)]'
                                        : 'bg-white/[0.03] border-white/10 hover:border-white/20 hover:bg-white/[0.05]'
                                    }
                                `}
                            >
                                <div className="flex items-start gap-3">
                                    <div className={`
                                        flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold
                                        ${selectedSummaryIndex === index
                                            ? 'bg-neon-purple text-white'
                                            : 'bg-white/10 text-gray-400'
                                        }
                                    `}>
                                        {selectedSummaryIndex === index ? <CheckCircle2 size={16} /> : index + 1}
                                    </div>
                                    <p className="flex-1 text-sm text-gray-200 leading-relaxed whitespace-pre-wrap">
                                        {option}
                                    </p>
                                </div>
                                {selectedSummaryIndex === index && (
                                    <div className="mt-2 text-xs text-neon-purple font-semibold">
                                        ✓ Selected (now editable below)
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Editable Summary */}
            <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                    {summaryOptions.length > 0 ? 'Your Summary (Edit as needed)' : 'Professional Summary'}
                </label>
                <textarea
                    value={resume.summary}
                    onChange={(e) => updateSummary(e.target.value)}
                    placeholder="Professional summary highlighting your years of experience, key achievements, and expertise..."
                    rows={8}
                />
                {resume.summary && (
                    <p className="mt-2 text-xs text-gray-400">
                        {resume.summary.length} characters
                    </p>
                )}
            </div>
        </div>
    );
};

export default SummarySection;
