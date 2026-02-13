import type { Template } from '~/lib/templates/types';
import { Check } from 'lucide-react';

interface TemplateCardProps {
    template: Template;
    isSelected: boolean;
    onSelect: () => void;
}

const TemplateCard = ({ template, isSelected, onSelect }: TemplateCardProps) => {
    // Category badge colors
    const categoryColors = {
        modern: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
        traditional: 'bg-gray-500/10 text-gray-400 border-gray-500/30',
        creative: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
        technical: 'bg-green-500/10 text-green-400 border-green-500/30',
    };

    return (
        <button
            onClick={onSelect}
            className={`group relative bg-gradient-to-br from-[#1a1a20] to-[#111118] rounded-xl overflow-hidden border transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl ${isSelected
                    ? 'border-neon-purple shadow-lg shadow-neon-purple/20'
                    : 'border-white/10 hover:border-white/20'
                }`}
        >
            {/* Selected Indicator */}
            {isSelected && (
                <div className="absolute top-3 right-3 z-10 w-6 h-6 rounded-full bg-neon-purple flex items-center justify-center shadow-lg shadow-neon-purple/50">
                    <Check size={14} className="text-white" />
                </div>
            )}

            {/* Template Preview */}
            <div className="aspect-[3/4] bg-white/5 flex items-center justify-center border-b border-white/5 relative overflow-hidden">
                {/* Gradient Overlay representing template style */}
                <div
                    className="absolute inset-0 opacity-20"
                    style={{
                        background: `linear-gradient(135deg, ${template.colors.primary}, ${template.colors.accent})`,
                    }}
                />

                {/* Template Name as Preview */}
                <div className="relative text-center p-6 space-y-3">
                    <div
                        className="text-3xl font-bold"
                        style={{ color: template.colors.primary }}
                    >
                        {template.name.split(' ')[0]}
                    </div>
                    <div className="space-y-1">
                        <div className="h-2 bg-white/20 rounded-full w-32 mx-auto" />
                        <div className="h-2 bg-white/15 rounded-full w-24 mx-auto" />
                        <div className="h-2 bg-white/10 rounded-full w-28 mx-auto" />
                    </div>
                </div>
            </div>

            {/* Template Info */}
            <div className="p-4 space-y-3">
                <div>
                    <h3 className="font-bold text-white text-sm mb-1">{template.name}</h3>
                    <p className="text-xs text-gray-400 line-clamp-2">{template.description}</p>
                </div>

                {/* Category Badge */}
                <div className="flex items-center justify-between">
                    <span
                        className={`text-[10px] font-semibold px-2 py-1 rounded-full border ${categoryColors[template.category]
                            }`}
                    >
                        {template.category.toUpperCase()}
                    </span>

                    {/* Layout Indicator */}
                    <span className="text-[10px] text-gray-500">
                        {template.layout === '1-column' && '1 Column'}
                        {template.layout === '2-column' && '2 Columns'}
                        {template.layout === 'hybrid' && 'Hybrid'}
                    </span>
                </div>

                {/* Features */}
                <div className="flex flex-wrap gap-1">
                    {template.features.showIcons && (
                        <span className="text-[9px] bg-white/5 px-1.5 py-0.5 rounded text-gray-500">
                            Icons
                        </span>
                    )}
                    {template.features.skillBars && (
                        <span className="text-[9px] bg-white/5 px-1.5 py-0.5 rounded text-gray-500">
                            Skill Bars
                        </span>
                    )}
                    {template.features.timeline && (
                        <span className="text-[9px] bg-white/5 px-1.5 py-0.5 rounded text-gray-500">
                            Timeline
                        </span>
                    )}
                </div>
            </div>

            {/* Hover Effect */}
            <div className="absolute inset-0 bg-gradient-to-t from-neon-purple/0 to-neon-purple/0 group-hover:from-neon-purple/5 group-hover:to-transparent transition-all duration-300 pointer-events-none" />
        </button>
    );
};

export default TemplateCard;
