import { useBuilderStore } from "~/lib/builderStore";
import { Trash2, Plus, Sparkles, Loader2 } from "lucide-react";
import Combobox from "~/components/ui/Combobox";
import { universities } from "~/data/universities";
import { usePuterStore } from "~/lib/puter"; // Keep for other uses if any, but main logic moves
import { PROMPTS, useAIHelper } from "~/lib/aiHelper";
import { useState } from "react";
import { toast } from "sonner";

const EducationSection = () => {
    const { resume, addEducation, removeEducation, updateEducation } = useBuilderStore();
    const { education } = resume;
    const { generateContent } = useAIHelper();
    const [generatingId, setGeneratingId] = useState<string | null>(null);

    const handleGenerateDescription = async (id: string, school: string, degree: string) => {
        if (!school || !degree) {
            toast.error("Please enter a School and Degree first.");
            return;
        }

        setGeneratingId(id);
        const toastId = toast.loading("Generating description...");

        try {
            const prompt = `School: ${school}, Degree: ${degree}.`;
            const content = await generateContent(PROMPTS.EDUCATION_ACTIVITIES, prompt);

            if (content) {
                updateEducation(id, "description", content);
                toast.success("Description generated successfully!");
            } else {
                throw new Error("No content generated");
            }
        } catch (error) {
            console.error("AI Generation Failed in Component:", error);
            toast.error("Failed to generate description. Try again or fill manually.");
        } finally {
            setGeneratingId(null);
            toast.dismiss(toastId);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {education.map((edu, index) => (
                <div key={edu.id} className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl space-y-4 relative group hover:border-white/10 transition-all">
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                            onClick={() => {
                                removeEducation(edu.id);
                                toast.success("Education removed.");
                            }}
                            className="p-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>

                    <h3 className="text-lg font-semibold text-neon-purple">Education #{index + 1}</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label>School / University</label>
                            <Combobox
                                options={universities}
                                value={edu.school}
                                onChange={(val) => updateEducation(edu.id, "school", val)}
                                placeholder="Select or type University..."
                            />
                        </div>
                        <div className="space-y-2">
                            <label>Degree</label>
                            <input
                                type="text"
                                value={edu.degree}
                                onChange={(e) => updateEducation(edu.id, "degree", e.target.value)}
                                placeholder="Bachelor's in Computer Science"
                            />
                        </div>
                        <div className="space-y-2">
                            <label>Start Date</label>
                            <input
                                type="text"
                                value={edu.startDate}
                                onChange={(e) => updateEducation(edu.id, "startDate", e.target.value)}
                                placeholder="MM/YYYY"
                            />
                        </div>
                        <div className="space-y-2">
                            <label>End Date</label>
                            <input
                                type="text"
                                value={edu.endDate}
                                onChange={(e) => updateEducation(edu.id, "endDate", e.target.value)}
                                placeholder="MM/YYYY or Present"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between items-end">
                            <label className="text-sm font-medium text-gray-400">Activities / Societies</label>
                            <button
                                onClick={() => handleGenerateDescription(edu.id, edu.school, edu.degree)}
                                disabled={generatingId === edu.id}
                                className="flex items-center gap-1.5 text-xs font-semibold text-neon-purple hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {generatingId === edu.id ? (
                                    <Loader2 size={12} className="animate-spin" />
                                ) : (
                                    <Sparkles size={12} />
                                )}
                                <span>{generatingId === edu.id ? "Generating..." : "Auto-Generate"}</span>
                            </button>
                        </div>
                        <textarea
                            value={edu.description || ""}
                            onChange={(e) => updateEducation(edu.id, "description", e.target.value)}
                            placeholder="Activities, societies, and key achievements..."
                            rows={3}
                            className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-sm focus:border-neon-purple focus:ring-1 focus:ring-neon-purple outline-none resize-none"
                        />
                    </div>
                </div>
            ))}

            <button
                onClick={addEducation}
                className="w-full py-4 border-2 border-dashed border-white/20 rounded-xl text-gray-400 hover:border-neon-purple hover:text-neon-purple hover:bg-neon-purple/5 transition-all flex items-center justify-center gap-2 font-medium"
            >
                <Plus size={20} />
                Add Education
            </button>
        </div>
    );
};

export default EducationSection;
