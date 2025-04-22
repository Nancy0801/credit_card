import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";

const generateAccessAndRefreshToken = async (userId) => {
    try{
      const user = await User.findById(userId);
      const accessToken = user.generateAccessToken();
      const refreshToken = user.generateRefreshToken();
    
      user.refreshToken = refreshToken;
      await user.save({ validateBeforeSave: false });
  
      return { accessToken, refreshToken };
    }catch (error) {
      throw new ApiError(500, "Token generation failed");
    }
};


const registerUser = asyncHandler(async(req,res) => {
    const { name, email, password, dob} = req.body;

    if(
        [name, email, password, dob].some((field) => field?.trim() === "")
    ){
        throw new ApiError(400, "All fields are required");
    }

    const existedUser = await User.findOne({ email: email});

    if(existedUser){
        throw new ApiError(400, "User already exists");
    }

    const newUser = await User.create({
        name,
        email,
        password,
        dob,
    });

    const createdUser = await User.findById(newUser._id).select(
        "-password -refreshToken"
      );
    
      if (!createdUser) {
        throw new ApiError(500, "User not created");
      }
    
      return res
        .status(201)
        .json(new ApiResponse(201, createdUser, "user registered successfully"));
});

const loginUser = asyncHandler(async(req , res) => {
    const {email , password} = req.body;
    if(!email){
        throw new ApiError(400 , "email is required");
    }

    const user = await User.findOne({
        $or: [{ email }],
    });
    
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const isPasswordValid = await user.isPasswordCorrect(password);

    if(!isPasswordValid){
        throw new ApiError(401, "Invalid Credentials");
    }

    const { accessToken , refreshToken } = await generateAccessAndRefreshToken(user._id);

    const loggedInUser = await User.findById(user._id).select(
        "-password -refreshToken"
    );

    const options = {
        httpOnly: true,
        secrue: true,
    };

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User logged in successfully"
      )
    );
})

export {
    registerUser,
    loginUser,
}
