import { Router } from 'express'
import { User } from '../Models'
import { Types, set } from 'mongoose'
import { getKeys, delKeys, setKeys } from '../Helpers/KeysManipulate'

const BASEURL = process.env.BASEURL

const routes = Router()

const validateNewUser = data => {
  const dataToValidate = {}

  if (!data.username) {
    dataToValidate['username'] = Types.ObjectId().toHexString()
  }

  if (!data.photoURL) {
    dataToValidate['photoURL'] = `${BASEURL}/images/default_profile.png`
  }

  if (!data.displayName) {
    dataToValidate['displayName'] = data.username
  }

  if (data.phoneNumber && Object.keys(data.phoneNumber).includes('number')) {
    dataToValidate['phoneNumber'] = { ...data.phoneNumber, default: true }
  }

  return setKeys(data, dataToValidate)
}

const readUser = (req, res) => {
  const { username, uid } = req.body
  let selected = {}

  User.findOne({ $or: [{ username: username }, { uid: uid }] })
    .then(data => {
      if (uid === data.uid) {
        selected = delKeys(data._doc, ['_id', '__v'])
      } else {
        selected = getKeys(data._doc, [
          'username',
          'photoURL',
          'displayName',
          'posts',
          'createdAt',
          'updatedAt',
        ])
      }
      res.status(200).send(selected)
      console.log(`User has been Read ${data}`)
    })
    .catch(err => res.send(err))
}

const createUser = (req, res) => {
  req.body = validateNewUser(req.body)

  User.create(req.body)
    .then(data => {
      const selected = delKeys(data._doc, [('_id', 'uid', '__v')])

      res.status(200).send(selected)
      console.log(`User has been Created`, selected)
    })
    .catch(err => res.send(err))
}

const updateUser = (req, res) => {
  const { uid } = req.params
  User.findOneAndUpdate({ uid: uid }, { $set: { ...req.body } })
    .then(data => {
      res.status(200).send(data)
      console.log(`User has been Updated ${data}`)
    })
    .catch(err => res.send(err))
}

const deleteUser = (req, res) => {
  const { uid } = req.params
  User.findOneAndDelete({ uid: uid })
    .then(data => {
      res.status(200).send()
      console.log(`User has been Deleted ${data}`)
    })
    .catch(err => res.send(err))
}

export { createUser, readUser, updateUser, deleteUser }
