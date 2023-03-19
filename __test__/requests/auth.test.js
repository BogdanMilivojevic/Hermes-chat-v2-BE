const path = require('path')
const app = require(path.join(__dirname, '../../app.js'))
const request = require('supertest')
const db = require('../../db/models/index')
const User = db.User
const fs = require('fs')
const avatar = fs.readFileSync(path.resolve(__dirname, './apple.jpeg'))

afterAll(async () => {
  await User.destroy({
    truncate: true, cascade: true
  })
})

describe('register', () => {
  test('returns status code 201 if user is created', async () => {
    const res = await request(app).post('/user/register').field('Content-Type', 'multipart/form-data').field('username', 'JohnDoe').field('email', 'johndoe@test.com').field('password', '123456').attach('avatar', avatar, 'avatar.jpg')

    expect(res.statusCode).toEqual(201)
  })
  test('returns bad request if username is missing', async () => {
    const res = await request(app).post('/user/register').send({
      email: 'conor@test.com',
      password: '123456'
    })
    expect(res.statusCode).toEqual(400)
  })
  test('returns bad request if email is missing', async () => {
    const res = await request(app).post('/user/register').send({
      username: 'Conor',
      password: '123456'
    })
    expect(res.statusCode).toEqual(400)
  })
  test('returns bad request if password is missing', async () => {
    const res = await request(app).post('/user/register').send({
      username: 'Conor',
      email: 'conor@test.com'
    })
    expect(res.statusCode).toEqual(400)
  })
  test('returns bad request if image is missing', async () => {
    const res = await request(app).post('/user/register').send({
      username: 'Conor',
      email: 'conor@test.com',
      password: '123456'
    })
    expect(res.statusCode).toEqual(400)
  })
})

describe('login', () => {
  test('returns status code 200 is user had a successful login', async () => {
    const res = await request(app).post('/user/login').send({
      email: 'johndoe@test.com',
      password: '123456'
    })
    expect(res.statusCode).toEqual(200)
  })
  test('returns status code 401 if password is incorrect', async () => {
    const res = await request(app).post('/user/login').send({
      email: 'johndoe@test.com',
      password: '123456789'
    })
    expect(res.statusCode).toEqual(401)
  })
  test('returns status code 401 if email is incorrect', async () => {
    const res = await request(app).post('/user/login').send({
      email: 'johndoe123@test.com',
      password: '123456'
    })
    expect(res.statusCode).toEqual(401)
  })
  test('returns status code 400 if email is missing', async () => {
    const res = await request(app).post('/user/login').send({
      password: '123456'
    })
    expect(res.statusCode).toEqual(400)
  })
  test('returns status code 400 if password is missing', async () => {
    const res = await request(app).post('/user/login').send({
      email: 'johndoe@test.com'
    })
    expect(res.statusCode).toEqual(400)
  })
})
