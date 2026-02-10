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
import ResumePreview from "~/components/builder/ResumePreview";
import { User, Briefcase, GraduationCap, Code, FileText, ChevronRight, ArrowLeft, Download, AlertTriangle, X } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export function meta({ }: MetaArgs) {
    return [
        { title: "Resumind AI | Builder" },
        { name: "description", content: "Build your professional resume with AI" },
    ];
}

const Builder = () => {
    const [activeTab, setActiveTab] = useState("personal");
    const [showExitModal, setShowExitModal] = useState(false);
    const [showMobilePreview, setShowMobilePreview] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);
    const navigate = useNavigate();
    const { resume } = useBuilderStore();
    const previewRef = useRef<HTMLDivElement>(null);

    const tabs = [
        { id: "personal", label: "Personal Info", icon: User },
        { id: "summary", label: "Summary", icon: FileText },
        { id: "experience", label: "Experience", icon: Briefcase },
        { id: "education", label: "Education", icon: GraduationCap },
        { id: "skills", label: "Skills", icon: Code },
    ];

    const renderSection = () => {
        switch (activeTab) {
            case "personal": return <PersonalDetails />;
            case "experience": return <ExperienceSection />;
            case "education": return <EducationSection />;
            case "skills": return <SkillsSection />;
            case "summary": return <SummarySection />;
            default: return <PersonalDetails />;
        }
    };

    const handleDownloadPDF = async () => {
        if (!previewRef.current) return;
        setIsDownloading(true);

        try {
            // Temporarily scale up for better resolution
            const originalTransform = previewRef.current.style.transform;
            previewRef.current.style.transform = "scale(1)";

            const canvas = await html2canvas(previewRef.current, {
                scale: 2, // High resolution
                useCORS: true,
                logging: false,
                backgroundColor: "#ffffff"
            });

            // Restore scaling (handled by parent usually, but just in case)
            previewRef.current.style.transform = originalTransform;

            const imgData = canvas.toDataURL("image/jpeg", 1.0);
            const pdf = new jsPDF("p", "mm", "a4");
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();

            pdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, pdfHeight);

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

                {/* Left Sidebar: Navigation */}
                <aside className="w-16 lg:w-64 border-r border-white/5 bg-[#0e0e14] flex flex-col shrink-0 z-20 transition-all duration-300">
                    <nav className="flex-1 px-2 lg:px-3 py-4 space-y-1">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            const isActive = activeTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`w-full flex items-center gap-3 px-3 py-3 lg:px-4 lg:py-3.5 rounded-xl transition-all duration-300 group justify-center lg:justify-start ${isActive
                                        ? "bg-neon-purple/10 text-neon-purple shadow-[inset_0_0_0_1px_#a855f733]"
                                        : "text-gray-400 hover:text-white hover:bg-white/5"
                                        }`}
                                >
                                    <Icon size={20} className={`shrink-0 ${isActive ? "text-neon-purple" : "text-gray-500 group-hover:text-white"}`} />
                                    <span className="hidden lg:block font-medium text-sm">{tab.label}</span>
                                    {isActive && <ChevronRight size={16} className="ml-auto hidden lg:block opacity-50" />}
                                </button>
                            )
                        })}
                    </nav>
                </aside>

                {/* Middle: Form Editor */}
                <div className="flex-1 flex flex-col min-w-0 bg-[#0a0a0f] relative z-10 w-full">
                    <div className="h-full overflow-y-auto custom-scrollbar">
                        <div className="max-w-3xl mx-auto w-full p-4 lg:p-10 pb-20">
                            <div className="mb-8">
                                <h2 className="text-2xl lg:text-3xl font-bold text-white mb-2">
                                    {tabs.find(t => t.id === activeTab)?.label}
                                </h2>
                                <p className="text-gray-400 text-sm">
                                    Fill in your details below. The preview updates automatically.
                                </p>
                            </div>

                            <div className="bg-[#111118] border border-white/5 rounded-2xl p-4 lg:p-8 shadow-2xl shadow-black/50">
                                {renderSection()}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right: Live Preview */}
                <div className="hidden xl:flex w-[45%] bg-[#050508] relative border-l border-white/5 overflow-y-auto custom-scrollbar bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-900 to-black">
                    {/* Preview Container - Top aligned centering */}
                    <div className="w-full min-h-full flex justify-center py-10">
                        <div className="relative origin-top scale-[0.65] 2xl:scale-[0.80]" ref={previewRef}>
                            <ResumePreview />
                        </div>
                    </div>
                </div>

            </div>
        </main>
    );
};

export default Builder;
