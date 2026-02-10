import { useBuilderStore } from "~/lib/builderStore";
import { Sparkles, Loader2 } from "lucide-react";
import { usePuterStore } from "~/lib/puter"; // Keep for other uses if any
import { PROMPTS, useAIHelper } from "~/lib/aiHelper";
import { useState } from "react";
import { toast } from "sonner";

const SummarySection = () => {
    const { resume, updateSummary } = useBuilderStore();
    const { generateContent } = useAIHelper();
    const [isGenerating, setIsGenerating] = useState(false);

    const handleGenerateSummary = async () => {
        // Basic validation to ensure there is some data to work with
        if (resume.experience.length === 0 && resume.education.length === 0 && resume.skills.length === 0) {
            toast.error("Please add some experience, education, or skills first so the AI can write a summary for you.");
            return;
        }

        setIsGenerating(true);
        const toastId = toast.loading("Writing your professional summary...");

        try {
            // Construct a rich context from the existing resume data
            const contextData = {
                personalInfo: resume.personalInfo,
                experience: resume.experience.map(e => ({ role: e.role, company: e.company, description: e.description })),
                education: resume.education.map(e => ({ degree: e.degree, school: e.school })),
                skills: resume.skills.map(s => s.name)
            };

            const prompt = `Based on the following resume details, write a professional summary:\n${JSON.stringify(contextData, null, 2)}`;
            const content = await generateContent(PROMPTS.SUMMARY_GENERATION, prompt);

            if (content) {
                const textContent = typeof content === 'string' ? content : String(content);
                updateSummary(textContent);
                toast.success("Summary generated successfully!");
            } else {
                throw new Error("No content generated");
            }
        } catch (error) {
            console.error("AI Generation Error:", error);
            toast.error("Failed to generate summary. Please try again.");
        } finally {
            setIsGenerating(false);
            toast.dismiss(toastId);
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-center gap-4 bg-gradient-to-r from-neon-blue/10 to-neon-purple/10 p-4 rounded-xl border border-white/5">
                <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-white">AI Assistant</h3>
                    <p className="text-xs text-gray-400">Generate a professional summary based on your details.</p>
                </div>
                <button
                    onClick={handleGenerateSummary}
                    disabled={isGenerating}
                    className="flex shrink-0 min-w-fit items-center gap-2 bg-white text-black px-4 py-2 rounded-lg font-bold hover:shadow-[0_0_15px_rgba(255,255,255,0.3)] transition-all disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                >
                    {isGenerating ? (
                        <Loader2 size={16} className="animate-spin text-neon-purple" />
                    ) : (
                        <Sparkles size={16} className="text-neon-purple" />
                    )}
                    <span>{isGenerating ? "Writing..." : "Auto-Write"}</span>
                </button>
            </div>

            <textarea
                value={resume.summary}
                onChange={(e) => updateSummary(e.target.value)}
                placeholder="Professional summary going over your years of experience, key achievements, and skills..."
                rows={8}
            />
        </div>
    );
};

export default SummarySection;
