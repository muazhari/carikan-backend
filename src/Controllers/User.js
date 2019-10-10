import { Router } from 'express'
import { User } from '../Models'
import { Types } from 'mongoose'

const BASEURL = process.env.BASEURL

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

const validateNewUser = data => {
  if (!data.username) {
    data.username = Types.ObjectId().toHexString()
  }

  if (data.phoneNumber && Object.keys(data.phoneNumber).includes('number')) {
    data.phoneNumber = { ...data.phoneNumber, default: true }
  }

  if (!data.photoURL) {
    data.photoURL = `${BASEURL}/images/default_profile.png`
  }

  if (!data.displayName) {
    data.displayName = data.username
  }
}

routes.get('/', (req, res) => {
  // User.find({})
  //   .then(data => res.send(data))
  //   .catch(err => res.send(err))
  const { username, uid } = req.body
  User.findOne({ $or: [{ username: username }, { uid: uid }] })
    .then(data => {
      if (req.body.uid === data.uid) {
        const selected = excludeAndValidate(['_id', '__v'], data._doc)
        res.send(selected)
      } else {
        const selected = pickAndValidate(
          ['photoURL', 'displayName', 'posts', 'createdAt', 'updatedAt'],
          data._doc
        )
        res.send(selected)
      }
      console.log(`User has been Read ${data}`)
    })
    .catch(err => res.send(err))
})

routes.post('/', (req, res) => {
  validateNewUser(req.body)

  User.create(req.body)
    .then(data => {
      const selected = excludeAndValidate(['_id', 'uid', '__v'], data._doc)
      res.send(selected)
      console.log(`User has been Created`, selected)
    })
    .catch(err => res.send(err))
})

routes.put('/:uid', (req, res) => {
  const uid = req.params.uid
  User.findOneAndUpdate({ uid: uid }, { $set: { ...req.body } })
    .then(data => {
      res.send(data)
      console.log(`User has been Updated ${data}`)
    })
    .catch(err => res.send(err))
})

routes.delete('/:uid', (req, res) => {
  const uid = req.params.uid
  User.findOneAndDelete({ uid: uid })
    .then(data => {
      res.send()
      console.log(`User has been Deleted ${data}`)
    })
    .catch(err => res.send(err))
})

export default routes
