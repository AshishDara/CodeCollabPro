import { GoogleGenAI } from "@google/genai";

const genAI = new GoogleGenAI(process.env.GEMINI_API_KEY);

export const explainCode = async (req, res) => {
    try {
        const { code } = req.body;
        if (!code) {
            return res.status(400).json({ message: 'Code snippet is required.' });
        }

        // Part 1: Stricter prompt to prevent markdown
        const prompt = `
            Analyze the following code snippet.
            Your response MUST be a single, raw JSON object.
            Do NOT include any explanatory text, markdown formatting, or backticks around the JSON.

            The JSON object must have two keys: "explanation" and "bugs".
            - "explanation": A clear, concise explanation of what the code does.
            - "bugs": A string describing any potential bugs or "No obvious bugs found.".

            Example of the required output format:
            {"explanation": "Your explanation here.", "bugs": "Your bug report here."}

            Code:
            ${code}
        `;

        const response = await genAI.models.generateContent({
            model: "gemini-2.5-flash", 
            contents: [{ parts: [{ text: prompt }] }],
        });

        // Part 2: Safer parsing to handle accidental markdown
        const rawText = response.text;
        const jsonStartIndex = rawText.indexOf('{');
        const jsonEndIndex = rawText.lastIndexOf('}');

        if (jsonStartIndex === -1 || jsonEndIndex === -1) {
            throw new Error("AI response did not contain a valid JSON object.");
        }

        const jsonString = rawText.substring(jsonStartIndex, jsonEndIndex + 1);
        
        res.status(200).json(JSON.parse(jsonString));

    } catch (error) {
        console.error('AI API Error:', error);
        res.status(500).json({ message: "Can't get explanation from AI" });
    }
};