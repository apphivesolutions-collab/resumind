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

export interface ResumeData {
    personalInfo: {
        fullName: string;
        email: string;
        phone: string;
        location: string;
        website: string;
        linkedin: string;
    };
    summary: string;
    experience: Experience[];
    education: Education[];
    skills: Skill[];
}

interface BuilderStore {
    resume: ResumeData;
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
    },
    summary: "",
    experience: [],
    education: [],
    skills: [],
};

export const useBuilderStore = create<BuilderStore>()(
    persist(
        (set) => ({
            resume: initialResume,
            isGenerating: false,
            setGenerating: (isGenerating) => set({ isGenerating }),

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
        }),
        {
            name: "resume-builder-storage",
        }
    )
);
