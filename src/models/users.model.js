import mongoose, {Schema} from "mongoose"

const userSchema = new Schema(
    {
        name : {
            type : String,
            required : true
        },
        email : {
            type: String,
            required: true,
            unique : true
        },
        password : {
            type: String,
            required: true
        },
        address : {
            type: String,
            required: true
        },
        avtar : {
            type: String  //cloudinery
        },
        phone : {
            type: String,
            required: true
        },
        isAdmin: {
            type: Boolean,
            required: false
        },
        refreshToken: {
            type: String
        }
    },
    {
        timestamps: true
    }
)

export const User = mongoose.model("User", userSchema)