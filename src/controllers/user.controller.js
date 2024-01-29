import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { ApiRespose } from "../utils/ApiResponse.js";

import { uploadonCloudinary } from "../utils/cloudinary.js";
const registerUser = asyncHandler(async (req, res) => {
  //   get details from user
  // validation- not empty
  // check if user already exists:username/email
  // check for images, and avatar
  // upload them to cloudinary
  // create user oblect-create entry in db
  // remove password and refresh token from response
  // check for user creation
  // return response

  const { fullName, email, username, password } = req.body;
  if (
    [fullName, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are compulsary");
  }

  const existdUser = User.findOne({
    $or: [{ username }, { email }],
  });

  if (existdUser) {
    throw new ApiError(409, "User already exists");
  }

  const avatarLocalPath = req.files?.avatar[0]?.path;

  const coverimageLocalPath = req.files?.coverImage[0]?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "avatar file is required");
  }
  const avatar = await uploadonCloudinary(avatarLocalPath);
  const coverImage = await uploadonCloudinary(coverimageLocalPath);

  if (!avatar) {
    throw new ApiError(409, "User already exists");
  }

  const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase(),
  });

  const createdUser = await User.findById(user._id).select(
    "_password  -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "something wenyt wrong while registering user");
  }

  return res
    .status(200)
    .json(new ApiRespose(200, createdUser, "User registered successfully"));
});

export { registerUser };
