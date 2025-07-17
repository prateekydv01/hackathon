import { User } from "../models/user.model.js";
import cloudinary from "../utils/cloudinary.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {ApiError} from "../utils/ApiError.js"
import jwt from "jsonwebtoken";
import {uploadOnCloudinary,deleteFromCloudinary} from "../utils/cloudinary.js";

export const generateAccessAndRefreshToken = async (userId)=>{
    try {
        const user = await User.findById(userId)
        if (!user){
                throw new ApiError(404, "No user found on generating access and refresh token!");
            }
        
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()
    
        user.refreshToken=refreshToken
         await user.save({validateBeforeSave : false})
        return {accessToken,refreshToken}
    } catch (error) {
        throw new ApiError(404,"something went wrong while generatinga access and refresh token")
    }
}

export const registerUser = asyncHandler(async(req,res)=>{
    const {fullName,username,email,password,profession,contactNumber} = req.body

    if (
        [fullName, username , email, password,profession,contactNumber].some((field)=>field?.trim()==="")
    ){
        throw new ApiError(400,"All fields are required! ")
    }

    const existedUser = await User.findOne({
        $or:[{username},{email}]
    })
    if (existedUser){
        throw new ApiError (409 , "User with this email or username already exists ")
    }

    const avatarLocalPath = req.file?.path
    if(!avatarLocalPath){
        throw new ApiError(400 , "Avatar file is missing")
    }
    let avatar;
    try {
        avatar = await uploadOnCloudinary(avatarLocalPath)
        console.log("uploaded avatar",avatar);
        
    } catch (error) {
        console.log("Error uploading avatars! ",error);
        throw new ApiError(500,"failed to upload avatar! ")
        
    }

    if (password.length < 6) {
        throw new ApiError(400, "Password must be at least 6 characters");
    }

    
    //creatiing user in data base
    try {
        console.log(avatar)
     const user = await User.create({
         fullName,
         avatar : avatar.url,
         avatarPublicId : avatar.public_id,
         email,
         password,
         username : username.toLowerCase(),
         profession,
         contactNumber,
         location: {
            type: "Point",
            coordinates: [77.1914, 28.6519] // Default location: Delhi
        }
     })
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )
    if(!createdUser){
        throw new ApiError(500,"Something went wrong while registering a user !")
    }
    
     return res
     .status(200)
     .json(new ApiResponse(200,createdUser,"User registered successfully !"))
   } catch (error) {
    console.log("User creation failed !",error);
    if (avatar){
        await deleteFromCloudinary(avatar.public_id,"image")
    }
    throw new ApiError(500 , "something went wrong while registering the user and images are deleted!")

}
} )

export const loginUser = asyncHandler(async(req,res)=>{
    const {email,password} = req.body

    if(!email||!password){
        throw new ApiError(400,"email and password are required!")
    }

    const user = await User.findOne({email})
    if(!user){
        throw new ApiError(404, "user not found !")
    }
    const isPasswordValid = await user.isPasswordCorrect(password)
    if (!isPasswordValid){
        throw new ApiError(401,"password incorrect!")
    }

    const {accessToken,refreshToken} = await generateAccessAndRefreshToken(user._id)
    const loggedInUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )
    const options = {
        httpOnly : true , 
        secure : process.env.NODE_ENV === "production" 
    }

    return res
    .status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json(new ApiResponse(200,
        {user:loggedInUser},
        "user logged in successfully"))
})

export const getCurrentUser = asyncHandler(async(req,res)=>{
    return res.status(200).json(new ApiResponse(200,req.user,"current user fetched successfully !"))
})

export const updateAccessToken = asyncHandler(async(req,res)=>{
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken //for website we use cookies and for mobile app we use body
    if (!incomingRefreshToken){
        throw new ApiError(401,"refresh token is required!")
    }

    try {
       const decodedToken = jwt.verify(
           incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )
    
        const user = await User.findById(decodedToken?._id)
        if(!user){
            throw new ApiError(401,"Invalid refresh token")
        }
        
        if(incomingRefreshToken !==user?.refreshToken){
            throw new ApiError(401," invalid refresh token ! ")
        }
        const options = {
            httpOnly: true,
            secure:process.env.NODE_ENV==="production"
        }

        const{accessToken , refreshToken : newRefreshToken} = await generateAccessAndRefreshToken(user._id)

        return res
        .status(200)
        .cookie("accessToken",accessToken,options)
        .cookie("refreshToken",newRefreshToken,options)
        .json(
            new ApiResponse(
                200,
                {accessToken,
                    refreshToken:newRefreshToken
                },
                "Access token refreshed successfully"
            ))
            } catch (error) {
        throw new ApiError(400,"something went wrong while refreshing and accesing token !")
    }
})

export const changePassword = asyncHandler(async(req,res)=>{
    const {oldPassword,newPassword} = req.body

    const user = await User.findById(req.user?._id)
    if(!user){
        throw new ApiError(404,"User not found!")
    }

    const isPasswordValid  = await user.isPasswordCorrect(oldPassword)

    if(!isPasswordValid){
        throw new ApiError("401", "Old password is not correct!")
    }

    user.password = newPassword

     await user.save({validateBeforeSave:false})
    
    return res
    .status(200)
    .json(new ApiResponse(200,{},"Password changed successfully"))

})

export const getNearbyUser = asyncHandler(async (req, res) => {
    const { profession } = req.query;

    const user = await User.findById(req.user._id);
    if (!user || !user.location?.coordinates) {
        throw new ApiError(404, "User location not found");
    }

    const [lng, lat] = user.location.coordinates;
    console.log(lat)
    const query = {
        location: {
        $near: {
            $geometry: {
            type: "Point",
            coordinates: [lng, lat],
            },
            $maxDistance: 15000, // 5 km in meters
        },
        },
        _id: { $ne: user._id } // exclude current user
    };
    console.log(query)
    if (profession && profession !== "all") {
        query.profession = profession;
    }

    const nearbyUsers = await User.find(query).select("-password -refreshToken");

    return res.status(200).json(new ApiResponse(200, nearbyUsers, "Nearby users fetched"));
});
