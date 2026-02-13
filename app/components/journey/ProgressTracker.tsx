import { useBuilderStore } from '~/lib/builderStore';
import { Check, Circle, Lock } from 'lucide-react';

const ProgressTracker = () => {
    const { journeyStep, getCompletionPercentage, getSectionCompleteness } = useBuilderStore();
    const completion = getCompletionPercentage();
    const completeness = getSectionCompleteness();

    const steps = [
        { id: 0, label: 'Template', key: null },
        { id: 1, label: 'Personal Info', key: 'personal' },
        { id: 2, label: 'Summary', key: 'summary' },
        { id: 3, label: 'Experience', key: 'experience' },
        { id: 4, label: 'Education', key: 'education' },
        { id: 5, label: 'Skills', key: 'skills' },
        { id: 6, label: 'Projects', key: 'projects' },
        { id: 7, label: 'Review', key: null },
    ];

    const getStepStatus = (step: typeof steps[0]) => {
        if (step.id < journeyStep) return 'complete';
        if (step.id === journeyStep) return 'current';
        return 'upcoming';
    };

    const getCompletenessIcon = (key: string | null) => {
        if (!key) return null;
        const status = completeness[key];

        if (status === 'complete') return <Check size={12} className="text-green-500" />;
        if (status === 'partial') return <Circle size={12} className="text-yellow-500 fill-yellow-500" />;
        return <Circle size={12} className="text-gray-600" />;
    };

    return (
        <div className="bg-gradient-to-br from-[#111118] to-[#0e0e14] border border-white/10 rounded-xl p-6">
            {/* Progress Header */}
            <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-bold text-white">Your Progress</h3>
                    <span className="text-xs font-semibold text-neon-purple">{completion}%</span>
                </div>

                {/* Progress Bar */}
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-neon-purple to-neon-blue transition-all duration-500 ease-out rounded-full"
                        style={{ width: `${completion}%` }}
                    />
                </div>
            </div>

            {/* Step List */}
            <div className="space-y-2">
                {steps.map((step, index) => {
                    const status = getStepStatus(step);
                    const isLocked = step.id > journeyStep + 1;

                    return (
                        <div
                            key={step.id}
                            className={`flex items-center gap-3 p-3 rounded-lg transition-all ${status === 'current'
                                    ? 'bg-gradient-to-r from-neon-purple/10 to-neon-blue/10 border border-neon-purple/30'
                                    : 'bg-white/5 hover:bg-white/10 border border-transparent'
                                }`}
                        >
                            {/* Step Number/Icon */}
                            <div
                                className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${status === 'complete'
                                        ? 'bg-green-500/20 text-green-500 border border-green-500/30'
                                        : status === 'current'
                                            ? 'bg-gradient-to-r from-neon-purple to-neon-blue text-white'
                                            : 'bg-white/5 text-gray-500 border border-white/10'
                                    }`}
                            >
                                {status === 'complete' ? (
                                    <Check size={16} />
                                ) : isLocked ? (
                                    <Lock size={14} />
                                ) : (
                                    step.id + 1
                                )}
                            </div>

                            {/* Step Info */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <p
                                        className={`text-sm font-semibold ${status === 'current'
                                                ? 'text-white'
                                                : status === 'complete'
                                                    ? 'text-gray-400'
                                                    : 'text-gray-600'
                                            }`}
                                    >
                                        {step.label}
                                    </p>
                                    {getCompletenessIcon(step.key)}
                                </div>
                            </div>

                            {/* Connector Line */}
                            {index < steps.length - 1 && (
                                <div
                                    className={`absolute left-10 w-0.5 h-6 translate-y-10 ${status === 'complete' ? 'bg-green-500/30' : 'bg-white/10'
                                        }`}
                                />
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Motivational Message */}
            <div className="mt-6 p-3 bg-neon-purple/5 border border-neon-purple/20 rounded-lg">
                <p className="text-xs text-center text-gray-400">
                    {completion < 25 && "🚀 Great start! Let's build something amazing"}
                    {completion >= 25 && completion < 50 && "💪 You're making excellent progress!"}
                    {completion >= 50 && completion < 75 && "🔥 Over halfway there! Keep going"}
                    {completion >= 75 && completion < 100 && "⭐ Almost there! You're doing great"}
                    {completion === 100 && "🎉 Amazing! Your resume is ready!"}
                </p>
            </div>
        </div>
    );
};

export default ProgressTracker;
