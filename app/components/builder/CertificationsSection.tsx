import { useBuilderStore } from "~/lib/builderStore";
import { Plus, X } from "lucide-react";
import { toast } from "sonner";

const CertificationsSection = () => {
    const { resume, addCertification, updateCertification, removeCertification } = useBuilderStore();

    const handleAddCertification = () => {
        addCertification();
        toast.success("Certification added");
    };

    const handleRemoveCertification = (id: string) => {
        removeCertification(id);
        toast.success("Certification removed");
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {resume.certifications.map((cert) => (
                <div
                    key={cert.id}
                    className="p-6 bg-white/[0.03] border border-white/10 rounded-xl space-y-4 hover:bg-white/[0.05] transition-all"
                >
                    <div className="flex justify-between items-start gap-4">
                        <h3 className="text-white font-semibold">Certification Details</h3>
                        <button
                            onClick={() => handleRemoveCertification(cert.id)}
                            className="text-red-400 hover:text-red-300 transition-colors"
                        >
                            <X size={18} />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label>Certification Name</label>
                            <input
                                type="text"
                                value={cert.name}
                                onChange={(e) => updateCertification(cert.id, 'name', e.target.value)}
                                placeholder="AWS Certified Solutions Architect"
                            />
                        </div>

                        <div className="space-y-2">
                            <label>Issuing Organization</label>
                            <input
                                type="text"
                                value={cert.issuer}
                                onChange={(e) => updateCertification(cert.id, 'issuer', e.target.value)}
                                placeholder="Amazon Web Services"
                            />
                        </div>

                        <div className="space-y-2">
                            <label>Date Obtained</label>
                            <input
                                type="text"
                                value={cert.date}
                                onChange={(e) => updateCertification(cert.id, 'date', e.target.value)}
                                placeholder="January 2024"
                            />
                        </div>

                        <div className="space-y-2">
                            <label>Credential ID / URL (Optional)</label>
                            <input
                                type="text"
                                value={cert.credentialId || ''}
                                onChange={(e) => updateCertification(cert.id, 'credentialId', e.target.value)}
                                placeholder="https://www.credly.com/badges/..."
                            />
                        </div>
                    </div>
                </div>
            ))}

            <button
                onClick={handleAddCertification}
                className="w-full flex items-center justify-center gap-2 py-4 border-2 border-dashed border-white/20 rounded-xl text-gray-400 hover:border-neon-purple hover:text-neon-purple transition-all"
            >
                <Plus size={18} />
                <span>Add Certification</span>
            </button>
        </div>
    );
};

export default CertificationsSection;
