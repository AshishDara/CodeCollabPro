// File: backend/controllers/aiController.js

import { GoogleGenAI } from "@google/genai";

// The client gets the API key from the environment variable GEMINI_API_KEY
const genAI = new GoogleGenAI(process.env.GEMINI_API_KEY);

export const explainCode = async (req, res) => {
    try {
        const { code } = req.body;
        if (!code) {
            return res.status(400).json({ message: 'Code snippet is required.' });
        }

        const prompt = `
            Analyze the following code snippet. Provide a response in a single, clean JSON object with two keys: "explanation" and "bugs".
            - "explanation": A clear, concise explanation of what the code does.
            - "bugs": A string describing any potential bugs or "No obvious bugs found.".
            Do not include any text, backticks, or formatting outside of the JSON object.

            Code:
            ${code}
        `;

        // The CORRECT, one-step method from the documentation you provided.
        // We call generateContent directly on the 'models' property.
        const result = await genAI.models.generateContent({
            model: "gemini-2.5-flash",
            contents: [{ parts: [{ text: prompt }] }],
        });

        const response = result.response;
        const text = response.text();
        
        res.status(200).json(JSON.parse(text));

    } catch (error) {
        console.error('AI API Error:', error);
        res.status(500).json({ message: "Can't get explanation from AI" });
    }
};