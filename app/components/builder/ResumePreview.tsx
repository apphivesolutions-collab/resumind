import { useBuilderStore } from "~/lib/builderStore";
import { Mail, Phone, MapPin, Linkedin, Globe } from "lucide-react";

const ResumePreview = () => {
    const { resume } = useBuilderStore();
    const { personalInfo, summary, experience, education, skills } = resume;

    return (
        <div className="bg-white text-black w-[210mm] min-h-[297mm] h-fit shadow-2xl p-[20mm] origin-top scale-[0.65] xl:scale-[0.85] transition-transform duration-300 font-sans selection:bg-gray-200">
            {/* Header */}
            <header className="border-b-2 border-gray-900 pb-6 mb-6">
                <h1 className="text-4xl font-bold uppercase tracking-tight text-gray-900 mb-3">
                    {personalInfo.fullName || "Your Name"}
                </h1>
                <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-600 font-medium">
                    {personalInfo.email && (
                        <div className="flex items-center gap-1.5">
                            <Mail size={14} className="text-gray-900" />
                            <span>{personalInfo.email}</span>
                        </div>
                    )}
                    {personalInfo.phone && (
                        <div className="flex items-center gap-1.5">
                            <Phone size={14} className="text-gray-900" />
                            <span>{personalInfo.phone}</span>
                        </div>
                    )}
                    {personalInfo.location && (
                        <div className="flex items-center gap-1.5">
                            <MapPin size={14} className="text-gray-900" />
                            <span>{personalInfo.location}</span>
                        </div>
                    )}
                    {personalInfo.linkedin && (
                        <div className="flex items-center gap-1.5">
                            <Linkedin size={14} className="text-gray-900" />
                            <span>{personalInfo.linkedin.replace(/^https?:\/\//, '')}</span>
                        </div>
                    )}
                    {personalInfo.website && (
                        <div className="flex items-center gap-1.5">
                            <Globe size={14} className="text-gray-900" />
                            <span>{personalInfo.website.replace(/^https?:\/\//, '')}</span>
                        </div>
                    )}
                </div>
            </header>

            <div className="space-y-6">
                {/* Summary */}
                {summary && (
                    <section>
                        <h2 className="text-sm font-bold uppercase tracking-wider text-gray-900 border-b border-gray-200 pb-1 mb-3">
                            Professional Summary
                        </h2>
                        <p className="text-sm leading-relaxed text-gray-700 text-justify">
                            {summary}
                        </p>
                    </section>
                )}

                {/* Experience */}
                {experience.length > 0 && (
                    <section>
                        <h2 className="text-sm font-bold uppercase tracking-wider text-gray-900 border-b border-gray-200 pb-1 mb-4">
                            Work Experience
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
                        <h2 className="text-sm font-bold uppercase tracking-wider text-gray-900 border-b border-gray-200 pb-1 mb-4">
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
                        <h2 className="text-sm font-bold uppercase tracking-wider text-gray-900 border-b border-gray-200 pb-1 mb-3">
                            Technical Skills
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
            </div>
        </div>
    );
};

export default ResumePreview;
