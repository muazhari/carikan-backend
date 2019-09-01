import { Schema, model, Types } from "mongoose"

const CommentSchema = new Schema(
  {
    uid: {
      type: String,
      required: true
    },
    postId: {
      type: String,
      required: true
    },
    commentId: {
      type: String,
      required: true,
      unique: true
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
    }
  },
  { timestamps: true }
)

const Comment = model("comment", CommentSchema)
export default Comment
