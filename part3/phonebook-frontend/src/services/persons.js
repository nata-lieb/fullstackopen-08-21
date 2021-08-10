import axios from 'axios'
const baseUrl = '/api/persons'

export const getAll = () => {
  return axios.get(baseUrl)
}

export const create = (newObject) => {
  return axios.post(baseUrl, newObject)
}

export const update = (newObject) => {
  return axios.put(`${baseUrl}/${newObject.id}`, newObject)
}

export const remove = (id) => {
  return axios.delete(`${baseUrl}/${id}`)
}
