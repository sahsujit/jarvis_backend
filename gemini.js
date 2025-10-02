







import axios from "axios";

const geminiResponse = async (command, assistantName, userName) => {
  try {
    const geminiUrl = process.env.GEMINI_API_URL;


    const prompt = `
You are a helpful virtual assistant named ${assistantName} created by ${userName}.
Respond ONLY with a JSON object in this format:

{
  "type": "general" | "google_search" | "youtube_search" | "youtube_play" |
           "get_time" | "get_date" | "get_day" | "get_month" | "calculator_open" |
           "instagram_open" | "facebook_open" | "weather_show",
  "userInput": "<cleaned user input without your name>",
  "response": "<short voice-friendly reply answering the user's question>"
}

Remove any mention of your name (${assistantName}) from userInput.
User Input → ${command}
`;



    const result = await axios.post(geminiUrl, {
      contents: [
        {
          parts: [{ text: prompt }],
        },
      ],
    });

    let rawText = result.data.candidates[0].content.parts[0].text;

    // Clean response
    rawText = rawText.replace(/```json/g, "").replace(/```/g, "").trim();

    // Parse JSON safely
    const parsed = JSON.parse(rawText);
    return parsed;
  } catch (error) {
    console.error("Gemini response error:", error);
    return {
      type: "general",
      userInput: command,
      response: "Sorry, something went wrong while processing your request.",
    };
  }
};

export default geminiResponse;

