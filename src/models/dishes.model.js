import mongoose, {Schema} from "mongoose"

const dishSchema = new Schema(
    {
        name : {
            type : String,
            required : true
        },
        description : String,
        price : {
            type : Number,
            required: true
        },
        imageUrl : {
            type : String,
            required: true
        },
        category : {
            type : String,
            required : true
        },
        tags : [String]
    },
    {
        timestamps: true
    }
)

export const Dish = mongoose.model("Dish", dishSchema)