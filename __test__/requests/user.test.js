const path = require('path')
const jwt = require('jsonwebtoken')
const app = require(path.join(__dirname, '../../app.js'))
const request = require('supertest')
const db = require('../../db/models/index')
const User = db.User
const Image = db.Image

afterAll(async () => {
  await User.destroy({
    truncate: true, cascade: true
  })
  await Image.destroy({
    truncate: true, cascade: true
  })
})

describe('checks if user info is retrieved', () => {
  let token = ''
  beforeAll(async () => {
    const user = await User.create({
      username: 'JohnConnor',
      email: 'johnconnor@test.com',
      password: '123456'
    })
    await Image.create({
      attachableType: 'user',
      attachableId: user.id,
      key: 'user.jpg'
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
      password: '123456'
    })
    await Image.create({
      attachableType: 'user',
      attachableId: user.id,
      key: 'user.jpg'
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
