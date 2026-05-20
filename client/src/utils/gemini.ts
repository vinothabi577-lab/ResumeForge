const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";

export async function extractProfileWithGemini(text: string): Promise<{
  personalInfo: any;
  experiences: any[];
  education: any[];
  skills: any[];
  projects: any[];
  certifications: any[];
} | null> {
  // Try to use VITE_OPENROUTER_API_KEY first, fallback to VITE_GEMINI_API_KEY if they just replaced the value
  const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY || import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("API key not configured. Please add VITE_OPENROUTER_API_KEY to your .env file.");
  }

  const prompt = `You are a professional resume parser. Extract structured information from the following text and return ONLY a valid JSON object with this exact structure:
{
  "personalInfo": {
    "fullName": "string",
    "title": "string",
    "email": "string",
    "phone": "string",
    "location": "string",
    "website": "string",
    "github": "string",
    "linkedin": "string",
    "summary": "string"
  },
  "experiences": [
    {
      "company": "string",
      "position": "string",
      "location": "string",
      "startDate": "string",
      "endDate": "string",
      "current": false,
      "highlights": ["string"],
      "description": "string"
    }
  ],
  "education": [
    {
      "institution": "string",
      "degree": "string",
      "fieldOfStudy": "string",
      "startDate": "string",
      "endDate": "string",
      "current": false,
      "gpa": "string",
      "details": "string"
    }
  ],
  "skills": [
    {
      "name": "string",
      "level": "Advanced",
      "category": "string"
    }
  ],
  "projects": [
    {
      "name": "string",
      "description": "string",
      "url": "string",
      "github": "string",
      "highlights": ["string"],
      "technologies": ["string"]
    }
  ],
  "certifications": [
    {
      "name": "string",
      "issuer": "string",
      "date": "string",
      "url": "string"
    }
  ]
}

Rules:
- Extract ALL information found in the text
- For dates, use format like "Jan 2020" or "2020"
- For current positions, set "current" to true and "endDate" to "Present"
- If a field is not found, use empty string ""
- For arrays (experiences, skills, etc.), return empty array [] if nothing found
- Return ONLY the JSON object, no markdown, no explanation
- skills should have level like "Beginner", "Intermediate", "Advanced", or "Expert"
- skills should have category like "Languages", "Frontend", "Backend", "Tools", etc.

TEXT TO PARSE:
${text}`;

  const response = await fetch(OPENROUTER_API_URL, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "HTTP-Referer": window.location.origin, // Required by OpenRouter for ranking
      "X-Title": "ResumeForge", // Required by OpenRouter for ranking
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "nvidia/nemotron-3-super-120b-a12b:free", // Using a highly capable free model
      max_tokens: 4096,
      messages: [
        { role: "user", content: prompt }
      ]
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || "Failed to call OpenRouter API");
  }

  const data = await response.json();
  console.log("OpenRouter API Response:", data);
  const responseText = data.choices?.[0]?.message?.content;

  if (!responseText) {
    throw new Error(`No response from AI. Response data: ${JSON.stringify(data)}`);
  }

  const jsonMatch = responseText.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("Failed to parse AI response as JSON");
  }

  try {
    const parsed = JSON.parse(jsonMatch[0]);
    return parsed;
  } catch {
    throw new Error("Failed to parse AI response as valid JSON");
  }
}