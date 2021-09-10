const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const helper = require('./test_helper')
const Blog = require('../models/blog')
const User = require('../models/user')

describe('when there are initially some blogs and users saved', () => {
  let token

  beforeEach(async () => {
    await User.deleteMany({})
    for await (let user of helper.initialUsers) {
      const passwordHash = await helper.getPasswordHash(user.password)
      const userToCreate = new User({ name: user.name, username: user.username, passwordHash })
      await userToCreate.save()
    }

    token = await helper.getAuthToken(helper.initialUsers[0].username)

    await Blog.deleteMany({})
    const blogObjects = helper.initialBlogs.map((blog) => new Blog(blog)).map((blog) => blog.save())
    await Promise.all(blogObjects)
  })

  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body.length).toBe(helper.initialBlogs.length)
  })

  test('unique identifier property of the blog posts is defined as id', async () => {
    const blogsAtStart = await helper.blogsInDb()
    expect(blogsAtStart[0].id).toBeDefined()
    expect(blogsAtStart[0]._id).not.toBeDefined()
  })

  describe('addition of a new blog', () => {
    test('fails without authorization token', async () => {
      const newBlog = {
        title: 'newBlog title',
        author: 'newBlog author',
        url: 'newBlog url',
        likes: 0,
      }

      const result = await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(401)
        .expect('Content-Type', /application\/json/)

      expect(result.body.error).toContain('invalid token')
    })

    test('fails with invalid token', async () => {
      const newBlog = {
        title: 'newBlog title',
        author: 'newBlog author',
        url: 'newBlog url',
        likes: 0,
      }

      const result = await api
        .post('/api/blogs')
        .set('Authorization', 'bearer 23323444')
        .send(newBlog)
        .expect(401)
        .expect('Content-Type', /application\/json/)

      expect(result.body.error).toContain('invalid token')
    })

    test('succeeds with valid data', async () => {
      const newBlog = {
        title: 'newBlog title',
        author: 'newBlog author',
        url: 'newBlog url',
        likes: 0,
      }

      await api
        .post('/api/blogs')
        .set({ Authorization: `bearer ${token}` })
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await helper.blogsInDb()
      expect(blogsAtEnd.length).toBe(helper.initialBlogs.length + 1)

      const titles = blogsAtEnd.map((b) => b.title)
      expect(titles).toContain('newBlog title')
    })

    test('sets user identified by the token as the creator of the blog', async () => {
      const newBlog = {
        title: 'newBlog title',
        author: 'newBlog author',
        url: 'newBlog url',
        likes: 0,
      }

      const username = helper.initialUsers[0].username
      const userToken = await helper.getAuthToken(username)

      const result = await api
        .post('/api/blogs')
        .set({ Authorization: `bearer ${userToken}` })
        .send(newBlog)

      const savedBlogResponse = await api.get(`/api/blogs/${result.body.id}`)
      expect(savedBlogResponse.body.user.username).toBe(username)
    })

    test('likes value is 0 if likes property is missing from the request', async () => {
      const newBlog = {
        title: 'newBlog title without likes',
        author: 'newBlog author without likes',
        url: 'newBlog url without likes',
      }

      await api
        .post('/api/blogs')
        .set({ Authorization: `bearer ${token}` })
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await helper.blogsInDb()
      const savedBlog = blogsAtEnd.find((blog) => blog.title === newBlog.title)
      expect(savedBlog.likes).toBe(0)
    })

    test('fails with status code 400 if data invalid', async () => {
      const newBlog = {
        author: 'no title and url here',
      }

      await api
        .post('/api/blogs')
        .set({ Authorization: `bearer ${token}` })
        .send(newBlog)
        .expect(400)

      const blogsAtEnd = await helper.blogsInDb()
      expect(blogsAtEnd.length).toBe(helper.initialBlogs.length)
    })
  })

  describe('deletion of a blog', () => {

    let newBlogId
    const blog = {
      title: 'newBlogToDelete title',
      author: 'newBlogToDelete author',
      url: 'newBlogToDelete url',
    }

    beforeEach(async () => {
      const response = await api
        .post('/api/blogs')
        .set('Authorization', `bearer ${token}`)
        .send(blog)

      newBlogId = response.body.id
    })

    test('succeeds with status code 204 if id is valid', async () => {
      await api
        .delete(`/api/blogs/${newBlogId}`)
        .set('Authorization', `bearer ${token}`)
        .expect(204)

      const blogsAtEnd = await helper.blogsInDb()
      expect(blogsAtEnd.length).toBe(helper.initialBlogs.length)

      const titles = blogsAtEnd.map((r) => r.title)
      expect(titles).not.toContain(blog.title)
    })

    test('fails with status code 403 if user is not the blog\'s creator', async () => {
      const wrongUserToken = await helper.getAuthToken(helper.initialUsers[1].username)

      await api
        .delete(`/api/blogs/${newBlogId}`)
        .set('Authorization', `bearer ${wrongUserToken}`)
        .expect(403)

      const blogsAtEnd = await helper.blogsInDb()
      expect(blogsAtEnd.length).toBe(helper.initialBlogs.length + 1)

      const titles = blogsAtEnd.map((r) => r.title)
      expect(titles).toContain(blog.title)
    })

    test('fails with status code 401 if token is missing', async () => {
      await api
        .delete(`/api/blogs/${newBlogId}`)
        .expect(401)

      const blogsAtEnd = await helper.blogsInDb()
      expect(blogsAtEnd.length).toBe(helper.initialBlogs.length + 1)

      const titles = blogsAtEnd.map((r) => r.title)
      expect(titles).toContain(blog.title)
    })
  })

  describe('editing of a blog', () => {
    test('increments blog`s likes property by 1 if id is valid', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToEdit = blogsAtStart[0]

      const editedBlog = await api.put(`/api/blogs/${blogToEdit.id}`).expect(200)

      expect(editedBlog.body.likes).toBe(blogToEdit.likes + 1)

      const blogAtEnd = await api.get(`/api/blogs/${blogToEdit.id}`)
      expect(blogAtEnd.body.likes).toBe(blogToEdit.likes + 1)
    })
  })

  describe('creation of a new user', () => {
    test('succeeds with a fresh username', async () => {
      const usersAtStart = await helper.usersInDb()

      const newUser = {
        username: 'mluukkai',
        name: 'Matti Luukkainen',
        password: 'salainen',
      }

      await api
        .post('/api/users')
        .send(newUser)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const usersAtEnd = await helper.usersInDb()
      expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

      const usernames = usersAtEnd.map((u) => u.username)
      expect(usernames).toContain(newUser.username)
    })

    describe('fails with proper statuscode and message', () => {
      test('if username already taken', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
          username: helper.initialUsers[0].username,
          name: 'Superuser',
          password: 'salainen',
        }

        const result = await api
          .post('/api/users')
          .send(newUser)
          .expect(400)
          .expect('Content-Type', /application\/json/)

        expect(result.body.error).toContain('`username` to be unique')

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length)
      })

      test('if username is shorter than 3', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
          username: 'ro',
          name: 'Superuser',
          password: 'salainen',
        }

        const result = await api
          .post('/api/users')
          .send(newUser)
          .expect(400)
          .expect('Content-Type', /application\/json/)

        expect(result.body.error).toContain('shorter than')

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length)
      })

      test('if password is shorter than 3', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
          username: 'newuser',
          name: 'Superuser',
          password: 'sa',
        }

        const result = await api
          .post('/api/users')
          .send(newUser)
          .expect(400)
          .expect('Content-Type', /application\/json/)

        expect(result.body.error).toContain('The password should be at least 3 chars lehgth')

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length)
      })
    })
  })

  describe('login', () => {
    test('succeeds with correct data', async () => {
      const { username, password } = helper.initialUsers[0]
      const result = await api
        .post('/api/login')
        .send({ username: username, password: password })
        .expect(200)
        .expect('Content-Type', /application\/json/)

      expect(result.body).toHaveProperty('token')
    })

    test('fails with wrong username', async () => {
      const result = await api
        .post('/api/login')
        .send({ username: 'unknownuser', password: 'somepassword' })
        .expect(401)
        .expect('Content-Type', /application\/json/)

      expect(result.body.error).toContain('invalid username or password')
    })

    test('fails with wrong password', async () => {
      const { username } = helper.initialUsers[0]
      const result = await api
        .post('/api/login')
        .send({ username, password: 'wrong-password' })
        .expect(401)
        .expect('Content-Type', /application\/json/)

      expect(result.body.error).toContain('invalid username or password')
    })
  })
})

afterAll(() => {
  mongoose.connection.close()
})
