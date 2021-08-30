const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcryptjs')
const app = require('../app')
const api = supertest(app)
const helper = require('./test_helper')
const Blog = require('../models/blog')
const User = require('../models/user')

describe('when there are initially some blogs saved', () => {
  beforeEach(async () => {
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
    test('succeeds with valid data', async () => {
      const newBlog = {
        title: 'newBlog title',
        author: 'newBlog author',
        url: 'newBlog url',
        likes: 0,
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await helper.blogsInDb()
      expect(blogsAtEnd.length).toBe(helper.initialBlogs.length + 1)

      const titles = blogsAtEnd.map((b) => b.title)
      expect(titles).toContain('newBlog title')
    })

    test('likes value is 0 if likes property is missing from the request', async () => {
      const newBlog = {
        title: 'newBlog title without likes',
        author: 'newBlog author without likes',
        url: 'newBlog url without likes',
      }

      await api
        .post('/api/blogs')
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

      await api.post('/api/blogs').send(newBlog).expect(400)

      const blogsAtEnd = await helper.blogsInDb()
      expect(blogsAtEnd.length).toBe(helper.initialBlogs.length)
    })
  })

  describe('deletion of a blog', () => {
    test('succeeds with status code 204 if id is valid', async () => {
      const blog = {
        title: 'newBlogToDelete title',
        author: 'newBlogToDelete author',
        url: 'newBlogToDelete url',
      }

      const response = await api.post('/api/blogs').send(blog)

      await api.delete(`/api/blogs/${response.body.id}`).expect(204)

      const blogsAtEnd = await helper.blogsInDb()
      expect(blogsAtEnd.length).toBe(helper.initialBlogs.length)

      const titles = blogsAtEnd.map((r) => r.title)
      expect(titles).not.toContain(blog.title)
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
})

describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
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
          username: 'root',
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
})

afterAll(() => {
  mongoose.connection.close()
})
