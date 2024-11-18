const express = require('express');
const axios = require('axios');
const cors = require('cors');  // Import the cors package
require('dotenv').config();    // For loading the API key from environment variables

const app = express();
const PORT = process.env.PORT || 5001;

// Enable CORS for requests from http://localhost:3000
app.use(cors({
    origin: 'http://localhost:3000',  // Allow requests from your frontend
    methods: ['GET', 'POST'],        // Allow specific HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization']  // Allow specific headers
}));

app.use(express.json());  // Middleware to parse JSON bodies

// Route to handle the chat request
app.post('/chat', async (req, res) => {
    const prompt = req.body.prompt;

    if (!prompt) {
        return res.status(400).send('Prompt is required');
    }

    try {
        const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: "gpt-3.5-turbo", // Or the model you're using
                messages: [{ role: "user", content: prompt }],
            },
            {
                headers: {
                    'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                    'Content-Type': 'application/json',
                },
            }
        );
        res.json(response.data);  // Return the OpenAI response
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Error communicating with OpenAI API');
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});