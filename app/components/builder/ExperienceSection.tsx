import { useBuilderStore } from "~/lib/builderStore";
import { Trash2, Plus, Sparkles, Loader2 } from "lucide-react";
import { usePuterStore } from "~/lib/puter"; // Keep for other uses if any
import { PROMPTS, useAIHelper } from "~/lib/aiHelper";
import { useState } from "react";
import { toast } from "sonner";

const ExperienceSection = () => {
    const { resume, addExperience, removeExperience, updateExperience } = useBuilderStore();
    const { experience } = resume;
    const { generateContent } = useAIHelper();
    const [generatingId, setGeneratingId] = useState<string | null>(null);

    const handleGenerateDescription = async (id: string, role: string, company: string) => {
        if (!role || !company) {
            toast.error("Please enter a Role and Company first.");
            return;
        }

        setGeneratingId(id);
        const toastId = toast.loading("Generating description...");

        try {
            const prompt = `Role: ${role}, Company: ${company}.`;
            const content = await generateContent(PROMPTS.EXPERIENCE_DESCRIPTION, prompt);

            if (content) {
                updateExperience(id, "description", content);
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
            {experience.map((exp, index) => (
                <div key={exp.id} className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl space-y-4 relative group hover:border-white/10 transition-all">
                    <div className="absolute top-4 right-4 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                        <button
                            onClick={() => {
                                removeExperience(exp.id);
                                toast.success("Experience removed.");
                            }}
                            className="p-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>

                    <h3 className="text-lg font-semibold text-neon-blue">Experience #{index + 1}</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label>Company</label>
                            <input
                                type="text"
                                value={exp.company}
                                onChange={(e) => updateExperience(exp.id, "company", e.target.value)}
                                placeholder="Company Name"
                            />
                        </div>
                        <div className="space-y-2">
                            <label>Role</label>
                            <input
                                type="text"
                                value={exp.role}
                                onChange={(e) => updateExperience(exp.id, "role", e.target.value)}
                                placeholder="Job Title"
                            />
                        </div>
                        <div className="space-y-2">
                            <label>Start Date</label>
                            <input
                                type="text"
                                value={exp.startDate}
                                onChange={(e) => updateExperience(exp.id, "startDate", e.target.value)}
                                placeholder="MM/YYYY"
                            />
                        </div>
                        <div className="space-y-2">
                            <label>End Date</label>
                            <input
                                type="text"
                                value={exp.endDate}
                                onChange={(e) => updateExperience(exp.id, "endDate", e.target.value)}
                                placeholder="MM/YYYY or Present"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between items-end">
                            <label className="text-sm font-medium text-gray-400">Description</label>
                            <button
                                onClick={() => handleGenerateDescription(exp.id, exp.role, exp.company)}
                                disabled={generatingId === exp.id}
                                className="flex items-center gap-1.5 text-xs font-semibold text-neon-purple hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {generatingId === exp.id ? (
                                    <Loader2 size={12} className="animate-spin" />
                                ) : (
                                    <Sparkles size={12} />
                                )}
                                <span>{generatingId === exp.id ? "Generating..." : "Auto-Generate"}</span>
                            </button>
                        </div>
                        <textarea
                            value={exp.description}
                            onChange={(e) => updateExperience(exp.id, "description", e.target.value)}
                            placeholder="Describe your responsibilities and achievements..."
                            rows={4}
                            className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-sm focus:border-neon-blue focus:ring-1 focus:ring-neon-blue outline-none resize-none"
                        />
                    </div>
                </div>
            ))}

            <button
                onClick={addExperience}
                className="w-full py-4 border-2 border-dashed border-white/20 rounded-xl text-gray-400 hover:border-neon-blue hover:text-neon-blue hover:bg-neon-blue/5 transition-all flex items-center justify-center gap-2 font-medium"
            >
                <Plus size={20} />
                Add Experience
            </button>
        </div>
    );
};

export default ExperienceSection;
