import dotenv from "dotenv";
import axios from "axios"; // Import axios

dotenv.config();

export const MentalCoach = async (req, res) => {
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

    const { question } = req.body;

    if (!question) {
        return res.status(400).json({ error: "Question is required!" });
    }

    const allowedTopics = [
        "mental health", "stress", "mindfulness", "motivation",
        "anxiety", "meditation", "happiness", "self-care"
    ];
    
    const greetings = ["hello", "hi", "hey", "good morning", "good evening"];
    
    const friendlyTalks = [
        "how are you", "what's up", "how's your day", "thank you", "nice to meet you",
        "you are great", "good job", "tell me something nice"
    ];
    
    const lowerCaseQuestion = question.toLowerCase();
    const isAllowed = allowedTopics.some(topic => lowerCaseQuestion.includes(topic));
    const isGreeting = greetings.some(greet => lowerCaseQuestion.includes(greet));
    const isFriendlyTalk = friendlyTalks.some(talk => lowerCaseQuestion.includes(talk));
    
    if (!isAllowed && !isGreeting && !isFriendlyTalk) {
        return res.json({ answer: "I can only help with mental wellness topics or friendly conversations!" });
    }    

    try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

        const data = {
            contents: [{ parts: [{ text: question }] }],
        };

        const response = await axios.post(url, data, {
            headers: { "Content-Type": "application/json" },
        });

        if (
            response.data &&
            response.data.candidates &&
            response.data.candidates.length > 0
        ) {
            res.json({ answer: response.data.candidates[0].content.parts[0].text });
        } else {
            res.json({ answer: "No response from AI" });
        }
    } catch (error) {
        console.error(
            "AI Error:",
            error.response ? error.response.data : error.message
        );
        res.status(500).json({ error: "AI Server Error" });
    }
};
