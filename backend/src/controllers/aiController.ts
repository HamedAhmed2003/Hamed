import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth';
import { sendSuccess, sendError } from '../utils/responseWrapper';
import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';
const pdfParse = require('pdf-parse');

export const extractSkills = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.file) return sendError(res, 400, 'No CV file uploaded');

    const fileBuffer = fs.readFileSync(req.file.path);
    let extractedText = '';

    // If it's a PDF, parse it. Otherwise treat as plain text for simplicity.
    if (req.file.mimetype === 'application/pdf' || req.file.originalname.toLowerCase().endsWith('.pdf')) {
      const pdfData = await pdfParse(fileBuffer);
      extractedText = pdfData.text;
    } else {
      extractedText = fileBuffer.toString('utf-8');
    }

    if (!process.env.GEMINI_API_KEY) {
      return sendError(res, 500, 'Gemini API key is not configured');
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" }); // Use appropriate Gemini model

    const prompt = `
    Analyze the following CV/Resume text and extract the technical skills, soft skills, and tools into a clean JSON array of strings. 
    Ensure you return ONLY a raw JSON array of strings, without any markdown formatting, no backticks, no \`\`\`json, just the array itself.
    Do not include duplicates. Provide at most 20 key skills.
    
    CV Text:
    ${extractedText.substring(0, 5000)}
    `;

    const result = await model.generateContent(prompt);
    let rawResponse = result.response.text().trim();

    // Clean up potential markdown blocks if Gemini stubbornly includes them
    rawResponse = rawResponse.replace(/```json/gi, '').replace(/```/g, '').trim();

    let extractedSkills: string[] = [];
    try {
      extractedSkills = JSON.parse(rawResponse);
      if (!Array.isArray(extractedSkills)) {
        extractedSkills = []; // Fallback
      }
    } catch (e) {
      console.error("Failed to parse Gemini output", rawResponse);
      return sendError(res, 500, 'Failed to parse AI extraction results');
    }

    // Return CV url
    const cvUrl = `/uploads/${req.file.filename}`;

    return sendSuccess(res, 200, { extractedSkills, cvUrl }, 'Skills extracted successfully');
  } catch (error: any) {
    console.error("AI Extraction Error:", error);
    return sendError(res, 500, error.message);
  }
};
