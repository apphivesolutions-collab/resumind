import { useBuilderStore } from "~/lib/builderStore";
import { getTemplateById } from "~/lib/templates/templateDefinitions";
import { Mail, Phone, MapPin, Linkedin, Globe } from "lucide-react";

const ResumePreview = () => {
    const { resume, selectedTemplate } = useBuilderStore();
    const template = getTemplateById(selectedTemplate);
    const { personalInfo, summary, experience, education, skills, projects = [], certifications = [] } = resume;

    // Get template colors and styling
    const colors = template?.colors || {
        primary: '#2563eb',
        secondary: '#64748b',
        accent: '#3b82f6',
        text: '#1e293b',
        textSecondary: '#64748b',
        background: '#ffffff',
        border: '#e2e8f0',
    };

    const fonts = template?.fonts || { heading: 'Inter', body: 'Inter' };

    return (
        <div
            className="bg-white text-black w-[210mm] min-h-[297mm] h-fit shadow-2xl p-[20mm] origin-top transition-all duration-300 font-sans selection:bg-gray-200"
            style={{
                fontFamily: fonts.body,
                color: colors.text,
            }}
        >
            {/* Header */}
            <header className="border-b-2 pb-6 mb-6" style={{ borderColor: colors.primary }}>
                <h1
                    className="text-4xl font-bold uppercase tracking-tight mb-1"
                    style={{
                        fontFamily: fonts.heading,
                        color: colors.primary,
                    }}
                >
                    {personalInfo.fullName || "Your Name"}
                </h1>
                {personalInfo.professionalTitle && (
                    <p
                        className="text-lg font-semibold mb-3"
                        style={{ color: colors.secondary }}
                    >
                        {personalInfo.professionalTitle}
                    </p>
                )}
                <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium" style={{ color: colors.textSecondary }}>
                    {personalInfo.email && (
                        <div className="flex items-center gap-1.5">
                            <Mail size={14} style={{ color: colors.accent }} />
                            <span>{personalInfo.email}</span>
                        </div>
                    )}
                    {personalInfo.phone && (
                        <div className="flex items-center gap-1.5">
                            <Phone size={14} style={{ color: colors.accent }} />
                            <span>{personalInfo.phone}</span>
                        </div>
                    )}
                    {personalInfo.location && (
                        <div className="flex items-center gap-1.5">
                            <MapPin size={14} style={{ color: colors.accent }} />
                            <span>{personalInfo.location}</span>
                        </div>
                    )}
                    {personalInfo.linkedin && (
                        <div className="flex items-center gap-1.5">
                            <Linkedin size={14} style={{ color: colors.accent }} />
                            <span>{personalInfo.linkedin.replace(/^https?:\/\//, '')}</span>
                        </div>
                    )}
                    {personalInfo.website && (
                        <div className="flex items-center gap-1.5">
                            <Globe size={14} style={{ color: colors.accent }} />
                            <span>{personalInfo.website.replace(/^https?:\/\//, '')}</span>
                        </div>
                    )}
                </div>
            </header>

            <div className="space-y-6">
                {/* Summary */}
                {summary && (
                    <section>
                        <h2
                            className="text-sm font-bold uppercase tracking-wider border-b pb-1 mb-3"
                            style={{
                                color: colors.primary,
                                borderColor: colors.border,
                                fontFamily: fonts.heading,
                            }}
                        >
                            Professional Summary
                        </h2>
                        <p className="text-sm leading-relaxed text-justify" style={{ color: colors.text }}>
                            {summary}
                        </p>
                    </section>
                )}

                {/* Experience */}
                {experience.length > 0 && (
                    <section>
                        <h2
                            className="text-sm font-bold uppercase tracking-wider border-b pb-1 mb-3"
                            style={{
                                color: colors.primary,
                                borderColor: colors.border,
                                fontFamily: fonts.heading,
                            }}
                        >
                            Experience
                        </h2>
                        <div className="space-y-5">
                            {experience.map((exp) => (
                                <div key={exp.id}>
                                    <div className="flex justify-between items-baseline mb-1">
                                        <h3 className="font-bold text-gray-900 text-base">
                                            {exp.role}
                                        </h3>
                                        <span className="text-sm text-gray-600 font-medium whitespace-nowrap">
                                            {exp.startDate} – {exp.endDate || "Present"}
                                        </span>
                                    </div>
                                    <div className="text-sm font-semibold text-gray-700 mb-2">
                                        {exp.company}
                                    </div>
                                    <p className="text-sm leading-relaxed text-gray-700 whitespace-pre-line pl-1">
                                        {exp.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Education */}
                {education.length > 0 && (
                    <section>
                        <h2
                            className="text-sm font-bold uppercase tracking-wider border-b pb-1 mb-3"
                            style={{
                                color: colors.primary,
                                borderColor: colors.border,
                                fontFamily: fonts.heading,
                            }}
                        >
                            Education
                        </h2>
                        <div className="space-y-4">
                            {education.map((edu) => (
                                <div key={edu.id}>
                                    <div className="flex justify-between items-baseline mb-1">
                                        <h3 className="font-bold text-gray-900 text-base">
                                            {edu.school}
                                        </h3>
                                        <span className="text-sm text-gray-600 font-medium whitespace-nowrap">
                                            {edu.startDate} – {edu.endDate || "Present"}
                                        </span>
                                    </div>
                                    <div className="text-sm text-gray-700">
                                        {edu.degree}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Skills */}
                {skills.length > 0 && (
                    <section>
                        <h2
                            className="text-sm font-bold uppercase tracking-wider border-b pb-1 mb-3"
                            style={{
                                color: colors.primary,
                                borderColor: colors.border,
                                fontFamily: fonts.heading,
                            }}
                        >
                            Skills
                        </h2>
                        <div className="flex flex-wrap gap-2">
                            {skills.map(skill => (
                                <span key={skill.id} className="bg-gray-100 text-gray-800 px-3 py-1 rounded text-xs font-semibold tracking-wide border border-gray-200">
                                    {skill.name}
                                </span>
                            ))}
                        </div>
                    </section>
                )}

                {/* Projects */}
                {projects.length > 0 && (
                    <section>
                        <h2
                            className="text-sm font-bold uppercase tracking-wider border-b pb-1 mb-3"
                            style={{
                                color: colors.primary,
                                borderColor: colors.border,
                                fontFamily: fonts.heading,
                            }}
                        >
                            Projects
                        </h2>
                        <div className="space-y-4">
                            {projects.map((project) => (
                                <div key={project.id}>
                                    <div className="flex justify-between items-baseline mb-1">
                                        <h3 className="font-bold text-gray-900 text-base">
                                            {project.title}
                                        </h3>
                                    </div>
                                    {project.technologies.length > 0 && (
                                        <div className="text-sm font-semibold text-gray-600 mb-2">
                                            {project.technologies.join(" • ")}
                                        </div>
                                    )}
                                    {project.description && (
                                        <p className="text-sm leading-relaxed text-gray-700 whitespace-pre-line pl-1">
                                            {project.description}
                                        </p>
                                    )}
                                    {project.link && (
                                        <div className="text-xs text-gray-600 mt-1 pl-1">
                                            {project.link}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Certifications */}
                {certifications.length > 0 && (
                    <section>
                        <h2
                            className="text-sm font-bold uppercase tracking-wider border-b pb-1 mb-3"
                            style={{
                                color: colors.primary,
                                borderColor: colors.border,
                                fontFamily: fonts.heading,
                            }}
                        >
                            Certifications
                        </h2>
                        <div className="space-y-3">
                            {certifications.map((cert) => (
                                <div key={cert.id}>
                                    <div className="flex justify-between items-baseline">
                                        <h3 className="font-bold text-gray-900 text-sm">
                                            {cert.name}
                                        </h3>
                                        <span className="text-sm text-gray-600 font-medium whitespace-nowrap">
                                            {cert.date}
                                        </span>
                                    </div>
                                    <div className="text-sm text-gray-700">
                                        {cert.issuer}
                                    </div>
                                    {cert.credentialId && (
                                        <div className="text-xs text-gray-600 mt-0.5">
                                            {cert.credentialId}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
};

export default ResumePreview;
