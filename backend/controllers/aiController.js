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

        // This is strict, product-focused prompt 
        const prompt = `
            You are an expert code analysis and debugging assistant. Your task is to analyze a given code snippet.

            IMPORTANT INSTRUCTIONS:
            - Your response must be ONLY a raw JSON object.
            - Do NOT wrap the JSON in markdown code fences (\`\`\`json ... \`\`\`) or any other text.
            - The JSON object must have the following structure: { "explanation": "string", "hasError": boolean, "errorAnalysis": "string | null", "correctedCode": "string | null", "keyConcepts": ["string"] }

            - "explanation": Provide a clear, step-by-step explanation of the code's purpose. Use markdown for formatting.
            - "hasError": A boolean (true or false) indicating if you found any bugs or syntax errors.
            - "errorAnalysis": If hasError is true, provide a concise explanation of the error. If hasError is false, this field must be null.
            - "correctedCode": If hasError is true, provide the corrected version of the code snippet. If hasError is false, this field must be null.
            - "keyConcepts": List the main programming concepts in an array of strings.

            Here is the code snippet to analyze:
            ---
            ${code}
            ---

            Repeat: Respond with ONLY a raw JSON object with the specified structure.
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