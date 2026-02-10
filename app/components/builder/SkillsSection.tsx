import { useBuilderStore } from "~/lib/builderStore";
import { X, Plus, Sparkles, Loader2 } from "lucide-react";
import { useState } from "react";
import Combobox from "~/components/ui/Combobox";
import { commonSkills } from "~/data/skills";
import { usePuterStore } from "~/lib/puter"; // Keep for other uses if any
import { PROMPTS, useAIHelper } from "~/lib/aiHelper";
import { toast } from "sonner";

const SkillsSection = () => {
    const { resume, addSkill, removeSkill } = useBuilderStore();
    const { skills, experience } = resume;
    const [newSkill, setNewSkill] = useState("");
    const { generateContent } = useAIHelper();
    const [isGenerating, setIsGenerating] = useState(false);

    const handleAdd = (forceSkill?: string) => {
        const skillToAdd = forceSkill || newSkill;
        if (skillToAdd.trim()) {
            addSkill(skillToAdd.trim());
            if (!forceSkill) setNewSkill("");
            toast.success("Skill added!");
        }
    };

    const handleGenerateSkills = async () => {
        let role = "";
        if (experience.length > 0) {
            role = experience[0].role;
        }

        if (!role) {
            role = window.prompt("Enter your target job role for skill suggestions (e.g. Frontend Developer):") || "";
            if (!role) {
                toast.info("Role is required for suggestions.");
                return;
            }
        }

        setIsGenerating(true);
        const toastId = toast.loading("Analyzing role and suggesting skills...");

        try {
            const prompt = `Role: ${role}`;
            const content = await generateContent(PROMPTS.SKILLS_SUGGESTION, prompt);

            if (content) {
                const textContent = typeof content === 'string' ? content : String(content);
                const suggestedSkills = textContent.split(",").map((s: string) => s.trim());
                suggestedSkills.forEach((skill: string) => addSkill(skill));
                toast.success(`added ${suggestedSkills.length} suggested skills!`);
            } else {
                throw new Error("No content generated");
            }
        } catch (error) {
            console.error("AI Generation Error:", error);
            toast.error("Failed to generate skills. Please try again.");
        } finally {
            setIsGenerating(false);
            toast.dismiss(toastId);
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex gap-2 items-start flex-col md:flex-row">
                <div className="flex-1 w-full flex gap-2">
                    <div className="flex-1">
                        <Combobox
                            options={commonSkills}
                            value={newSkill}
                            onChange={setNewSkill}
                            placeholder="Add a skill (e.g. React, TypeScript)..."
                        />
                    </div>
                    <button
                        onClick={() => handleAdd()}
                        className="bg-neon-pink/10 hover:bg-neon-pink/20 text-neon-pink border border-neon-pink/50 rounded-lg px-6 py-3 font-medium transition-colors h-[48px] flex items-center justify-center"
                    >
                        <Plus size={20} />
                    </button>
                </div>
                <button
                    onClick={handleGenerateSkills}
                    disabled={isGenerating}
                    className="w-full md:w-auto bg-neon-purple/10 hover:bg-neon-purple/20 text-neon-purple border border-neon-purple/50 rounded-lg px-4 py-3 font-medium transition-colors h-[48px] flex items-center justify-center gap-2 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isGenerating ? (
                        <Loader2 size={18} className="animate-spin" />
                    ) : (
                        <Sparkles size={18} />
                    )}
                    <span>AI Suggest</span>
                </button>
            </div>

            <div className="flex flex-wrap gap-3">
                {skills.map((skill) => (
                    <div
                        key={skill.id}
                        className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full group hover:border-neon-pink/50 transition-colors"
                    >
                        <span className="text-gray-200">{skill.name}</span>
                        <button
                            onClick={() => removeSkill(skill.id)}
                            className="text-gray-500 hover:text-red-400 transition-colors"
                        >
                            <X size={14} />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SkillsSection;
