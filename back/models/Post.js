import mongoose from "mongoose";

const PostSchema = mongoose.Schema({
    title:{
        type: String,
        required: true, 
    },
    text:{
        type: String,
        required: true, 
    },
    tags:{
        type: Array,
        default: []
    },
    viewsCount:{
        type: Number,
        default: 0
    },
    likesCount: {
        type: Number,
        default: 0
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true 
    },
    imageUrl: String,
    comments: {
        type: [{
            text: {
                type: String,
                required: true,
                trim: true
            },
            author: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                required: true
            },
            fullName: {
                type: String,
                required: true
            },
            avatarUrl:{
                type: String,
                required: true
            },
            createdAt: {
                type: Date,
                default: Date.now
            }
        }],
        default: []
    }
}, {
    timestamps: true,
    versionKey: false 
});

export default mongoose.model("Post", PostSchema)