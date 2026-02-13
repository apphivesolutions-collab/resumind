import { useState } from 'react';
import templates from '~/lib/templates/templateDefinitions';
import type { TemplateCategory } from '~/lib/templates/types';
import TemplateCard from './TemplateCard';
import { Search, Grid, List } from 'lucide-react';

interface TemplateGalleryProps {
    selectedTemplateId: string;
    onSelectTemplate: (templateId: string) => void;
    onContinue: () => void;
}

const TemplateGallery = ({ selectedTemplateId, onSelectTemplate, onContinue }: TemplateGalleryProps) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<TemplateCategory | 'all'>('all');

    const categories: Array<{ id: TemplateCategory | 'all'; label: string }> = [
        { id: 'all', label: 'All Templates' },
        { id: 'modern', label: 'Modern' },
        { id: 'traditional', label: 'Traditional' },
        { id: 'creative', label: 'Creative' },
        { id: 'technical', label: 'Technical' },
    ];

    // Filter templates
    const filteredTemplates = templates.filter((template) => {
        const matchesSearch =
            template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            template.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-white mb-2">Choose Your Template</h2>
                <p className="text-gray-400 text-sm">
                    Select a professional template to start building your resume
                </p>
            </div>

            {/* Search and Filters */}
            <div className="space-y-4 mb-6">
                {/* Search Bar */}
                <div className="relative">
                    <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input
                        type="text"
                        placeholder="Search templates..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:border-neon-purple/50 focus:bg-white/10 transition-all"
                    />
                </div>

                {/* Category Filters */}
                <div className="flex flex-wrap gap-2">
                    {categories.map((category) => (
                        <button
                            key={category.id}
                            onClick={() => setSelectedCategory(category.id)}
                            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${selectedCategory === category.id
                                    ? 'bg-gradient-to-r from-neon-purple to-neon-blue text-white shadow-lg shadow-neon-purple/20'
                                    : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10'
                                }`}
                        >
                            {category.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Template Grid */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
                {filteredTemplates.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-6">
                        {filteredTemplates.map((template) => (
                            <TemplateCard
                                key={template.id}
                                template={template}
                                isSelected={selectedTemplateId === template.id}
                                onSelect={() => onSelectTemplate(template.id)}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-64 text-center">
                        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                            <Search size={24} className="text-gray-500" />
                        </div>
                        <p className="text-gray-400 mb-2">No templates found</p>
                        <p className="text-sm text-gray-600">Try adjusting your search or filters</p>
                    </div>
                )}
            </div>

            {/* Continue Button */}
            <div className="mt-6 pt-6 border-t border-white/10">
                <button
                    onClick={onContinue}
                    disabled={!selectedTemplateId}
                    className="w-full py-4 bg-gradient-to-r from-neon-purple to-neon-blue text-white font-bold rounded-xl hover:shadow-lg hover:shadow-neon-purple/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
                >
                    Continue with {templates.find((t) => t.id === selectedTemplateId)?.name || 'Template'}
                </button>
            </div>
        </div>
    );
};

export default TemplateGallery;
