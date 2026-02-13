import { create } from "zustand";
import { persist } from "zustand/middleware";
import { generateUUID } from "./utils"; // Assuming you have this utility

export interface Experience {
    id: string;
    company: string;
    role: string;
    startDate: string;
    endDate: string;
    current: boolean;
    description: string;
}

export interface Education {
    id: string;
    school: string;
    degree: string;
    startDate: string;
    endDate: string;
    current: boolean;
    description: string;
}

export interface Skill {
    id: string;
    name: string;
    level: "Beginner" | "Intermediate" | "Expert";
}

export interface Project {
    id: string;
    title: string;
    technologies: string[];
    link?: string;
    description: string;
}

export interface Certification {
    id: string;
    name: string;
    issuer: string;
    date: string;
    credentialId?: string;
}

export interface JobContext {
    jobTitle: string;
    experienceLevel: 'entry' | 'mid' | 'senior' | 'executive' | 'internship' | 'freelance' | '';
    jobDescription: string;
}

export interface ResumeData {
    personalInfo: {
        fullName: string;
        email: string;
        phone: string;
        location: string;
        website: string;
        linkedin: string;
        professionalTitle: string; // New field
    };
    summary: string;
    experience: Experience[];
    education: Education[];
    skills: Skill[];
    projects: Project[]; // New section
    certifications: Certification[]; // New section
}

interface BuilderStore {
    resume: ResumeData;

    // Template System
    selectedTemplate: string; // template ID
    setTemplate: (templateId: string) => void;

    // Journey System
    journeyStep: number; // 0-7 (0=template, 1=personal, 2=summary, etc.)
    setJourneyStep: (step: number) => void;
    nextStep: () => void;
    previousStep: () => void;
    showWelcome: boolean;
    setShowWelcome: (show: boolean) => void;

    // Progress Tracking
    getCompletionPercentage: () => number;
    getSectionCompleteness: () => Record<string, 'empty' | 'partial' | 'complete'>;

    // Job Context for AI features
    jobContext: JobContext;
    updateJobContext: (field: keyof JobContext, value: string) => void;

    // Summary Options (for multi-option AI generation)
    summaryOptions: string[];
    setSummaryOptions: (options: string[]) => void;
    selectedSummaryIndex: number;
    selectSummary: (index: number) => void;

    updatePersonalInfo: (field: keyof ResumeData["personalInfo"], value: string) => void;
    updateSummary: (summary: string) => void;

    addExperience: () => void;
    updateExperience: (id: string, field: keyof Experience, value: any) => void;
    removeExperience: (id: string) => void;

    addEducation: () => void;
    updateEducation: (id: string, field: keyof Education, value: any) => void;
    removeEducation: (id: string) => void;

    addSkill: (name: string) => void;
    removeSkill: (id: string) => void;

    // Projects
    addProject: () => void;
    updateProject: (id: string, field: keyof Project, value: any) => void;
    removeProject: (id: string) => void;

    // Certifications
    addCertification: () => void;
    updateCertification: (id: string, field: keyof Certification, value: any) => void;
    removeCertification: (id: string) => void;

    // AI Helpers
    isGenerating: boolean;
    setGenerating: (loading: boolean) => void;
}

const initialResume: ResumeData = {
    personalInfo: {
        fullName: "",
        email: "",
        phone: "",
        location: "",
        website: "",
        linkedin: "",
        professionalTitle: "",
    },
    summary: "",
    experience: [],
    education: [],
    skills: [],
    projects: [],
    certifications: [],
};

export const useBuilderStore = create<BuilderStore>()(
    persist(
        (set, get) => ({
            resume: initialResume,

            // Template state
            selectedTemplate: 'modern-minimalist', // default template
            setTemplate: (templateId) => set({ selectedTemplate: templateId }),

            // Journey state
            journeyStep: 0, // Start at template selection
            setJourneyStep: (step) => set({ journeyStep: step }),
            nextStep: () => set((state) => ({ journeyStep: Math.min(state.journeyStep + 1, 7) })),
            previousStep: () => set((state) => ({ journeyStep: Math.max(state.journeyStep - 1, 0) })),
            showWelcome: true,
            setShowWelcome: (show) => set({ showWelcome: show }),

            // Progress tracking
            getCompletionPercentage: () => {
                const state = get();
                const completeness = get().getSectionCompleteness();
                const sections = Object.values(completeness);
                const completed = sections.filter(s => s === 'complete').length;
                const partial = sections.filter(s => s === 'partial').length;
                return Math.round(((completed + partial * 0.5) / sections.length) * 100);
            },

            getSectionCompleteness: () => {
                const state = get();
                const { resume } = state;

                return {
                    personal: (
                        resume.personalInfo.fullName && resume.personalInfo.email && resume.personalInfo.phone
                    ) ? 'complete' : (
                        resume.personalInfo.fullName || resume.personalInfo.email || resume.personalInfo.phone
                    ) ? 'partial' : 'empty',

                    summary: resume.summary.length > 50 ? 'complete' : resume.summary.length > 0 ? 'partial' : 'empty',

                    experience: resume.experience.length >= 2 ? 'complete' : resume.experience.length > 0 ? 'partial' : 'empty',

                    education: resume.education.length >= 1 ? 'complete' : 'empty',

                    skills: resume.skills.length >= 5 ? 'complete' : resume.skills.length > 0 ? 'partial' : 'empty',

                    projects: (resume.projects || []).length > 0 ? 'complete' : 'empty',

                    certifications: (resume.certifications || []).length > 0 ? 'complete' : 'empty',
                };
            },

            // Job Context state
            jobContext: {
                jobTitle: "",
                experienceLevel: "",
                jobDescription: "",
            },

            // Summary Options state
            summaryOptions: [],
            selectedSummaryIndex: -1,

            isGenerating: false,
            setGenerating: (isGenerating) => set({ isGenerating }),

            // Job Context methods
            updateJobContext: (field, value) =>
                set((state) => ({
                    jobContext: { ...state.jobContext, [field]: value },
                })),

            // Summary Options methods
            setSummaryOptions: (options) =>
                set({ summaryOptions: options, selectedSummaryIndex: -1 }),

            selectSummary: (index) =>
                set((state) => ({
                    selectedSummaryIndex: index,
                    resume: {
                        ...state.resume,
                        summary: state.summaryOptions[index] || state.resume.summary,
                    },
                })),

            updatePersonalInfo: (field, value) =>
                set((state) => ({
                    resume: {
                        ...state.resume,
                        personalInfo: { ...state.resume.personalInfo, [field]: value },
                    },
                })),

            updateSummary: (summary) =>
                set((state) => ({
                    resume: { ...state.resume, summary },
                })),

            addExperience: () =>
                set((state) => ({
                    resume: {
                        ...state.resume,
                        experience: [
                            ...state.resume.experience,
                            {
                                id: generateUUID(),
                                company: "",
                                role: "",
                                startDate: "",
                                endDate: "",
                                current: false,
                                description: "",
                            },
                        ],
                    },
                })),

            updateExperience: (id, field, value) =>
                set((state) => ({
                    resume: {
                        ...state.resume,
                        experience: state.resume.experience.map((exp) =>
                            exp.id === id ? { ...exp, [field]: value } : exp
                        ),
                    },
                })),

            removeExperience: (id) =>
                set((state) => ({
                    resume: {
                        ...state.resume,
                        experience: state.resume.experience.filter((exp) => exp.id !== id),
                    },
                })),

            addEducation: () =>
                set((state) => ({
                    resume: {
                        ...state.resume,
                        education: [
                            ...state.resume.education,
                            {
                                id: generateUUID(),
                                school: "",
                                degree: "",
                                startDate: "",
                                endDate: "",
                                current: false,
                                description: "",
                            },
                        ],
                    },
                })),

            updateEducation: (id, field, value) =>
                set((state) => ({
                    resume: {
                        ...state.resume,
                        education: state.resume.education.map((edu) =>
                            edu.id === id ? { ...edu, [field]: value } : edu
                        ),
                    },
                })),

            removeEducation: (id) =>
                set((state) => ({
                    resume: {
                        ...state.resume,
                        education: state.resume.education.filter((edu) => edu.id !== id),
                    },
                })),

            addSkill: (name) =>
                set((state) => ({
                    resume: {
                        ...state.resume,
                        skills: [
                            ...state.resume.skills,
                            { id: generateUUID(), name, level: "Intermediate" },
                        ],
                    },
                })),

            removeSkill: (id) =>
                set((state) => ({
                    resume: {
                        ...state.resume,
                        skills: state.resume.skills.filter((skill) => skill.id !== id),
                    },
                })),

            // Projects methods
            addProject: () =>
                set((state) => ({
                    resume: {
                        ...state.resume,
                        projects: [
                            ...state.resume.projects,
                            {
                                id: generateUUID(),
                                title: "",
                                technologies: [],
                                link: "",
                                description: "",
                            },
                        ],
                    },
                })),

            updateProject: (id, field, value) =>
                set((state) => ({
                    resume: {
                        ...state.resume,
                        projects: state.resume.projects.map((proj) =>
                            proj.id === id ? { ...proj, [field]: value } : proj
                        ),
                    },
                })),

            removeProject: (id) =>
                set((state) => ({
                    resume: {
                        ...state.resume,
                        projects: state.resume.projects.filter((proj) => proj.id !== id),
                    },
                })),

            // Certifications methods
            addCertification: () =>
                set((state) => ({
                    resume: {
                        ...state.resume,
                        certifications: [
                            ...state.resume.certifications,
                            {
                                id: generateUUID(),
                                name: "",
                                issuer: "",
                                date: "",
                                credentialId: "",
                            },
                        ],
                    },
                })),

            updateCertification: (id, field, value) =>
                set((state) => ({
                    resume: {
                        ...state.resume,
                        certifications: state.resume.certifications.map((cert) =>
                            cert.id === id ? { ...cert, [field]: value } : cert
                        ),
                    },
                })),

            removeCertification: (id) =>
                set((state) => ({
                    resume: {
                        ...state.resume,
                        certifications: state.resume.certifications.filter((cert) => cert.id !== id),
                    },
                })),
        }),
        {
            name: "resume-builder-storage",
        }
    )
);
