import request from 'supertest'
import { expect } from 'chai'

import app from '../src/app'
import User from '../src/Models/User'

describe('/user', () => {
  beforeEach(async () => {
    await User.deleteMany({})
  })

  describe('GET /user', async () => {
    const users = [
      {
        newUser: true,
        uid: 'u72Fhd8NJBUhjswtBo5KgRJRYSK2',
        email: 'kharisma.azhari02@gmail.com',
        displayName: 'Muhammad Kharisma Azhari',
        photoURL:
          'https://lh3.googleusercontent.com/a-/AAuE7mAzg4kpxyB1N2eby-11Ak92sorJkDRBlYAx4aUdoA=s96-c',
        username: '5d7733abd082ce08b4dc4e26',
        phoneNumber: [],
        posts: [
          {
            postId: '5d7733c6d082ce08b4dc4e28',
          },
        ],
        createdAt: '2019-09-10T05:24:59.044Z',
        updatedAt: '2019-09-10T05:25:59.336Z',
      },
    ]

    await User.insertMany(users)
    console.log(users)

    it('should return a status 200 and valid maximal user config if uid is passed', async () => {
      const uidToCompare = 'u11Fhx8NJBUhjswxBo5KgRJRYSK2'
      const res = await request(app)
        .get('/user')
        .send({ uid: uidToCompare })

      expect(res.status).to.equal(200)
      expect(Object.keys(res.body).length).to.equal(10)
      expect(res.body.uid).to.equal(uidToCompare)
    })

    it('should return a status 200 and valid minimal user config if username is passed', async () => {
      const usernameToCompare = 'u11Fhx8NJBUhjswxBo5KgRJRYSK2'
      const res = await request(app)
        .get('/user')
        .send({ username: usernameToCompare })

      expect(res.status).to.equal(200)
      expect(Object.keys(res.body).length).to.equal(6)
      expect(res.body.username).to.equal(usernameToCompare)
    })
  })
})
