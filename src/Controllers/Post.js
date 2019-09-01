import { Router } from "express"
import { Post, User } from "../Models"
import { Types } from "mongoose"

const routes = Router()

const pickAndValidate = (pickKeys, data) => {
  const selected = {}
  pickKeys.forEach(keyItem => {
    // validate
    if (data[keyItem]) {
      selected[keyItem] = data[keyItem]
    }
  })
  return selected
}

const excludeAndValidate = (excludeKeys, data) => {
  const selected = data
  excludeKeys.forEach(keyItem => {
    // validate
    delete selected[keyItem]
  })
  return selected
}

const validateNewPost = data => {
  data.postId = Types.ObjectId().toHexString()
}

routes.get("/", (req, res) => {
  const toFind = req.body ? req.body : {}
  Post.aggregate([
    { $match: toFind },
    {
      $lookup: {
        from: "users",
        localField: "uid",
        foreignField: "uid",
        as: "user"
      }
    },
    { $unwind: "$user" },
    {
      $project: {
        postId: 1,
        text: 1,
        images: 1,
        comments: 1,
        createdAt: 1,
        updatedAt: 1,
        "user.username": 1,
        "user.displayName": 1,
        "user.photoURL": 1,
        _id: 0
        // __v: 0,
        // uid: 0,
        // "user.__v": 0,
        // "user._id": 0,
        // "user.uid": 0,
        // "user.newUser": 0,
        // "user.email": 0,
        // "user.phoneNumber": 0,
        // "user.posts": 0,
        // "user.createdAt": 0,
        // "user.updatedAt": 0
      }
    }
  ])
    .then(data => {
      res.send(data)
      // console.log(`Post has been Read ${data}`)
    })
    .catch(err => res.send(err))
})

routes.post("/", (req, res) => {
  validateNewPost(req.body)

  const { uid, postId } = req.body
  Promise.all([
    Post.create(req.body),
    User.findOneAndUpdate(
      { uid: uid },
      { $push: { posts: { postId: postId } } }
    )
  ])
    .then(data => {
      const selected = excludeAndValidate(["_id", "uid", "__v"], data[0]._doc)

      res.send(selected)
      console.log(`Post has been Created ${data}`)
    })
    .catch(err => res.send(err))
})

routes.put("/:postId", (req, res) => {
  const { postId } = req.params
  const { uid, text } = req.body
  Post.findOneAndUpdate(
    { $and: [{ postId: postId }, { uid: uid }] },
    {
      $set: { text: text }
    }
  ).then(data => {
    res.send()
    console.log(`Post has been Updated ${data}`)
  })
})

routes.delete("/:postId", (req, res) => {
  const postId = req.params.id
  const { uid } = req.body

  Promise.all([
    Post.findOneAndRemove({ $and: [{ postId: postId }, { uid: uid }] }),
    User.findOneAndUpdate(
      { uid: uid },
      { $pull: { posts: { $elemMatch: { postId: postId } } } }
    )
  ])
    .then(data => {
      res.send()
      console.log(`Post has been Deleted ${data}`)
    })
    .catch(err => res.send(err))
})

export default routes
