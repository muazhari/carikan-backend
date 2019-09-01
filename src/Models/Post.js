import { Schema, model, Types } from "mongoose"

const PostSchema = new Schema(
  {
    uid: {
      type: String,
      required: true
    },
    postId: {
      type: String,
      required: true,
      unique: true
    },
    images: {
      type: [{ imageURL: String, _id: false }]
    },
    text: {
      type: String,
      minlength: 1,
      maxlength: 256,
      required: true
    },
    upCount: {
      type: Number,
      default: 0
    },
    comments: {
      type: [{ commentId: String, _id: false }]
    },
    loc: {
      type: { type: String },
      coordinates: [Number]
    }
  },
  { timestamps: true }
)

const Post = model("post", PostSchema)
export default Post
