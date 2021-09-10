const blogsRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const Blog = require('../models/blog')
const User = require('../models/user')
const { userExtractor } = require('../utils/middleware')

blogsRouter.get('/', async (request, response, next) => {
  try {
    const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
    response.json(blogs.map((blog) => blog.toJSON()))
  } catch (error) {
    next(error)
  }
})

blogsRouter.get('/:id', async (request, response, next) => {
  try {
    const blog = await Blog.findById(request.params.id).populate('user', { username: 1, name: 1 })
    return blog ? response.json(blog.toJSON()) : response.status(404).end()
  } catch (error) {
    next(error)
  }
})

blogsRouter.post('/', async (request, response, next) => {
  try {
    const body = request.body

    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if (!request.token || !decodedToken.id) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }

    const user = await User.findById(decodedToken.id)

    const blog = new Blog({
      ...body,
      likes: body.likes || 0,
      user: user._id,
    })
    const savedBlog = await blog.save()

    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    return response.status(201).json(savedBlog.toJSON())
  } catch (error) {
    next(error)
  }
})

blogsRouter.delete('/:id', userExtractor, async (request, response, next) => {
  try {
    if (!request.token) return response.status(401).json({ error: 'token is missing' })
    if (!request.user) return response.status(401).json({ error: 'token is invalid' })

    const blog = await Blog.findById(request.params.id)
    const user = await User.findById(request.user)

    if (request.user.toString() !== blog.user.toString()) {
      return response.status(403).json({ error: 'delete is not allowed' })
    }
    await Blog.findByIdAndRemove(request.params.id)

    const newBlogList = user.blogs.filter((blogId) => blogId.toString() !== blog.id.toString())
    await User.findByIdAndUpdate(request.user, { blogs: newBlogList })

    response.status(204).end()
  } catch (error) {
    next(error)
  }
})

blogsRouter.put('/:id', async (request, response, next) => {
  try {
    const blogAtStart = await Blog.findById(request.params.id)

    const blog = {
      likes: blogAtStart.likes + 1,
    }

    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })

    response.json(updatedBlog.toJSON())
  } catch (error) {
    next(error)
  }
})

module.exports = blogsRouter
