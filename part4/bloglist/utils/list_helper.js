const _ = require('lodash')

const dummy = () => 1

const totalLikes = (blogs) => blogs.reduce((sum, blog) => sum + blog.likes, 0)

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) return
  const blog = blogs.reduce((savedBlog, nextBlog) =>
    nextBlog?.likes ? (savedBlog.likes >= nextBlog.likes ? savedBlog : nextBlog) : savedBlog
  )
  return {
    title: blog.title,
    author: blog.author,
    likes: blog.likes,
  }
}

const mostBlogs = (blogs) => {
  const authors = blogs.reduce((result, blog) => {
    result[blog.author] = result[blog.author] ? ++result[blog.author] : 1
    return result
  }, {})
  return _.reduce(authors, (result, value, key) => (result.blogs >= value ? result : { author: key, blogs: value }), {})
}

const mostLikes = (blogs) => {
  const authors = blogs.reduce((result, blog) => {
    result[blog.author] = result[blog.author] ? result[blog.author] + blog.likes : blog.likes
    return result
  }, {})
  return _.reduce(authors, (result, value, key) => (result.likes >= value ? result : { author: key, likes: value }), {})
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
}
