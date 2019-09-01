import { Router } from "express"
import { Post, User, Comment } from "../Models"
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

const validateNewComment = data => {
  data.commentId = Types.ObjectId().toHexString()
}

routes.get("/:postId/comments", (req, res) => {
  const { postId } = req.params
  Comment.findOne({ postId: postId }, "-_id -uid -__v")
    .then(data => {
      res.send(data)
      console.log(`Comment has been Read ${data}`)
    })
    .catch(err => res.send(err))
})

routes.post("/:postId/comments", (req, res) => {
  validateNewComment(req.body)
  const { postId } = req.params
  const { uid, commentId } = req.body
  req.body.postId = postId

  Promise.all([
    Comment.create(req.body),
    Post.findOneAndUpdate(
      { $and: [{ uid: uid }, { postId: postId }] },
      {
        $push: { comments: { commentId: commentId } }
      }
    )
  ])
    .then(data => {
      const selected = excludeAndValidate(["_id", "uid", "__v"], data[0]._doc)

      res.send(selected)
      console.log(`Comment has been Created ${data}`)
    })
    .catch(err => res.send(err))
})

routes.put("/:postId/comments/:commentId", (req, res) => {
  const { postId, commentId } = req.params
  const { uid, text } = req.body
  Comment.findOneAndUpdate(
    {
      $and: [{ uid: uid }, { postId: postId }, { commentId: commentId }]
    },
    {
      $set: { text: text }
    }
  ).then(data => {
    const selected = excludeAndValidate(["_id", "uid", "__v"], data[0]._doc)

    res.send(selected)
    console.log(`Comment has been Updated ${data}`)
  })
})

routes.delete("/:postId/comments/:commentId", (req, res) => {
  const { postId, commentId } = req.params
  const { uid } = req.body

  Promise.all([
    Comment.findOneAndRemove({
      $and: [{ uid: uid }, { postId: postId }, { commentId: commentId }]
    }),
    Post.findOneAndUpdate(
      {
        $and: [{ uid: uid }, { postId: postId }]
      },
      { $pull: { comments: { $elemMatch: { commentId: commentId } } } }
    )
  ])
    .then(data => {
      res.send()
      console.log(`Comment has been Deleted ${data}`)
    })
    .catch(err => res.send(err))
})

export default routes
