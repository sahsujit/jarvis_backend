// import User from "../models/user.model.js";
// import uploadOnCloudinary from "../config/cloudinary.js";
// const getCurrentUser = async (req, res) => {
//   try {
//     const userId = req.userId;
//     const user = await User.findById(userId).select("-password");
//     if (!user) {
//       return res.status(400).json({ message: "User not found" });
//     }
//     res.status(200).json(user);
//   } catch (error) {}
// };

// const updateAssistant = async (req, res) => {
//   try {
//     const { imageUrl, assistantName } = req.body;
//     let assistantImage;
//     if (req.file) {
//       assistantImage = await uploadOnCloudinary(req.file.path);
//     } else {
//       assistantImage = imageUrl;
//     }

//     const user = await User.findById(
//       req.userId,
//       {
//         assistantName,
//         assistantImage,
//       },
//       { new: true }
//     ).select("-password");
//     if (!user) {
//       return res.status(400).json({ message: "User not found" });
//     }
//     res.status(200).json({user, message: "Assistant updated successfully" });
//   } catch (error) {
//     res
//       .status(500)
//       .json({ message: "Something went wrong while updating assistant" });
//   }
// };

// export { getCurrentUser, updateAssistant };











import User from "../models/user.model.js";
import uploadOnCloudinary from "../config/cloudinary.js";
import geminiResponse from "../gemini.js";
import moment from "moment";
const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong while fetching user" });
  }
};

const updateAssistant = async (req, res) => {
  try {
    const { imageUrl, assistantName } = req.body;
    let assistantImage;

    if (req.file) {
      assistantImage = (await uploadOnCloudinary(req.file.path)).url; // get URL from Cloudinary
    } else {
      assistantImage = imageUrl;
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.userId,
      {
        assistantName,
        assistantImage,
      },
      { new: true }
    ).select("-password");

    if (!updatedUser) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ user: updatedUser, message: "Assistant updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong while updating assistant" });
  }
};



// const askToAssistant = async(req, res)=>{
// try {

//   const {command} = req.body
//   const user = await User.findById(req.userId).select("-password");

//   const assistantName = user.assistantName;
//   const userName = user.name;

//   const response = await geminiResponse(command, assistantName, userName);
//   const jsonMatch = response.match(/{[\s\s]*}/);

//   if(!jsonMatch){
//     return res.status(400).json({response:"sorry, I can't understand you"});
//   }

//   const gemResult = JSON.parse(jsonMatch[0]);
//   const type = gemResult.type;

//   switch (type) {
//     case 'get_date':
//       return res.json({
//         type,
//         userInput:gemResult.userInput,
//         response:`Today is ${moment().format("dddd, MMMM Do YYYY")}`
//       });


      
//     case 'get_time':
//       return res.json({
//         type,
//         userInput:gemResult.userInput,
//         response:`The time is ${moment().format("h:mm:ss A")}`
//       });

      
//     case 'get_day':
//       return res.json({
//         type,
//         userInput:gemResult.userInput,
//         response:`Today is ${moment().format("dddd")}`
//       });

//     case 'get_month':
//       return res.json({
//         type,
//         userInput:gemResult.userInput,
//         response:`The month is ${moment().format("MMMM")}`
//       });

//       case 'google_search':
//         case 'youtube_search':
//         case 'youtube_play':
//         case 'general':
//         case 'calculator_open':
//         case 'instagram_open':
//         case 'facebook_open':
//         case 'weather_show':
//         return res.json({
//           type,
//           userInput:gemResult.userInput,
//           response:gemResult.response
//         });
  
//     default:
//       return res.status(400).json({response:"I don't understand what you want to do"});
//   }

// } catch (error) {
//   return res.status(500).json({response:"Something went wrong while processing your request"});
// }
// }


















 const askToAssistant = async (req, res) => {
  try {
    const { command } = req.body;

    // Fetch user
    const user = await User.findById(req.userId).select("-password");
    const assistantName = user.assistantName || "Assistant";
    const userName = user.name || "User";

    // Get Gemini response
    const gemResult = await geminiResponse(command, assistantName, userName);

    if (!gemResult) {
      return res.json({
        type: "general",
        userInput: command,
        response: "Sorry, I couldn't understand your request",
      });
    }

    const { type, userInput, response } = gemResult;

    switch (type) {
      case "get_date":
        return res.json({
          type,
          userInput,
          response: `Today is ${moment().format("dddd, MMMM Do YYYY")}`,
        });

      case "get_time":
        return res.json({
          type,
          userInput,
          response: `The time is ${moment().format("h:mm:ss A")}`,
        });

      case "get_day":
        return res.json({
          type,
          userInput,
          response: `Today is ${moment().format("dddd")}`,
        });

      case "get_month":
        return res.json({
          type,
          userInput,
          response: `The month is ${moment().format("MMMM")}`,
        });

      case "google_search":
      case "youtube_search":
      case "youtube_play":
      case "general":
      case "calculator_open":
      case "instagram_open":
      case "facebook_open":
      case "weather_show":
        return res.json({
          type,
          userInput,
          response,
        });

      default:
        return res.json({
          type: "general",
          userInput,
          response: "Sorry, I couldn't understand your request",
        });
    }
  } catch (error) {
    console.error("askToAssistant error:", error);
    return res.status(500).json({
      response: "Something went wrong while processing your request",
    });
  }
};




export { getCurrentUser, updateAssistant, askToAssistant };
