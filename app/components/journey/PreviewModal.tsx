import { X, Eye, Palette } from 'lucide-react';
import { useBuilderStore } from '~/lib/builderStore';
import ResumePreview from '../builder/ResumePreview';
import templates, { getTemplateById } from '~/lib/templates/templateDefinitions';

interface PreviewModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const PreviewModal = ({ isOpen, onClose }: PreviewModalProps) => {
    const { selectedTemplate, setTemplate } = useBuilderStore();
    const currentTemplate = getTemplateById(selectedTemplate);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md animate-in fade-in duration-300">
            <div className="w-full h-full flex flex-col bg-[#0a0a0f]">
                {/* Header */}
                <div className="border-b border-white/10 bg-gradient-to-r from-[#0e0e14] to-[#111118] px-6 py-4 flex items-center justify-between backdrop-blur-sm flex-shrink-0">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-lg shadow-green-500/50"></div>
                            <h3 className="font-bold text-white text-lg tracking-wide">LIVE PREVIEW</h3>
                        </div>

                        {/* Template Selector */}
                        <div className="flex items-center gap-2 ml-4">
                            <Palette size={16} className="text-gray-400" />
                            <select
                                value={selectedTemplate}
                                onChange={(e) => setTemplate(e.target.value)}
                                className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-neon-purple/50 hover:bg-white/10 transition-all cursor-pointer"
                            >
                                {templates.map((template) => (
                                    <option key={template.id} value={template.id} className="bg-[#1a1a20] text-white">
                                        {template.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Preview Content */}
                <div className="flex-1 overflow-y-auto custom-scrollbar bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-900/20 to-black">
                    <div className="w-full min-h-full flex justify-center py-10 px-4">
                        <div className="relative origin-top scale-[0.65] lg:scale-[0.75] xl:scale-[0.85]">
                            <ResumePreview />
                        </div>
                    </div>
                </div>

                {/* Footer Info */}
                <div className="border-t border-white/10 bg-[#0a0a0f] px-6 py-3 flex items-center justify-between flex-shrink-0">
                    <div className="text-xs text-gray-500">
                        <span className="font-semibold text-gray-400">Template:</span> {currentTemplate?.name}
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="flex gap-1.5">
                            <div className="w-2 h-2 rounded-full bg-red-500/30"></div>
                            <div className="w-2 h-2 rounded-full bg-yellow-500/30"></div>
                            <div className="w-2 h-2 rounded-full bg-green-500/30"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PreviewModal;
