import { useBuilderStore } from "~/lib/builderStore";

const PersonalDetails = () => {
    const { resume, updatePersonalInfo } = useBuilderStore();
    const { personalInfo } = resume;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        // @ts-ignore
        updatePersonalInfo(name, value);
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label>Full Name</label>
                    <input
                        type="text"
                        name="fullName"
                        value={personalInfo.fullName}
                        onChange={handleChange}
                        placeholder="John Doe"
                    />
                </div>

                <div className="space-y-2">
                    <label>Professional Title</label>
                    <input
                        type="text"
                        name="professionalTitle"
                        value={personalInfo.professionalTitle}
                        onChange={handleChange}
                        placeholder="Senior Software Engineer"
                    />
                    <p className="text-xs text-gray-400">This appears below your name on the resume</p>
                </div>

                <div className="space-y-2">
                    <label>Email</label>
                    <input
                        type="email"
                        name="email"
                        value={personalInfo.email}
                        onChange={handleChange}
                        placeholder="john@example.com"
                    />
                </div>

                <div className="space-y-2">
                    <label>Phone</label>
                    <input
                        type="tel"
                        name="phone"
                        value={personalInfo.phone}
                        onChange={handleChange}
                        placeholder="+1 234 567 890"
                    />
                </div>

                <div className="space-y-2">
                    <label>Location</label>
                    <input
                        type="text"
                        name="location"
                        value={personalInfo.location}
                        onChange={handleChange}
                        placeholder="New York, USA"
                    />
                </div>

                <div className="space-y-2">
                    <label>LinkedIn</label>
                    <input
                        type="text"
                        name="linkedin"
                        value={personalInfo.linkedin}
                        onChange={handleChange}
                        placeholder="linkedin.com/in/johndoe"
                    />
                </div>

                <div className="space-y-2">
                    <label>Portfolio / Website</label>
                    <input
                        type="text"
                        name="website"
                        value={personalInfo.website}
                        onChange={handleChange}
                        placeholder="johndoe.com"
                    />
                </div>
            </div>
        </div>
    );
};

export default PersonalDetails;
