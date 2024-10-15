import mongoose  from "mongoose";

const orderSchema = mongoose.Schema({
    shippingInfo: {
        address: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true
        },
        phoneNo: {
            type: String,
            required: true
        },
        zipCode: {
            type: String,
            required: true
        },
        country: {
            type: String,
            required: true
        }
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    orderItems: [
        {
            name: {
                type: String,
                required: true
            },
            quantity: {
                type: Number,
                required: true
            },
            image: {
                type: String,
                required: true
            },
            price: {
                type: Number,
                required: true
            },
            product: {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                ref: 'Product'
            }
        }
    ],
    paymentMethod : {
        type : String,
        required : [true,"Please select payment method"],
        enum : {
            values : ["COD","CARD"],
            message : "Please select COD or Card",
        },
    },
    paymentInfo: {
        id: {
            type: String
        },
        status: {
            type: String
        }
    },
    paidAt: {
        type: Date
    },

    itemsPrice: {
        type: Number,
        required: true,
        default: 0.0
    },
    taxAmount: {
        type: Number,
        required: true,
        default: 0.0
    },
    shippingAmount: {
        type: Number,
        required: true,
        default: 0.0
    },
    totalAmount: {
        type: Number,
        required: true,
        default: 0.0
    },
    orderStatus: {
        type: String,
        enum : {
            values : ["Processing", "Shipped", "Delivered"],
            message : "Please select correct order status"
        },
        default: 'Processing'
    },
    deliveredAt: {
        type: Date
    },
}, {timestamps : true});

export default mongoose.model('Order', orderSchema)