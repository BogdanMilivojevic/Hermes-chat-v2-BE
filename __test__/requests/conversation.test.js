const path = require('path')
const app = require(path.join(__dirname, '../../app.js'))
const jwt = require('jsonwebtoken')
const request = require('supertest')
const db = require('../../db/models/index')
const { createConversation } = require('../../Utils/helpers')
const User = db.User
const Message = db.Message
const Conversation = db.Conversation

afterAll(async () => {
  await User.destroy({
    truncate: true, cascade: true
  })
  await Conversation.destroy({
    truncate: true, cascade: true
  })
  await Message.destroy({
    truncate: true, cascade: true
  })
})

describe('checks if all conversations are retrieved', () => {
  let tokenAlice = ''
  let tokenJacob = ''
  beforeAll(async () => {
    const alice = await User.create({
      username: 'Alice',
      email: 'alice@test.com',
      password: '123456',
      photoURL: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTF8fGZhY2V8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60'
    })
    tokenAlice = jwt.sign({ id: alice.id }, process.env.JWT_SECRET, {
      expiresIn: `${process.env.JWT_EXPIRES_IN}`
    })
    const bob = await User.create({
      username: 'Bob',
      email: 'bob@test.com',
      password: '123456',
      photoURL: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTF8fGZhY2V8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60'
    })
    const jacob = await User.create({
      username: 'Jacob',
      email: 'jacob555@test.com',
      password: '123456',
      photoURL: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTF8fGZhY2V8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60'
    })
    tokenJacob = jwt.sign({ id: jacob.id }, process.env.JWT_SECRET, {
      expiresIn: `${process.env.JWT_EXPIRES_IN}`
    })

    await createConversation(alice.id, bob.id)
  })
  test('returns status code 200 and conversations if all conversations are retrieved', async () => {
    if (tokenAlice !== '') {
      const res = await request(app).get('/conversation/').set('Authorization', `Bearer ${tokenAlice}`)
      expect(res.statusCode).toEqual(200)
      expect(res._body).toHaveProperty('data')
      expect(res._body.data.length).not.toBeLessThan(0)
    }
  })
  test('returns status code 200 and empty conversation array when there are no conversations', async () => {
    if (tokenJacob !== '') {
      const res = await request(app).get('/conversation/').set('Authorization', `Bearer ${tokenJacob}`)
      expect(res.statusCode).toEqual(200)
      expect(res._body).toHaveProperty('conversations')
      expect(res._body.conversations.length).toEqual(0)
    }
  })
  test('returns status code 403 if jwt is missing', async () => {
    const res = await request(app).get('/conversation/')
    expect(res.statusCode).toEqual(403)
  })
})

describe('checks if messages for a certain conversations are retrieved', () => {
  let patrickToken = ''
  let georgeToken = ''
  let conversationOne = ''
  let conversationTwo = ''
  beforeAll(async () => {
    const patrick = await User.create({
      username: 'Patrick',
      email: 'patrick@test.com',
      password: '123456',
      photoURL: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTF8fGZhY2V8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60'
    })
    patrickToken = jwt.sign({ id: patrick.id }, process.env.JWT_SECRET, {
      expiresIn: `${process.env.JWT_EXPIRES_IN}`
    })
    const stuart = await User.create({
      username: 'Stuart',
      email: 'stuart@test.com',
      password: '123456',
      photoURL: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTF8fGZhY2V8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60'
    })
    const george = await User.create({
      username: 'George',
      email: 'george@test.com',
      password: '123456',
      photoURL: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTF8fGZhY2V8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60'
    })
    georgeToken = jwt.sign({ id: george.id }, process.env.JWT_SECRET, {
      expiresIn: `${process.env.JWT_EXPIRES_IN}`
    })
    conversationOne = await createConversation(stuart.id, patrick.id)
    conversationTwo = await createConversation(stuart.id, george.id)
    await Message.create({
      userId: stuart.id,
      conversationId: conversationOne?.conversationId,
      body: 'Hello how are you'
    })
  })
  test('returns status code 200 if there are messages in a conversation', async () => {
    if (patrickToken !== '') {
      const res = await request(app).get(`/conversation/${conversationOne?.conversationId}`).set('Authorization', `Bearer ${patrickToken}`)
      expect(res.statusCode).toEqual(200)
    }
  })
  test('returns status code 404 if there are no message in a conversation', async () => {
    if (georgeToken !== '') {
      const res = await request(app).get(`/conversation/${conversationTwo?.conversationId}`).set('Authorization', `Bearer ${georgeToken}`)
      expect(res.statusCode).toEqual(404)
    }
  })
  test('returns status code 403 is jwt is missing', async () => {
    const res = await request(app).get(`/conversation/${conversationOne?.conversationId}`)
    expect(res.statusCode).toEqual(403)
  })
})

describe('checks if a new conversation is created', () => {
  let marthaToken = ''
  beforeAll(async () => {
    const martha = await User.create({
      username: 'Martha',
      email: 'martha@test.com',
      password: '123456',
      photoURL: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTF8fGZhY2V8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60'
    })
    marthaToken = jwt.sign({ id: martha.id }, process.env.JWT_SECRET, {
      expiresIn: `${process.env.JWT_EXPIRES_IN}`
    })
  })
  test('returns status code 201 if a new conversation is created', async () => {
    const res = await request(app).post('/conversation/').send({
      searchedUserUsername: 'George'
    }).set('Authorization', `Bearer ${marthaToken}`)

    expect(res.statusCode).toEqual(201)
  })
  test('returns status code 422 if a conversation already exists', async () => {
    const res = await request(app).post('/conversation/').send({
      searchedUserUsername: 'George'
    }).set('Authorization', `Bearer ${marthaToken}`)

    expect(res.statusCode).toEqual(422)
  })
  test('returns status code 403 if jwt is missing', async () => {
    const res = await request(app).post('/conversation/').send({
      searchedUserUsername: 'Patrick'
    })

    expect(res.statusCode).toEqual(403)
  })
})
