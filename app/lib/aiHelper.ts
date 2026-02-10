import { usePuterStore } from "~/lib/puter";

export const useAIHelper = () => {
    const { ai } = usePuterStore();

    const generateContent = async (systemPrompt: string, userPrompt: string) => {
        try {
            let response;
            try {
                response = await ai.chat(
                    [
                        { role: "system", content: systemPrompt },
                        { role: "user", content: userPrompt }
                    ],
                    undefined,
                    false,
                    { model: "claude-3-5-sonnet" }
                );
            } catch (e) {
                console.warn("Claude 3.5 Sonnet failed, retrying with simple model...", e);
                response = await ai.chat(
                    [
                        { role: "system", content: systemPrompt },
                        { role: "user", content: userPrompt }
                    ],
                    undefined,
                    false,
                    { model: "gpt-4o-mini" }
                );
            }

            console.log("AI Response:", JSON.stringify(response, null, 2));

            // @ts-ignore
            const content = response?.message?.content;
            if (typeof content === 'string' && content.trim().length > 0) return content;
            if (Array.isArray(content) && content.length > 0 && content[0]?.text) return content[0].text;

            return null;
        } catch (error) {
            console.error("AI Generation Error:", error);
            return null;
        }
    };

    return { generateContent };
};

export const PROMPTS = {
    EXPERIENCE_DESCRIPTION: "You are a professional resume writer. Write a concise, impactful bullet-point description (3-4 points) for a specific job role. Focus on achievements and action verbs. Do not include introductory text.",
    SUMMARY_GENERATION: "You are a professional resume writer. Write a compelling professional summary (3-4 sentences) for a resume based on the provided user details. Focus on their key skills and experience level. Do not include introductory text.",
    SKILLS_SUGGESTION: "You are a career coach. Suggest a comma-separated list of 10 relevant technical and soft skills for the specified job role. Do not include descriptions or introductory text.",
    EDUCATION_ACTIVITIES: "You are a professional resume writer. Write a concise description of activities and societies for a student at a specific university/school. Focus on leadership and relevant extracurriculars. Do not include introductory text."
};
