import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/users.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const generateAccessTokenAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken =  user.generateAccessToken()
        const refreshToken =  user.generateRefreshToken()

        // console.log("refreshToken :", refreshToken);
        

        user.refreshToken = refreshToken 
        await user.save({validateBeforeSave: false})

        return {accessToken, refreshToken}

    } catch (error) {
        throw new Error(500, "something went wrong while generating access and refresh token");
        
    }
}

const registerUser = asyncHandler( async (req, res)  => {
    // get details from frontend 
    const { name, email, password, address, phone, isAdmin} = req.body ;
    console.log("email :", email);
    console.log("phone :", phone);
  
        if ([name, email, password, address, phone].some((feild) => feild?.trim() === "" )) {
            throw new ApiError(400, "All feilds are required");
        }

        const existedUser = await User.findOne({
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

const loginUser = asyncHandler( async (req, res) => {
    // console.log(req.body);
    console.log('BODY:', req.body); // Should NOT be undefined
    // res.send('Received');
    // // get details from frontend 
    
    const { email, phone, password} = req.body ;
    // console.log("email :", email);
    // console.log("phone :", phone);

    // asyncHandler( async (req, res) => {
    // console.log(req.body.email);
    // console.log(req);
    
    // const { email, phone, password} = req.body
    // console.log("email", req.body);
    // console.log("phone", phone);
    

    if(!(email || phone)){
        throw new ApiError(402, "Enter email or phone number to login");
    }

    // if (!password) {
    //     throw new ApiError(403, "please enter password")
    // }

    const user = await User.findOne({
        $or : [{email}, {phone}]
    })

    if (!user) {
        throw new ApiError(404, "User not found"); 
    }

    const isPasswordValid = await user.isPasswordCorrect(password)
    if(!isPasswordValid) {
        throw new ApiError(405, "please enter correct password");  
    }

        const { accessToken, refreshToken } = await generateAccessTokenAndRefreshToken(user._id)
        console.log("accessToken :", accessToken);
        
        const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

        const option = {
            httpOnly : true,
            secure : true
        }

        return res
        .status(200)
        .cookie("accessToken", accessToken, option)
        .cookie("refreshToken", refreshToken, option)
        .json(
            new ApiResponse(
                200,
                {
                    user : loggedInUser, accessToken, refreshToken
                }, 
                "user logged in succesfully "
            )
        )
    console.log("succesfully login");
})


const logoutUser = asyncHandler( async (req, res) => {
        
       await User.findByIdAndUpdate(
            req.user._id,
            {
                $set : {
                    refreshToken : undefined
                }
            }
        )

        const option = {
            httpOnly : true,
            secure : true
        }

        return res
        .status(200)
        .clearCookie("accessToken", option)
        .clearCookie("refreshToken", option)
        .json(new ApiResponse( 200, {}, "user logout"))
})

export {
    registerUser,
    loginUser,
    logoutUser
}