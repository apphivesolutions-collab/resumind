import { X, Sparkles, ArrowRight, Rocket } from 'lucide-react';
import { useBuilderStore } from '~/lib/builderStore';
import TemplateGallery from './TemplateGallery';

interface WelcomeModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const WelcomeModal = ({ isOpen, onClose }: WelcomeModalProps) => {
    const { selectedTemplate, setTemplate, setJourneyStep, setShowWelcome } = useBuilderStore();

    const handleContinue = () => {
        setJourneyStep(1); // Move to Personal Info step
        setShowWelcome(false);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-300">
            <div className="bg-gradient-to-br from-[#1a1a20] to-[#0e0e14] border border-white/10 rounded-2xl max-w-6xl w-full max-h-[90vh] shadow-2xl flex flex-col overflow-hidden">
                {/* Header */}
                <div className="relative border-b border-white/10 bg-gradient-to-r from-[#0e0e14] to-[#111118] px-8 py-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neon-purple to-neon-blue flex items-center justify-center">
                                <Rocket size={20} className="text-white" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                                    Welcome to Resumind
                                    <Sparkles size={20} className="text-neon-purple" />
                                </h2>
                                <p className="text-sm text-gray-400">Let's create your perfect resume together</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-8">
                    <TemplateGallery
                        selectedTemplateId={selectedTemplate}
                        onSelectTemplate={setTemplate}
                        onContinue={handleContinue}
                    />
                </div>

                {/* Footer with Journey Steps Preview */}
                <div className="border-t border-white/10 bg-[#0a0a0f] px-8 py-4">
                    <div className="flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-neon-purple"></div>
                            <span>Step 1 of 7</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <span>Personal Info</span>
                            <ArrowRight size={12} />
                            <span>Summary</span>
                            <ArrowRight size={12} />
                            <span>Experience</span>
                            <ArrowRight size={12} />
                            <span className="text-gray-600">...</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WelcomeModal;
