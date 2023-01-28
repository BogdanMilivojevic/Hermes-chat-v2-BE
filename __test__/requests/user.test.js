const path = require('path')
const jwt = require('jsonwebtoken')
const app = require(path.join(__dirname, '../../app.js'))
const request = require('supertest')
const { checkPassword } = require('../../Utils/helpers')
const db = require('../../db/models/index')

const User = db.User

describe('checks if user info is retrieved', () => {
  let token = ''
  beforeAll(async () => {
    const user = await User.create({
      username: 'JohnConnor',
      email: 'johnconnor@test.com',
      password: '123456',
      photoURL: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTF8fGZhY2V8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60'
    })
    token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: `${process.env.JWT_EXPIRES_IN}`
    })
  })
  test('returns status code 200 if user info is retrieved', async () => {
    const res = await request(app).get('/user/me').set('Authorization', `Bearer ${token}`)
    expect(res.statusCode).toEqual(200)
  })
  test('returns status code 403 if jwt is missing', async () => {
    const res = await request(app).get('/user/me')
    expect(res.statusCode).toEqual(403)
  })
})

describe('checks if user can search for another user', () => {
  let token = ''
  beforeAll(async () => {
    const user = await User.create({
      username: 'Jimmy',
      email: 'jimmy@test.com',
      password: '123456',
      photoURL: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTF8fGZhY2V8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60'
    })
    token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: `${process.env.JWT_EXPIRES_IN}`
    })
  })
  test('returns status code 200 and message --User found-- if user is found', async () => {
    const res = await request(app).get('/user/Jimmy').set('Authorization', `Bearer ${token}`)
    expect(res._body.message).toEqual('User found')
  })
  test('returns status code 200 and message --User not found-- if user is not found', async () => {
    const res = await request(app).get('/user/Jacob').set('Authorization', `Bearer ${token}`)
    expect(res._body.message).toEqual('User not found')
  })
  test('returns status code 403 if jwt is missing', async () => {
    const res = await request(app).get('/user/Jimmy')
    expect(res.statusCode).toEqual(403)
  })
})
