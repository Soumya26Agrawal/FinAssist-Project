import ApiError from "../utils/apiError.js";
import User from "../models/user.model.js";

const storeDetails = async (req, res) => {
  try {
    console.log(req.body);
    const { email, uid } = req.body;
    if ([email, uid].some((field) => field == null || field?.trim() === "")) {
      throw new ApiError("All fields are mandatory!", 400);
    }
    console.log(0);
    const existingUser = await User.findOne({ uid });
    if (existingUser) {
      return res.json({ user: existingUser });
    }
    console.log(1);
    const newUser = await User.create({
      uid,
      email,
    });

    if (!newUser) {
      throw new ApiError("Internal server error", 500);
    }

    console.log(2);

    return res
      .status(201)
      .json({ message: "User stored successfully", user: newUser });
    console.log(3);
  } catch (err) {
    if (err instanceof ApiError) {
      return res.status(err.statusCode).json({ message: err.message });
    }
    return res.json({ message: err.message });
  }
};

export { storeDetails };
