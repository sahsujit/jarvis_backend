
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




const askToAssistant = async (req, res) => {
  try {
    const { command } = req.body;

    // Fetch user
    const user = await User.findById(req.userId).select("-password");
    if (!user) return res.status(404).json({ response: "User not found" });

    // Save command to user history
    if (!user.history) user.history = [];
    user.history.push(command);
    await user.save();

    const assistantName = user.assistantName || "Assistant";
    const userName = user.name || "User";

    // Clean command: remove assistant name
    const cleanedCommand = command
      .replace(new RegExp(`\\b${assistantName}\\b`, "gi"), "")
      .trim();

    // Get Gemini response dynamically
    const gemResult = await geminiResponse(cleanedCommand, assistantName, userName);

    if (!gemResult) {
      return res.status(500).json({
        response: "Sorry, I couldn’t process that request right now.",
      });
    }

    const type = gemResult.type || "general";
    const userInput = gemResult.userInput || cleanedCommand;
    const response = gemResult.response || "Sorry, I couldn't understand your request";

    // Handle special types
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
      default:
        // Return Gemini response dynamically for any other query
        return res.json({ type, userInput, response });
    }
  } catch (error) {
    console.error("askToAssistant error:", error);
    return res.status(500).json({
      response: "Something went wrong while processing your request",
    });
  }
};



export { getCurrentUser, updateAssistant, askToAssistant };
