import mongoose, {Schema} from "mongoose"

const orderSchema = new Schema(
    {
        userId : {
            type : Schema.Types.ObjectId,
            ref : "User"
        },
        items : [{
            foodItemId : {
                type : Schema.Types.ObjectId,
                ref : "Dish"
            },
            quantity : {
                type : Number,
                default: 1
            },
        }],
        totalAmount : {
            type : float,
            required: true
        },
        status : {
            type : String,
            default : "pending"  // pendin , prepairing, delivered
        }, 
        paymentStatus: {
            type : String,
            default: "unpaid"
        }
    },
    {
        timestamps: true
    }
)

export const Order = mongoose.model("Oder", orderSchema)