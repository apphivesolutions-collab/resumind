import { useBuilderStore } from '~/lib/builderStore';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const JourneyNavigation = () => {
    const { journeyStep, previousStep, nextStep, getSectionCompleteness } = useBuilderStore();
    const completeness = getSectionCompleteness();

    const steps = [
        { id: 1, label: 'Personal Details', key: 'personal' },
        { id: 2, label: 'Professional Summary', key: 'summary' },
        { id: 3, label: 'Work Experience', key: 'experience' },
        { id: 4, label: 'Education', key: 'education' },
        { id: 5, label: 'Skills', key: 'skills' },
        { id: 6, label: 'Projects', key: 'projects' },
        { id: 7, label: 'Certifications', key: 'certifications' },
    ];

    const currentStep = steps.find((s) => s.id === journeyStep);
    const canGoNext = journeyStep < 7;
    const canGoPrevious = journeyStep > 1;

    // Check if current section is at least partially complete
    const isCurrentStepValid = () => {
        if (!currentStep?.key) return true; // Template and Review steps are always valid
        const status = completeness[currentStep.key];
        return status === 'complete' || status === 'partial';
    };

    return (
        <div className="flex items-center justify-between py-4 border-t border-white/10 bg-[#0a0a0f]">
            {/* Previous Button */}
            <button
                onClick={previousStep}
                disabled={!canGoPrevious}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-gray-400 hover:text-white hover:bg-white/5 transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent"
            >
                <ChevronLeft size={18} />
                <span>Previous</span>
            </button>

            {/* Step Indicator */}
            <div className="text-center">
                <p className="text-xs text-gray-500 mb-1">Step {journeyStep} of 7</p>
                <p className="text-sm font-semibold text-white">{currentStep?.label}</p>
            </div>

            {/* Next Button */}
            <button
                onClick={nextStep}
                disabled={!canGoNext}
                className="flex items-center gap-2 px-6 py-2 rounded-lg bg-gradient-to-r from-neon-purple to-neon-blue text-white font-semibold text-sm hover:shadow-lg hover:shadow-neon-purple/30 transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:shadow-none"
            >
                <span>{journeyStep === 7 ? 'Finish' : 'Next'}</span>
                <ChevronRight size={18} />
            </button>
        </div>
    );
};

export default JourneyNavigation;
