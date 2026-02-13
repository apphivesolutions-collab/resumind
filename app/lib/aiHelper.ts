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

    // Generate 2-3 professional summary variations
    const generateSummaryOptions = async (
        jobTitle: string,
        experienceLevel: string,
        skills: string[],
        jobDescription?: string
    ) => {
        const prompt = jobDescription
            ? `Generate 3 distinct professional summary variations for a resume. Each should be 3-4 lines maximum.

Job Title: ${jobTitle}
Experience Level: ${experienceLevel}
Key Skills: ${skills.join(", ")}
Target Job Description: ${jobDescription}

Requirements:
- Tailor each summary to the job description
- Integrate relevant keywords naturally
- Focus on impact and achievements
- Vary the tone and emphasis across the 3 options
- Be concise and powerful

Return ONLY the 3 summaries separated by "---" with no additional text.`
            : `Generate 3 distinct professional summary variations for a resume. Each should be 3-4 lines maximum.

Job Title: ${jobTitle}
Experience Level: ${experienceLevel}
Key Skills: ${skills.join(", ")}

Requirements:
- Be role-targeted and impact-driven
- Include measurable impact tone
- Highlight core expertise
- Vary the tone and emphasis across the 3 options
- Be concise and powerful

Return ONLY the 3 summaries separated by "---" with no additional text.`;

        const content = await generateContent(PROMPTS.MULTI_SUMMARY_GENERATION, prompt);
        if (!content) return [];

        return content.split("---").map((s: string) => s.trim()).filter((s: string) => s.length > 0);
    };

    // Analyze job description and extract keywords
    const analyzeJobDescription = async (jobDescription: string) => {
        const prompt = `Analyze this job description and extract key information:

${jobDescription}

Return a JSON object with:
{
  "keywords": ["keyword1", "keyword2", ...],
  "requiredSkills": ["skill1", "skill2", ...],
  "preferredSkills": ["skill1", "skill2", ...],
  "coreCompetencies": ["competency1", "competency2", ...]
}

Return ONLY the JSON, no additional text.`;

        const content = await generateContent(PROMPTS.JOB_DESCRIPTION_ANALYSIS, prompt);
        if (!content) return null;

        try {
            // Try to extract JSON from response
            const jsonMatch = content.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                return JSON.parse(jsonMatch[0]);
            }
            return JSON.parse(content);
        } catch (e) {
            console.error("Failed to parse JD analysis:", e);
            return null;
        }
    };

    // Enhance bullet points with action verbs and impact
    const enhanceBulletPoints = async (
        bullets: string[],
        role: string,
        company: string,
        experienceLevel: string = "mid"
    ) => {
        const prompt = `Enhance these work experience bullet points:

Role: ${role}
Company: ${company}
Experience Level: ${experienceLevel}
Current Bullets:
${bullets.map((b, i) => `${i + 1}. ${b}`).join("\n")}

Requirements:
- Start each bullet with strong action verbs (Built, Scaled, Implemented, Spearheaded, etc.)
- Focus on impact and achievements, not responsibilities
- Add quantifiable metrics where logical (but don't fabricate)
- Keep each bullet 1-2 lines maximum
- Avoid weak phrases like "responsible for", "helped with", "assisted in"
- Match tone to experience level
- Return 3-6 enhanced bullets

Return ONLY the enhanced bullets as a numbered list, no additional text.`;

        const content = await generateContent(PROMPTS.BULLET_ENHANCEMENT, prompt);
        if (!content) return bullets;

        // Extract bullet points from response
        const enhanced = content
            .split("\n")
            .filter((line: string) => /^\d+\./.test(line.trim()))
            .map((line: string) => line.replace(/^\d+\.\s*/, "").trim())
            .filter((line: string) => line.length > 0);

        return enhanced.length > 0 ? enhanced : bullets;
    };

    // Categorize skills into groups
    const categorizeSkills = async (skills: string[], jobTitle: string) => {
        const prompt = `Categorize these skills for a ${jobTitle} role:

Skills: ${skills.join(", ")}

Return a JSON object with:
{
  "technical": ["skill1", ...],
  "tools": ["tool1", ...],
  "frameworks": ["framework1", ...],
  "soft": ["skill1", ...],
  "languages": ["lang1", ...]
}

Categories:
- technical: Core technical skills (programming languages, concepts)
- tools: Software tools and platforms
- frameworks: Frameworks and libraries
- soft: Soft/interpersonal skills
- languages: Human languages

Return ONLY the JSON, no additional text.`;

        const content = await generateContent(PROMPTS.SKILL_CATEGORIZATION, prompt);
        if (!content) return null;

        try {
            const jsonMatch = content.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                return JSON.parse(jsonMatch[0]);
            }
            return JSON.parse(content);
        } catch (e) {
            console.error("Failed to parse skill categorization:", e);
            return null;
        }
    };

    // Suggest additional skills based on role and job description
    const suggestSkills = async (
        jobTitle: string,
        currentSkills: string[],
        jobDescription?: string
    ) => {
        const prompt = jobDescription
            ? `Suggest additional relevant skills for this role:

Job Title: ${jobTitle}
Current Skills: ${currentSkills.join(", ")}
Target Job Description: ${jobDescription}

Requirements:
- Suggest 5-10 skills that are missing but relevant
- Focus on skills mentioned or implied in the job description
- Ensure all suggestions are industry-standard and ATS-friendly
- Don't suggest skills already in the current list
- Include a mix of technical and soft skills if appropriate

Return ONLY a comma-separated list of skills, no additional text.`
            : `Suggest additional relevant skills for a ${jobTitle}:

Current Skills: ${currentSkills.join(", ")}

Requirements:
- Suggest 5-10 industry-standard skills commonly required for this role
- Ensure all suggestions are ATS-friendly
- Don't suggest skills already in the current list
- Focus on high-value, in-demand skills

Return ONLY a comma-separated list of skills, no additional text.`;

        const content = await generateContent(PROMPTS.SKILLS_SUGGESTION, prompt);
        if (!content) return [];

        return content
            .split(",")
            .map((s: string) => s.trim())
            .filter((s: string) => s.length > 0 && !currentSkills.includes(s));
    };

    // Enhance project description
    const enhanceProjectDescription = async (
        title: string,
        description: string,
        technologies: string[]
    ) => {
        const prompt = `Enhance this project description:

Title: ${title}
Technologies: ${technologies.join(", ")}
Current Description: ${description}

Requirements:
- Highlight the technologies used
- Clarify business or user impact
- Focus on what problem was solved
- Keep it concise (2-4 bullet points or 3-4 sentences)
- Use action verbs and measurable outcomes where possible

Return ONLY the enhanced description, no additional text.`;

        const content = await generateContent(PROMPTS.PROJECT_ENHANCEMENT, prompt);
        return content || description;
    };

    // Analyze content quality and suggest improvements
    const analyzeContentQuality = async (
        sectionName: string,
        content: string
    ) => {
        const prompt = `Analyze the quality of this resume ${sectionName} section:

${content}

Provide:
1. A quality score (1-10)
2. 2-3 specific improvement suggestions
3. Identify any weak phrases or missed opportunities

Return as JSON:
{
  "score": 7,
  "suggestions": ["suggestion1", "suggestion2", ...],
  "weakPhrases": ["phrase1", ...]
}

Return ONLY the JSON, no additional text.`;

        const response = await generateContent(PROMPTS.CONTENT_QUALITY_ANALYSIS, prompt);
        if (!response) return null;

        try {
            const jsonMatch = response.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                return JSON.parse(jsonMatch[0]);
            }
            return JSON.parse(response);
        } catch (e) {
            console.error("Failed to parse quality analysis:", e);
            return null;
        }
    };

    return {
        generateContent,
        generateSummaryOptions,
        analyzeJobDescription,
        enhanceBulletPoints,
        categorizeSkills,
        suggestSkills,
        enhanceProjectDescription,
        analyzeContentQuality
    };
};

export const PROMPTS = {
    // Legacy prompts (kept for backward compatibility)
    EXPERIENCE_DESCRIPTION: "You are a professional resume writer. Write a concise, impactful bullet-point description (3-4 points) for a specific job role. Focus on achievements and action verbs. Do not include introductory text.",
    SUMMARY_GENERATION: "You are a professional resume writer. Write a compelling professional summary (3-4 sentences) for a resume based on the provided user details. Focus on their key skills and experience level. Do not include introductory text.",
    SKILLS_SUGGESTION: "You are a career coach and ATS optimization expert.",
    EDUCATION_ACTIVITIES: "You are a professional resume writer. Write a concise description of activities and societies for a student at a specific university/school. Focus on leadership and relevant extracurriculars. Do not include introductory text.",

    // New advanced prompts
    MULTI_SUMMARY_GENERATION: "You are an executive resume writer who has written resumes for Fortune 500 professionals. Your summaries are concise, powerful, and results-driven. You never use generic phrases or buzzwords. Every word must earn its place.",

    JOB_DESCRIPTION_ANALYSIS: "You are an ATS optimization expert and recruiter. You understand what hiring managers look for and how ATS systems parse resumes. Extract only the most critical keywords and requirements.",

    BULLET_ENHANCEMENT: "You are a professional resume writer specializing in achievement-focused bullets. You transform weak, responsibility-based descriptions into powerful, impact-driven statements. You use strong action verbs and focus on measurable outcomes.",

    SKILL_CATEGORIZATION: "You are a technical recruiter who understands skill taxonomies. Accurately categorize skills into technical, tools, frameworks, soft skills, and languages based on industry standards.",

    PROJECT_ENHANCEMENT: "You are a technical resume writer who excels at showcasing projects. You highlight technical stack, business impact, and problem-solving clearly and concisely.",

    CONTENT_QUALITY_ANALYSIS: "You are a resume consultant who provides actionable feedback. You identify weak phrases, missed opportunities, and specific improvements that make resumes more competitive."
};
