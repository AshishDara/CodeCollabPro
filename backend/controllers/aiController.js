// controllers/aiController.js
import { GoogleGenerativeAI } from '@google/generative-ai';

// @desc    Explain a code snippet using AI
// @route   POST /api/ai/explain
// @access  Private
export const explainCode = async (req, res) => {
    // Get the code snippet from the request body
    const { code } = req.body;

    if (!code || code.trim() === '') {
        return res.status(400).json({ message: 'Code snippet is required.' });
    }

    try {
        // Initialize the Google Generative AI client
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        // Get the generative model
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        // --- This is our strict, product-focused prompt ---
        const prompt = `
            You are an expert code analysis assistant. Your task is to explain a given code snippet.

            IMPORTANT INSTRUCTIONS:
            - Your response must be ONLY a raw JSON object.
            - Do NOT wrap the JSON in markdown code fences (\`\`\`json ... \`\`\`) or any other text.
            - The JSON object must have the following structure: { "language": "string", "explanation": "string", "keyConcepts": ["string"] }

            - "language": Identify the programming language of the code snippet.
            - "explanation": Provide a clear, concise, step-by-step explanation of what the code does. Use markdown for formatting within this string (e.g., for bullet points or code formatting).
            - "keyConcepts": List the main programming concepts or keywords present in the code in an array of strings.

            Here is the code snippet to analyze:
            ---
            ${code}
            ---

            Repeat: Respond with ONLY a raw JSON object.
        `;

        // Generate content using the prompt
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Parse the JSON text from the AI's response
        const parsedJson = JSON.parse(text);

        // Send the parsed JSON object to the frontend
        res.status(200).json(parsedJson);

    } catch (error) {
        console.error('AI API Error:', error);
        res.status(500).json({ message: 'Failed to get explanation from AI.' });
    }
};