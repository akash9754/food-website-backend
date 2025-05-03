import mongoose, {Schema} from "mongoose"

const reviewSchema = new Schema(
    {
        userId : {
            type : Schema.Types.ObjectId,
            ref : "User",
            required : true
        },
        fooditemId : {
            type : Schema.Types.ObjectId,
            ref : "Dish",
            required : true
        },
        rating: {
            type: Int16Array,
            min: 1,
            max: 5,
            required : true
        },
        comment : {
            type : String,
            required : true
        }
    },
    {
        timestamps: true
    }
)

export const Review = mongoose.model("Review", reviewSchema)