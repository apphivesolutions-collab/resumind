import Navbar from "~/components/Navbar";
import type { MetaArgs } from "react-router";
import { useState, useRef } from "react";
import { useNavigate, Link } from "react-router";
import { useBuilderStore } from "~/lib/builderStore";
import PersonalDetails from "~/components/builder/PersonalDetails";
import ExperienceSection from "~/components/builder/ExperienceSection";
import EducationSection from "~/components/builder/EducationSection";
import SkillsSection from "~/components/builder/SkillsSection";
import SummarySection from "~/components/builder/SummarySection";
import ProjectsSection from "~/components/builder/ProjectsSection";
import CertificationsSection from "~/components/builder/CertificationsSection";
import ResumePreview from "~/components/builder/ResumePreview";
import WelcomeModal from "~/components/journey/WelcomeModal";
import ProgressTracker from "~/components/journey/ProgressTracker";
import JourneyNavigation from "~/components/journey/JourneyNavigation";
import PreviewModal from "~/components/journey/PreviewModal";
import { User, Briefcase, GraduationCap, Code, FileText, ChevronRight, ArrowLeft, Download, AlertTriangle, X, FolderKanban, Award, Palette, Eye } from "lucide-react";
import jsPDF from "jspdf";

export function meta({ }: MetaArgs) {
    return [
        { title: "Resumind AI | Builder" },
        { name: "description", content: "Build your professional resume with AI" },
    ];
}

const Builder = () => {
    const { resume, journeyStep, setJourneyStep, showWelcome, setShowWelcome } = useBuilderStore();
    const [activeTab, setActiveTab] = useState("personal");
    const [showExitModal, setShowExitModal] = useState(false);
    const [showMobilePreview, setShowMobilePreview] = useState(false);
    const [showPreview, setShowPreview] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);
    const navigate = useNavigate();
    const previewRef = useRef<HTMLDivElement>(null);

    // Tab to step mapping
    const tabToStepMap: Record<string, number> = {
        personal: 1,
        summary: 2,
        experience: 3,
        education: 4,
        skills: 5,
        projects: 6,
        certifications: 7,
    };

    const stepToTabMap: Record<number, string> = {
        1: 'personal',
        2: 'summary',
        3: 'experience',
        4: 'education',
        5: 'skills',
        6: 'projects',
        7: 'certifications',
    };

    // Handle tab changes to update journey step
    const handleTabChange = (tabId: string) => {
        setActiveTab(tabId);
        setJourneyStep(tabToStepMap[tabId] || 1);
    };

    const tabs = [
        { id: "personal", label: "Personal Info", icon: User },
        { id: "summary", label: "Summary", icon: FileText },
        { id: "experience", label: "Experience", icon: Briefcase },
        { id: "education", label: "Education", icon: GraduationCap },
        { id: "skills", label: "Skills", icon: Code },
        { id: "projects", label: "Projects", icon: FolderKanban },
        { id: "certifications", label: "Certifications", icon: Award },
    ];

    const renderSection = () => {
        switch (activeTab) {
            case "personal": return <PersonalDetails />;
            case "summary": return <SummarySection />;
            case "experience": return <ExperienceSection />;
            case "education": return <EducationSection />;
            case "skills": return <SkillsSection />;
            case "projects": return <ProjectsSection />;
            case "certifications": return <CertificationsSection />;
            default: return <PersonalDetails />;
        }
    };

    const handleDownloadPDF = async () => {
        setIsDownloading(true);

        try {
            const pdf = new jsPDF("p", "mm", "a4");
            const pageWidth = pdf.internal.pageSize.getWidth();
            const margin = 20;
            const contentWidth = pageWidth - (margin * 2);
            let yPos = margin;

            // Helper function to check for new page
            const checkNewPage = (spaceNeeded: number = 15) => {
                if (yPos + spaceNeeded > 270) {
                    pdf.addPage();
                    yPos = margin;
                    return true;
                }
                return false;
            };

            const addSection = (title: string) => {
                checkNewPage(15);
                yPos += 6;
                pdf.setFontSize(11);
                pdf.setFont("helvetica", "bold");
                pdf.setTextColor(0, 0, 0);
                pdf.text(title.toUpperCase(), margin, yPos);
                yPos += 1;
                pdf.setDrawColor(200, 200, 200);
                pdf.line(margin, yPos, pageWidth - margin, yPos);
                yPos += 5;
            };

            // Header - Personal Info
            if (resume.personalInfo.fullName) {
                pdf.setFontSize(20);
                pdf.setFont("helvetica", "bold");
                pdf.setTextColor(0, 0, 0);
                pdf.text(resume.personalInfo.fullName.toUpperCase(), margin, yPos);
                yPos += 7;
            }

            // Professional Title
            if (resume.personalInfo.professionalTitle) {
                pdf.setFontSize(12);
                pdf.setFont("helvetica", "bold");
                pdf.setTextColor(60, 60, 60);
                pdf.text(resume.personalInfo.professionalTitle, margin, yPos);
                yPos += 7;
            }

            // Contact Info
            pdf.setFontSize(9);
            pdf.setFont("helvetica", "normal");
            pdf.setTextColor(60, 60, 60);
            const contactInfo = [
                resume.personalInfo.email,
                resume.personalInfo.phone,
                resume.personalInfo.location,
                resume.personalInfo.linkedin?.replace(/^https?:\/\//, ''),
                resume.personalInfo.website?.replace(/^https?:\/\//, '')
            ].filter(Boolean).join(" • ");

            if (contactInfo) {
                const contactLines = pdf.splitTextToSize(contactInfo, contentWidth);
                contactLines.forEach((line: string) => {
                    pdf.text(line, margin, yPos);
                    yPos += 4;
                });
            }

            pdf.setDrawColor(0, 0, 0);
            pdf.setLineWidth(0.5);
            pdf.line(margin, yPos, pageWidth - margin, yPos);
            yPos += 2;

            // Summary
            if (resume.summary) {
                addSection("Professional Summary");
                pdf.setFontSize(10);
                pdf.setFont("helvetica", "normal");
                pdf.setTextColor(40, 40, 40);
                const summaryLines = pdf.splitTextToSize(resume.summary, contentWidth);
                summaryLines.forEach((line: string) => {
                    checkNewPage();
                    pdf.text(line, margin, yPos);
                    yPos += 4.5;
                });
            }

            // Experience
            if (resume.experience.length > 0) {
                addSection("Work Experience");
                resume.experience.forEach((exp) => {
                    checkNewPage(25);

                    // Role and dates
                    pdf.setFontSize(11);
                    pdf.setFont("helvetica", "bold");
                    pdf.setTextColor(0, 0, 0);
                    pdf.text(exp.role, margin, yPos);

                    const dates = `${exp.startDate} – ${exp.endDate || "Present"}`;
                    pdf.setFont("helvetica", "normal");
                    pdf.setFontSize(9);
                    pdf.setTextColor(80, 80, 80);
                    const dateWidth = pdf.getTextWidth(dates);
                    pdf.text(dates, pageWidth - margin - dateWidth, yPos);
                    yPos += 5;

                    // Company
                    pdf.setFontSize(10);
                    pdf.setFont("helvetica", "bold");
                    pdf.setTextColor(40, 40, 40);
                    pdf.text(exp.company, margin, yPos);
                    yPos += 5;

                    // Description
                    if (exp.description) {
                        pdf.setFontSize(9);
                        pdf.setFont("helvetica", "normal");
                        pdf.setTextColor(40, 40, 40);
                        const descLines = pdf.splitTextToSize(exp.description, contentWidth);
                        descLines.forEach((line: string) => {
                            checkNewPage();
                            pdf.text(line, margin, yPos);
                            yPos += 4;
                        });
                    }
                    yPos += 3;
                });
            }

            // Education
            if (resume.education.length > 0) {
                addSection("Education");
                resume.education.forEach((edu) => {
                    checkNewPage(15);

                    pdf.setFontSize(11);
                    pdf.setFont("helvetica", "bold");
                    pdf.setTextColor(0, 0, 0);
                    pdf.text(edu.school, margin, yPos);

                    const dates = `${edu.startDate} – ${edu.endDate || "Present"}`;
                    pdf.setFont("helvetica", "normal");
                    pdf.setFontSize(9);
                    pdf.setTextColor(80, 80, 80);
                    const dateWidth = pdf.getTextWidth(dates);
                    pdf.text(dates, pageWidth - margin - dateWidth, yPos);
                    yPos += 5;

                    pdf.setFontSize(10);
                    pdf.setTextColor(40, 40, 40);
                    pdf.text(edu.degree, margin, yPos);
                    yPos += 6;
                });
            }

            // Skills
            if (resume.skills.length > 0) {
                addSection("Technical Skills");
                pdf.setFontSize(9);
                pdf.setFont("helvetica", "normal");
                pdf.setTextColor(40, 40, 40);
                const skillsText = resume.skills.map((s) => s.name).join(" • ");
                const skillLines = pdf.splitTextToSize(skillsText, contentWidth);
                skillLines.forEach((line: string) => {
                    checkNewPage();
                    pdf.text(line, margin, yPos);
                    yPos += 4;
                });
            }

            // Projects
            if (resume.projects.length > 0) {
                addSection("Projects");
                resume.projects.forEach((project) => {
                    checkNewPage(20);

                    // Project title
                    pdf.setFontSize(11);
                    pdf.setFont("helvetica", "bold");
                    pdf.setTextColor(0, 0, 0);
                    pdf.text(project.title, margin, yPos);
                    yPos += 5;

                    // Technologies
                    if (project.technologies.length > 0) {
                        pdf.setFontSize(9);
                        pdf.setFont("helvetica", "bold");
                        pdf.setTextColor(80, 80, 80);
                        pdf.text(project.technologies.join(" • "), margin, yPos);
                        yPos += 5;
                    }

                    // Description
                    if (project.description) {
                        pdf.setFontSize(9);
                        pdf.setFont("helvetica", "normal");
                        pdf.setTextColor(40, 40, 40);
                        const descLines = pdf.splitTextToSize(project.description, contentWidth);
                        descLines.forEach((line: string) => {
                            checkNewPage();
                            pdf.text(line, margin, yPos);
                            yPos += 4;
                        });
                    }

                    // Link
                    if (project.link) {
                        pdf.setFontSize(8);
                        pdf.setTextColor(80, 80, 80);
                        pdf.text(project.link, margin, yPos);
                        yPos += 2;
                    }

                    yPos += 3;
                });
            }

            // Certifications
            if (resume.certifications.length > 0) {
                addSection("Certifications");
                resume.certifications.forEach((cert) => {
                    checkNewPage(12);

                    // Certification name and date
                    pdf.setFontSize(11);
                    pdf.setFont("helvetica", "bold");
                    pdf.setTextColor(0, 0, 0);
                    pdf.text(cert.name, margin, yPos);

                    if (cert.date) {
                        pdf.setFont("helvetica", "normal");
                        pdf.setFontSize(9);
                        pdf.setTextColor(80, 80, 80);
                        const dateWidth = pdf.getTextWidth(cert.date);
                        pdf.text(cert.date, pageWidth - margin - dateWidth, yPos);
                    }
                    yPos += 5;

                    // Issuer
                    pdf.setFontSize(10);
                    pdf.setTextColor(40, 40, 40);
                    pdf.text(cert.issuer, margin, yPos);
                    yPos += 4;

                    // Credential ID/Link
                    if (cert.credentialId) {
                        pdf.setFontSize(8);
                        pdf.setTextColor(80, 80, 80);
                        pdf.text(cert.credentialId, margin, yPos);
                        yPos += 5;
                    }

                    yPos += 2;
                });
            }

            const fileName = resume.personalInfo.fullName
                ? `${resume.personalInfo.fullName.replace(/\s+/g, "_")}_Resume.pdf`
                : "My_Resume.pdf";

            pdf.save(fileName);
        } catch (error) {
            console.error("PDF generation failed", error);
            alert("Failed to generate PDF. Please try again.");
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <main className="bg-[#0a0a0f] min-h-screen text-white flex flex-col font-sans selection:bg-neon-purple/30">
            {/* Mobile Preview Button (Header) */}
            <header className="h-16 border-b border-white/5 bg-[#0a0a0f] flex items-center justify-between px-4 lg:px-6 z-30">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setShowExitModal(true)}
                        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                    >
                        <ArrowLeft size={18} />
                        <span className="hidden sm:inline font-medium text-sm">Back to Home</span>
                    </button>
                </div>

                <div className="hidden md:block absolute left-1/2 -translate-x-1/2 font-bold text-lg tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-neon-purple">
                    RESUMIND BUILDER
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setShowMobilePreview(true)}
                        className="xl:hidden flex items-center gap-2 bg-white/10 px-3 py-2 rounded-lg text-sm font-semibold hover:bg-white/20 transition-colors"
                    >
                        <FileText size={16} />
                        <span>Preview</span>
                    </button>

                    {/* Desktop Preview Button */}
                    <button
                        onClick={() => setShowPreview(true)}
                        className="hidden xl:flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 text-white rounded-lg hover:bg-white/10 hover:border-neon-purple/50 transition-all font-semibold text-sm"
                    >
                        <Eye size={16} />
                        <span>Preview</span>
                    </button>

                    <button
                        onClick={handleDownloadPDF}
                        disabled={isDownloading}
                        className="flex items-center gap-2 bg-gradient-to-r from-neon-blue to-neon-purple px-4 py-2 rounded-lg font-semibold text-sm hover:shadow-[0_0_15px_#a855f766] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isDownloading ? (
                            <>Downloading...</>
                        ) : (
                            <>
                                <Download size={16} />
                                <span className="hidden sm:inline">Download PDF</span>
                            </>
                        )}
                    </button>
                </div>
            </header>

            {/* Breadcrumbs removed as per user request */}

            {/* Exit Confirmation Modal */}
            {showExitModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                    <div className="bg-[#1a1a20] border border-white/10 rounded-2xl p-6 max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="flex items-center gap-3 text-amber-500 mb-4">
                            <AlertTriangle size={24} />
                            <h3 className="text-xl font-bold text-white">Exit Builder?</h3>
                        </div>
                        <p className="text-gray-400 mb-6 leading-relaxed">
                            Are you sure you want to leave? Any unsaved progress will be lost (currently auto-saved locally).
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setShowExitModal(false)}
                                className="px-4 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                            >
                                Cancel
                            </button>
                            <Link
                                to="/"
                                className="px-4 py-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 font-medium transition-colors"
                            >
                                Leave Builder
                            </Link>
                        </div>
                    </div>
                </div>
            )}

            {/* Mobile Preview Modal */}
            {showMobilePreview && (
                <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col xl:hidden">
                    <div className="flex items-center justify-between p-4 border-b border-white/10">
                        <h3 className="font-bold text-lg text-white">Live Preview</h3>
                        <button
                            onClick={() => setShowMobilePreview(false)}
                            className="p-2 bg-white/10 rounded-lg text-gray-400 hover:text-white"
                        >
                            <X size={20} />
                        </button>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 flex justify-center bg-[#050508]">
                        <div className="origin-top scale-[0.5] sm:scale-[0.6] md:scale-[0.7]">
                            <ResumePreview />
                        </div>
                    </div>
                </div>
            )}

            <div className="flex flex-1 overflow-hidden h-[calc(100vh-64px)]">

                {/* Welcome Modal */}
                <WelcomeModal isOpen={showWelcome} onClose={() => setShowWelcome(false)} />

                {/* Preview Modal */}
                <PreviewModal isOpen={showPreview} onClose={() => setShowPreview(false)} />

                {/* Left Sidebar: Navigation + Progress */}
                <aside className="w-16 lg:w-64 border-r border-white/5 bg-[#0e0e14] flex flex-col shrink-0 z-20 transition-all duration-300">
                    {/* Navigation Tabs */}
                    <nav className="flex-1 px-2 lg:px-3 py-4 space-y-1 overflow-y-auto custom-scrollbar">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            const isActive = activeTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => handleTabChange(tab.id)}
                                    className={`w-full flex items-center gap-3 px-3 py-3 lg:px-3.5 lg:py-3 rounded-xl transition-all duration-200 group justify-center lg:justify-start ${isActive
                                        ? "bg-gradient-to-r from-neon-purple/15 to-neon-blue/15 text-white border border-neon-purple/30 shadow-lg shadow-neon-purple/10"
                                        : "text-gray-400 hover:text-white hover:bg-white/5"
                                        }`}
                                >
                                    <Icon size={18} className={`shrink-0 ${isActive ? "text-neon-purple" : "text-gray-500 group-hover:text-white"}`} />
                                    <span className="hidden lg:block font-semibold text-xs">{tab.label}</span>
                                    {isActive && <ChevronRight size={14} className="ml-auto hidden lg:block opacity-60" />}
                                </button>
                            )
                        })}
                    </nav>

                    {/* Progress Tracker (Desktop Only) */}
                    <div className="hidden lg:block px-3 pb-4">
                        <ProgressTracker />
                    </div>
                </aside>

                {/* Middle: Form Editor */}
                <div className="flex-1 flex flex-col min-w-0 bg-[#0a0a0f] relative z-10 w-full">
                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                        <div className="max-w-4xl mx-auto w-full px-6 lg:px-12 py-8 pb-20">
                            {/* Section Header */}
                            <div className="mb-6">
                                <h2 className="text-2xl lg:text-3xl font-bold text-white mb-2 flex items-center gap-3">
                                    {(() => {
                                        const currentTab = tabs.find(t => t.id === activeTab);
                                        const Icon = currentTab?.icon;
                                        return (
                                            <>
                                                {Icon && <Icon size={28} className="text-neon-purple" />}
                                                {currentTab?.label}
                                            </>
                                        );
                                    })()}
                                </h2>
                                <p className="text-gray-400 text-sm">
                                    Fill in your details below. The preview updates in real-time.
                                </p>
                            </div>

                            {/* Content Card */}
                            <div className="bg-gradient-to-br from-[#111118] to-[#0e0e14] border border-white/10 rounded-2xl p-6 lg:p-8 shadow-2xl shadow-black/50 backdrop-blur-sm">
                                {renderSection()}
                            </div>
                        </div>
                    </div>

                    {/* Journey Navigation */}
                    <div className="border-t border-white/10">
                        <div className="max-w-4xl mx-auto px-6 lg:px-12">
                            <JourneyNavigation />
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default Builder;
