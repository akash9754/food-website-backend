import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/users.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler( async (req, res)  => {
    // get details from frontend 
    const { name, email, password, address, phone, isAdmin} = req.body ;
    // console.log("name :", name);
  
        if ([name, email, password, address, phone].some((feild) => feild?.trim() === "" )) {
            throw new ApiError(400, "All feilds are required");
        }

        const existedUser = User.findOne({
            $or: [{ email }, { phone }]
        })

        if(existedUser){
            throw new ApiError(409, "User with email or phone number already exist");   
        }

        const avatarLocalPath = req.files?.avatar[0]?.path
        if (!avatarLocalPath) {
            throw new ApiError(400, "Avatar file required");
        }

        const avatar = await uploadOnCloudinary(avatarLocalPath)
        if (!avatar) {
            throw new ApiError(401, "Avatar file required for cloudinery");
        }

        const user = await User.create({
            name,
            avatar : avatar.url,
            email,
            password,
            address, 
            phone, 
            isAdmin
        })

       const createdUser = await User.findById(user._id).select("-password -refreshToken")

       if(!createdUser){
        throw new ApiError(501, "something went wrong while creating user, please try later");
       }

       return res.status(201)
       .json(
        new ApiResponse(200, createdUser, "user registed successfully")
       )
       
})

export {registerUser}