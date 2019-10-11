import { Router } from 'express'
import { Post, User, Comment } from '../Models'
import { Types } from 'mongoose'
import { getKeys, delKeys, setKeys } from '../Helpers/KeysManipulate'

const routes = Router()

const validateNewComment = data => {
  const dataToValidate = {}

  if (!data.commentId) {
    dataToValidate['commentId'] = Types.ObjectId().toHexString()
  }

  return setKeys(data, dataToValidate)
}

const readComment = (req, res) => {
  const { postId } = req.params
  Comment.findOne({ postId: postId }, '-_id -uid -__v')
    .then(data => {
      res.status(200).send(data)
      console.log(`Comment has been Read ${data}`)
    })
    .catch(err => res.send(err))
}

const createComment = (req, res) => {
  validateNewComment(req.body)
  const { postId } = req.params
  const { uid, commentId } = req.body
  req.body.postId = postId

  Promise.all([
    Comment.create(req.body),
    Post.findOneAndUpdate(
      { $and: [{ uid: uid }, { postId: postId }] },
      {
        $push: { comments: { commentId: commentId } },
      }
    ),
  ])
    .then(data => {
      const selected = delKeys(data[0]._doc, ['_id', 'uid', '__v'])

      res.status(200).send(selected)
      console.log(`Comment has been Created ${data}`)
    })
    .catch(err => res.send(err))
}

const updateComment = (req, res) => {
  const { postId, commentId } = req.params
  const { uid, text } = req.body
  Comment.findOneAndUpdate(
    {
      $and: [{ uid: uid }, { postId: postId }, { commentId: commentId }],
    },
    {
      $set: { text: text },
    }
  ).then(data => {
    const selected = delKeys(data[0]._doc, [('_id', 'uid', '__v')])

    res.status(200).send(selected)
    console.log(`Comment has been Updated ${data}`)
  })
}

const deleteComment = (req, res) => {
  const { postId, commentId } = req.params
  const { uid } = req.body

  Promise.all([
    Comment.findOneAndRemove({
      $and: [{ uid: uid }, { postId: postId }, { commentId: commentId }],
    }),
    Post.findOneAndUpdate(
      {
        $and: [{ uid: uid }, { postId: postId }],
      },
      { $pull: { comments: { $elemMatch: { commentId: commentId } } } }
    ),
  ])
    .then(data => {
      res.status(200).send()
      console.log(`Comment has been Deleted ${data}`)
    })
    .catch(err => res.send(err))
}

export { createComment, readComment, updateComment, deleteComment }
