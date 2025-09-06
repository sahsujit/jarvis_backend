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

export { getCurrentUser, updateAssistant };
