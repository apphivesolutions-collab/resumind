// Template Type Definitions

export type TemplateCategory = 'modern' | 'traditional' | 'creative' | 'technical';
export type TemplateLayout = '1-column' | '2-column' | 'hybrid';

export interface TemplateColors {
    primary: string;
    secondary: string;
    accent: string;
    text: string;
    textSecondary: string;
    background: string;
    border: string;
}

export interface TemplateFonts {
    heading: string;
    body: string;
    accent?: string;
}

export interface TemplateFeatures {
    showIcons: boolean;
    showPhoto: boolean;
    skillBars: boolean;
    timeline: boolean;
    coloredHeaders: boolean;
    sidebarLayout: boolean;
}

export interface Template {
    id: string;
    name: string;
    description: string;
    category: TemplateCategory;
    preview: string; // Preview image path
    colors: TemplateColors;
    fonts: TemplateFonts;
    layout: TemplateLayout;
    sectionOrder: string[];
    features: TemplateFeatures;
    isPremium: boolean;
}

// Default section orders for different template types
export const DEFAULT_SECTION_ORDERS = {
    standard: ['personal', 'summary', 'experience', 'education', 'skills', 'projects', 'certifications'],
    academic: ['personal', 'summary', 'education', 'publications', 'experience', 'skills', 'certifications'],
    creative: ['personal', 'summary', 'projects', 'experience', 'skills', 'education', 'certifications'],
    technical: ['personal', 'summary', 'skills', 'experience', 'projects', 'education', 'certifications'],
};

