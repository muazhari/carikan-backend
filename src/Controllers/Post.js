import { Router } from 'express'
import { Post, User } from '../Models'
import { Types } from 'mongoose'

import { getKeys, delKeys, setKeys } from '../Helpers/KeysManipulate'

const routes = Router()

const validateNewPost = data => {
  const dataToValidate = {}

  if (!data.postId) {
    dataToValidate['postId'] = Types.ObjectId().toHexString()
  }

  return setKeys(data, dataToValidate)
}

const readPost = (req, res) => {
  const toFind = req.body ? req.body : {}
  Post.aggregate([
    { $match: toFind },
    {
      $lookup: {
        from: 'users',
        localField: 'uid',
        foreignField: 'uid',
        as: 'user',
      },
    },
    { $unwind: '$user' },
    {
      $project: {
        postId: 1,
        text: 1,
        images: 1,
        comments: 1,
        createdAt: 1,
        updatedAt: 1,
        'user.username': 1,
        'user.displayName': 1,
        'user.photoURL': 1,
        _id: 0,
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
      },
    },
  ])
    .then(data => {
      res.status(200).send(data)
      console.log(`Post has been Read ${data}`)
    })
    .catch(err => res.send(err))
}

const createPost = (req, res) => {
  validateNewPost(req.body)

  const { uid, postId } = req.body
  Promise.all([
    Post.create(req.body),
    User.findOneAndUpdate(
      { uid: uid },
      { $push: { posts: { postId: postId } } }
    ),
  ])
    .then(data => {
      const selected = delKeys(data[0]._doc, [('_id', 'uid', '__v')])

      res.status(200).send(selected)
      console.log(`Post has been Created ${data}`)
    })
    .catch(err => res.send(err))
}

const updatePost = (req, res) => {
  const { postId } = req.params
  const { uid, text } = req.body
  Post.findOneAndUpdate(
    { $and: [{ postId: postId }, { uid: uid }] },
    {
      $set: { text: text },
    }
  ).then(data => {
    res.status(200).send()
    console.log(`Post has been Updated ${data}`)
  })
}

const deletePost = (req, res) => {
  const postId = req.params.id
  const { uid } = req.body

  Promise.all([
    Post.findOneAndRemove({ $and: [{ postId: postId }, { uid: uid }] }),
    User.findOneAndUpdate(
      { uid: uid },
      { $pull: { posts: { $elemMatch: { postId: postId } } } }
    ),
  ])
    .then(data => {
      res.status(200).send()
      console.log(`Post has been Deleted ${data}`)
    })
    .catch(err => res.send(err))
}

export { createPost, readPost, updatePost, deletePost }
