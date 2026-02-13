import type { Template, TemplateCategory } from './types';
import { DEFAULT_SECTION_ORDERS } from './types';

// Template Definitions - 10 Professional Resume Templates

export const templates: Template[] = [
    // 1. Modern Minimalist
    {
        id: 'modern-minimalist',
        name: 'Modern Minimalist',
        description: 'Clean, professional design with plenty of white space',
        category: 'modern',
        preview: '/templates/modern-minimalist.png',
        colors: {
            primary: '#2563eb', // Blue
            secondary: '#64748b',
            accent: '#3b82f6',
            text: '#1e293b',
            textSecondary: '#64748b',
            background: '#ffffff',
            border: '#e2e8f0',
        },
        fonts: {
            heading: 'Inter',
            body: 'Inter',
        },
        layout: '1-column',
        sectionOrder: DEFAULT_SECTION_ORDERS.standard,
        features: {
            showIcons: true,
            showPhoto: false,
            skillBars: false,
            timeline: false,
            coloredHeaders: true,
            sidebarLayout: false,
        },
        isPremium: false,
    },

    // 2. Executive Professional
    {
        id: 'executive-professional',
        name: 'Executive Professional',
        description: 'Traditional, sophisticated layout for senior positions',
        category: 'traditional',
        preview: '/templates/executive-professional.png',
        colors: {
            primary: '#1e293b',
            secondary: '#475569',
            accent: '#0f172a',
            text: '#0f172a',
            textSecondary: '#64748b',
            background: '#ffffff',
            border: '#cbd5e1',
        },
        fonts: {
            heading: 'Merriweather',
            body: 'Georgia',
        },
        layout: '1-column',
        sectionOrder: DEFAULT_SECTION_ORDERS.standard,
        features: {
            showIcons: false,
            showPhoto: false,
            skillBars: false,
            timeline: true,
            coloredHeaders: false,
            sidebarLayout: false,
        },
        isPremium: false,
    },

    // 3. Creative Designer
    {
        id: 'creative-designer',
        name: 'Creative Designer',
        description: 'Bold, colorful design for creative professionals',
        category: 'creative',
        preview: '/templates/creative-designer.png',
        colors: {
            primary: '#8b5cf6', // Purple
            secondary: '#a78bfa',
            accent: '#c084fc',
            text: '#1e293b',
            textSecondary: '#64748b',
            background: '#ffffff',
            border: '#e9d5ff',
        },
        fonts: {
            heading: 'Poppins',
            body: 'Inter',
            accent: 'Poppins',
        },
        layout: '2-column',
        sectionOrder: DEFAULT_SECTION_ORDERS.creative,
        features: {
            showIcons: true,
            showPhoto: true,
            skillBars: true,
            timeline: false,
            coloredHeaders: true,
            sidebarLayout: true,
        },
        isPremium: false,
    },

    // 4. Tech Specialist
    {
        id: 'tech-specialist',
        name: 'Tech Specialist',
        description: 'Modern tech-focused design with monospace accents',
        category: 'technical',
        preview: '/templates/tech-specialist.png',
        colors: {
            primary: '#10b981', // Green
            secondary: '#6b7280',
            accent: '#34d399',
            text: '#111827',
            textSecondary: '#6b7280',
            background: '#ffffff',
            border: '#d1d5db',
        },
        fonts: {
            heading: 'JetBrains Mono',
            body: 'Inter',
            accent: 'JetBrains Mono',
        },
        layout: 'hybrid',
        sectionOrder: DEFAULT_SECTION_ORDERS.technical,
        features: {
            showIcons: true,
            showPhoto: false,
            skillBars: true,
            timeline: false,
            coloredHeaders: true,
            sidebarLayout: false,
        },
        isPremium: false,
    },

    // 5. Academic Scholar
    {
        id: 'academic-scholar',
        name: 'Academic Scholar',
        description: 'Publication and research-focused layout',
        category: 'traditional',
        preview: '/templates/academic-scholar.png',
        colors: {
            primary: '#1e40af', // Dark blue
            secondary: '#64748b',
            accent: '#3b82f6',
            text: '#0f172a',
            textSecondary: '#475569',
            background: '#ffffff',
            border: '#cbd5e1',
        },
        fonts: {
            heading: 'Lora',
            body: 'Crimson Text',
        },
        layout: '1-column',
        sectionOrder: DEFAULT_SECTION_ORDERS.academic,
        features: {
            showIcons: false,
            showPhoto: false,
            skillBars: false,
            timeline: true,
            coloredHeaders: false,
            sidebarLayout: false,
        },
        isPremium: false,
    },

    // 6. Sales & Marketing
    {
        id: 'sales-marketing',
        name: 'Sales & Marketing',
        description: 'Results-driven design with emphasis on achievements',
        category: 'modern',
        preview: '/templates/sales-marketing.png',
        colors: {
            primary: '#f59e0b', // Amber/Gold
            secondary: '#78716c',
            accent: '#fbbf24',
            text: '#292524',
            textSecondary: '#78716c',
            background: '#ffffff',
            border: '#e7e5e4',
        },
        fonts: {
            heading: 'Montserrat',
            body: 'Open Sans',
        },
        layout: '1-column',
        sectionOrder: DEFAULT_SECTION_ORDERS.standard,
        features: {
            showIcons: true,
            showPhoto: true,
            skillBars: true,
            timeline: false,
            coloredHeaders: true,
            sidebarLayout: false,
        },
        isPremium: false,
    },

    // 7. Startup Founder
    {
        id: 'startup-founder',
        name: 'Startup Founder',
        description: 'Entrepreneurial, project-focused dynamic layout',
        category: 'creative',
        preview: '/templates/startup-founder.png',
        colors: {
            primary: '#ec4899', // Pink
            secondary: '#64748b',
            accent: '#f472b6',
            text: '#1e293b',
            textSecondary: '#64748b',
            background: '#ffffff',
            border: '#fce7f3',
        },
        fonts: {
            heading: 'Space Grotesk',
            body: 'Inter',
        },
        layout: 'hybrid',
        sectionOrder: DEFAULT_SECTION_ORDERS.creative,
        features: {
            showIcons: true,
            showPhoto: true,
            skillBars: false,
            timeline: true,
            coloredHeaders: true,
            sidebarLayout: false,
        },
        isPremium: false,
    },

    // 8. Medical Professional
    {
        id: 'medical-professional',
        name: 'Medical Professional',
        description: 'Clean, trustworthy design for healthcare careers',
        category: 'traditional',
        preview: '/templates/medical-professional.png',
        colors: {
            primary: '#0891b2', // Cyan
            secondary: '#64748b',
            accent: '#06b6d4',
            text: '#0f172a',
            textSecondary: '#475569',
            background: '#ffffff',
            border: '#cbd5e1',
        },
        fonts: {
            heading: 'Roboto',
            body: 'Roboto',
        },
        layout: '1-column',
        sectionOrder: [...DEFAULT_SECTION_ORDERS.standard.slice(0, 5), 'certifications', ...DEFAULT_SECTION_ORDERS.standard.slice(5)],
        features: {
            showIcons: true,
            showPhoto: false,
            skillBars: false,
            timeline: false,
            coloredHeaders: true,
            sidebarLayout: false,
        },
        isPremium: false,
    },

    // 9. Finance Expert
    {
        id: 'finance-expert',
        name: 'Finance Expert',
        description: 'Conservative, professional design for finance sector',
        category: 'traditional',
        preview: '/templates/finance-expert.png',
        colors: {
            primary: '#334155',
            secondary: '#64748b',
            accent: '#475569',
            text: '#0f172a',
            textSecondary: '#64748b',
            background: '#ffffff',
            border: '#cbd5e1',
        },
        fonts: {
            heading: 'Playfair Display',
            body: 'Lato',
        },
        layout: '1-column',
        sectionOrder: DEFAULT_SECTION_ORDERS.standard,
        features: {
            showIcons: false,
            showPhoto: false,
            skillBars: false,
            timeline: true,
            coloredHeaders: false,
            sidebarLayout: false,
        },
        isPremium: false,
    },

    // 10. International
    {
        id: 'international',
        name: 'International',
        description: 'Global-ready format with flexible layout',
        category: 'modern',
        preview: '/templates/international.png',
        colors: {
            primary: '#6366f1', // Indigo
            secondary: '#64748b',
            accent: '#818cf8',
            text: '#1e293b',
            textSecondary: '#64748b',
            background: '#ffffff',
            border: '#e0e7ff',
        },
        fonts: {
            heading: 'Source Sans Pro',
            body: 'Source Sans Pro',
        },
        layout: '2-column',
        sectionOrder: DEFAULT_SECTION_ORDERS.standard,
        features: {
            showIcons: true,
            showPhoto: true,
            skillBars: true,
            timeline: false,
            coloredHeaders: true,
            sidebarLayout: true,
        },
        isPremium: false,
    },
];

// Helper functions
export const getTemplateById = (id: string): Template | undefined => {
    return templates.find(t => t.id === id);
};

export const getTemplatesByCategory = (category: TemplateCategory): Template[] => {
    return templates.filter(t => t.category === category);
};

export const getFreeTemplates = (): Template[] => {
    return templates.filter(t => !t.isPremium);
};

export const getPremiumTemplates = (): Template[] => {
    return templates.filter(t => t.isPremium);
};

export default templates;
