// import axios from "axios";

// const geminiResponse = async (command, assistantName, userName) => {
//   try {
//     const geminiUrl = process.env.GEMINI_API_URL;


//     const prompt = `
// You are a virtual assistant named ${assistantName} created by ${userName}.
// You are not Google. You will now behave like a voice-enabled assistant.

// Your task is to understand the user's natural language input and respond with a JSON object like this:

// {
//   "type": "general" | "google_search" | "youtube_search" | "youtube_play" |
//            "get_time" | "get_date" | "get_day" | "get_month" | "calculator_open" |
//            "instagram_open" | "facebook_open" | "weather_show",
//   "userinput": "<original user input> {only remove your name from userinput if it exists}.
//                 If the user asks to search something on Google or YouTube, only include the search text here.",
//   "response": "<a short spoken response to read out loud to the user>"
// }

// Instructions:
// - "type": determine the intent of the user.
// - "userinput": keep the original sentence (remove your assistant’s name if mentioned).
// - "response": make it a short, voice-friendly reply, e.g., "Sure, playing it now", "Here’s what I found", "Today is Tuesday".

// Type meanings:
// - "general": if it's a factual or informational question.
// - "google_search": if the user wants to search something on Google.
// - "youtube_search": if the user wants to search something on YouTube.
// - "youtube_play": if the user wants to directly play a video or song.
// - "calculator_open": if the user wants to open a calculator.
// - "instagram_open": if the user wants to open Instagram.
// - "facebook_open": if the user wants to open Facebook.
// - "weather_show": if the user wants to know the weather.
// - "get_time": if the user asks for current time.
// - "get_date": if the user asks for today’s date.
// - "get_day": if the user asks what day it is.
// - "get_month": if the user asks for the current month.

// Important:
// - Use "${userName}" if someone asks "tumhe kisne banaya" (who created you).
// - Only respond with the JSON object, nothing else.

// Now your userInput → ${command}
//     `;



//     const result =await axios.post(geminiUrl, {
//       "contents": [
//         {
//           "parts": [
//             {
//               "text": prompt,
//             },
//           ],
//         },
//       ],
//     });

//     return result.data.candidates[0].content.parts[0].text;
//   } catch (error) {
//     console.log(error);
//   }
// };


// export default geminiResponse
















import axios from "axios";

const geminiResponse = async (command, assistantName, userName) => {
  try {
    const geminiUrl = process.env.GEMINI_API_URL;





       


//     const prompt = `


// You are a virtual assistant named ${assistantName} created by ${userName}.
// Respond ONLY with a JSON object in this format:

// {
//   "type": "general" | "google_search" | "youtube_search" | "youtube_play" |
//            "get_time" | "get_date" | "get_day" | "get_month" | "calculator_open" |
//            "instagram_open" | "facebook_open" | "weather_show",
//   "userInput": "<original user input>",
//   "response": "<short voice-friendly reply>"
// }

// Now your userInput → ${command}
//     `;






const prompt = `
You are a virtual assistant named ${assistantName} created by ${userName}.
Respond ONLY with a JSON object in this format:

{
  "type": "general" | "google_search" | "youtube_search" | "youtube_play" |
           "get_time" | "get_date" | "get_day" | "get_month" | "calculator_open" |
           "instagram_open" | "facebook_open" | "weather_show",
  "userInput": "<cleaned user input without your name>",
  "response": "<short voice-friendly reply>"
}

Now your userInput → ${command}
**Important:** Remove any mention of your name (${assistantName}) from the userInput field. Only include the actual command the user wants.
`;


    const result = await axios.post(geminiUrl, {
      contents: [
        {
          parts: [{ text: prompt }],
        },
      ],
    });

    let rawText = result.data.candidates[0].content.parts[0].text;

    // Remove any ```json or ``` wrapping
    rawText = rawText.replace(/```json/g, "").replace(/```/g, "").trim();

    // Parse JSON safely
    const parsed = JSON.parse(rawText);
    return parsed;
  } catch (error) {
    console.error("Gemini response error:", error);
    return null;
  }
};

export default geminiResponse;









