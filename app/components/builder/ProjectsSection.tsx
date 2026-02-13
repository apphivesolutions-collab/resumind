import { useBuilderStore } from "~/lib/builderStore";
import { Plus, X, Sparkles, Loader2 } from "lucide-react";
import { useState } from "react";
import { useAIHelper } from "~/lib/aiHelper";
import { toast } from "sonner";

const ProjectsSection = () => {
    const { resume, addProject, updateProject, removeProject } = useBuilderStore();
    const { enhanceProjectDescription } = useAIHelper();
    const [enhancingId, setEnhancingId] = useState<string | null>(null);

    const handleAddProject = () => {
        addProject();
        toast.success("Project added");
    };

    const handleRemoveProject = (id: string) => {
        removeProject(id);
        toast.success("Project removed");
    };

    const handleEnhanceDescription = async (id: string) => {
        const project = resume.projects.find(p => p.id === id);
        if (!project) return;

        if (!project.title || !project.description) {
            toast.error("Please add a title and description first");
            return;
        }

        setEnhancingId(id);
        const toastId = toast.loading("Enhancing project description...");

        try {
            const enhanced = await enhanceProjectDescription(
                project.title,
                project.description,
                project.technologies
            );

            if (enhanced) {
                updateProject(id, 'description', enhanced);
                toast.success("Description enhanced!");
            } else {
                throw new Error("No enhancement generated");
            }
        } catch (error) {
            console.error("Enhancement error:", error);
            toast.error("Failed to enhance description");
        } finally {
            setEnhancingId(null);
            toast.dismiss(toastId);
        }
    };

    const handleTechnologiesChange = (id: string, value: string) => {
        // Convert comma-separated string to array
        const techArray = value.split(',').map(t => t.trim()).filter(t => t);
        updateProject(id, 'technologies', techArray);
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {resume.projects.map((project) => (
                <div
                    key={project.id}
                    className="p-6 bg-white/[0.03] border border-white/10 rounded-xl space-y-4 hover:bg-white/[0.05] transition-all"
                >
                    <div className="flex justify-between items-start gap-4">
                        <h3 className="text-white font-semibold">Project Details</h3>
                        <button
                            onClick={() => handleRemoveProject(project.id)}
                            className="text-red-400 hover:text-red-300 transition-colors"
                        >
                            <X size={18} />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label>Project Title</label>
                            <input
                                type="text"
                                value={project.title}
                                onChange={(e) => updateProject(project.id, 'title', e.target.value)}
                                placeholder="E-Commerce Platform"
                            />
                        </div>

                        <div className="space-y-2">
                            <label>Project Link (Optional)</label>
                            <input
                                type="text"
                                value={project.link || ''}
                                onChange={(e) => updateProject(project.id, 'link', e.target.value)}
                                placeholder="https://github.com/username/project"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label>Technologies Used</label>
                        <input
                            type="text"
                            value={project.technologies.join(', ')}
                            onChange={(e) => handleTechnologiesChange(project.id, e.target.value)}
                            placeholder="React, TypeScript, Node.js, PostgreSQL"
                        />
                        <p className="text-xs text-gray-400">Separate with commas</p>
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <label>Description</label>
                            <button
                                onClick={() => handleEnhanceDescription(project.id)}
                                disabled={enhancingId === project.id}
                                className="flex items-center gap-2 text-xs bg-neon-purple/20 text-neon-purple hover:bg-neon-purple/30 px-3 py-1.5 rounded-lg transition-all disabled:opacity-50"
                            >
                                {enhancingId === project.id ? (
                                    <>
                                        <Loader2 size={12} className="animate-spin" />
                                        <span>Enhancing...</span>
                                    </>
                                ) : (
                                    <>
                                        <Sparkles size={12} />
                                        <span>AI Enhance</span>
                                    </>
                                )}
                            </button>
                        </div>
                        <textarea
                            value={project.description}
                            onChange={(e) => updateProject(project.id, 'description', e.target.value)}
                            placeholder="Built a full-stack e-commerce platform with real-time inventory management..."
                            rows={4}
                        />
                        <p className="text-xs text-gray-400">
                            Describe what you built, the tech stack, and the impact
                        </p>
                    </div>
                </div>
            ))}

            <button
                onClick={handleAddProject}
                className="w-full flex items-center justify-center gap-2 py-4 border-2 border-dashed border-white/20 rounded-xl text-gray-400 hover:border-neon-purple hover:text-neon-purple transition-all"
            >
                <Plus size={18} />
                <span>Add Project</span>
            </button>
        </div>
    );
};

export default ProjectsSection;
