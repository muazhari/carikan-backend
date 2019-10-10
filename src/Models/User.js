import { Schema, model } from 'mongoose'

const PhoneNumberSchema = new Schema(
  {
    number: {
      type: String,
      required: false,
      unique: true,
    },
    default: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false }
)

const UserSchema = new Schema(
  {
    uid: {
      type: String,
      unique: true,
      required: true,
    },
    displayName: {
      type: String,
      required: false,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    phoneNumber: {
      type: [PhoneNumberSchema],
      required: false, //Should be true
    },
    photoURL: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: false,
    },
    newUser: {
      type: Boolean,
      default: true,
    },
    posts: {
      type: [{ postId: String, _id: false }],
    },
  },
  { timestamps: true }
)

const User = model('user', UserSchema)
export default User
