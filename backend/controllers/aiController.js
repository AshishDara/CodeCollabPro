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

        // The await call returns the response object directly, as per your screenshot.
        const response = await genAI.models.generateContent({
            model: "gemini-pro",
            contents: [{ parts: [{ text: prompt }] }],
        });

        // The text is a PROPERTY on the response object, NOT a function.
        // This line now directly matches your screenshot's logic.
        const text = response.text;
        
        // Safety check in case the AI returns non-JSON text
        if (typeof text !== 'string') {
            throw new Error('AI did not return a valid text response.');
        }

        res.status(200).json(JSON.parse(text));

    } catch (error) {
        console.error('AI API Error:', error);
        res.status(500).json({ message: "Can't get explanation from AI" });
    }
};