
import { GoogleGenAI, GenerateContentResponse, Part } from "@google/genai";
import { Project, ProjectCategory }
from "../types";

// Ensure API_KEY is available in the environment. The application assumes this is pre-configured.
const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("API_KEY for Gemini is not set. Gemini-related features will be disabled or may fail.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! }); // Use non-null assertion as we've warned.

const TEXT_MODEL = 'gemini-2.5-flash-preview-04-17';

export const generateEnhancedProjectDescription = async (project: Project): Promise<string> => {
  if (!API_KEY) return "Gemini API key not configured. Cannot generate description.";

  const prompt = `
    You are an expert financial analyst and marketing copywriter for Pasha Bank's community investment platform.
    Given the following project details:
    - Name: ${project.name}
    - Tagline: ${project.tagline}
    - Current Description: ${project.description}
    - Category: ${project.category}
    - Funding Goal: AZN ${project.goalAmount.toLocaleString()}
    - Location: ${project.location}
    - Stated Impact: ${project.impactStatement}

    Generate a compelling and detailed overview (2-3 paragraphs, approximately 150-200 words) for potential investors.
    Highlight its potential impact, attractiveness to investors, community benefits, and alignment with Pasha Bank's values of supporting local development.
    Maintain a professional, optimistic, yet realistic tone. Do not include any financial advice, guarantees of return, or specific financial projections beyond the stated goal.
    Focus on the narrative and the 'why' behind the investment.
  `;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: TEXT_MODEL,
      contents: prompt,
      config: {
        temperature: 0.7,
        topP: 0.95,
        topK: 64,
      }
    });
    return response.text;
  } catch (error) {
    console.error("Error generating enhanced project description:", error);
    return "Failed to generate enhanced description. Please try again later.";
  }
};

export const generateImpactAssessmentSummary = async (project: Project): Promise<string> => {
  if (!API_KEY) return "Gemini API key not configured. Cannot generate impact summary.";
  
  const prompt = `
    Based on the following project details for Pasha Bank's community investment platform:
    - Project Name: ${project.name}
    - Category: ${project.category}
    - Stated Goal: ${project.description}
    - Stated Impact: ${project.impactStatement}
    - Funding Goal: AZN ${project.goalAmount.toLocaleString()}

    Generate a concise summary (2-3 bullet points) of the potential positive impacts this project could have if successfully funded.
    Focus on tangible and aspirational outcomes relevant to the project type and stated goals.
    Example areas: job creation, environmental benefits, community service improvement, skill development, cultural preservation, economic stimulation.
    Keep it brief and impactful for an investor overview. Do not make speculative claims or guarantees.
  `;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: TEXT_MODEL,
      contents: prompt,
       config: {
        temperature: 0.6,
      }
    });
    return response.text;
  } catch (error) {
    console.error("Error generating impact assessment summary:", error);
    return "Failed to generate impact summary. Please try again later.";
  }
};
