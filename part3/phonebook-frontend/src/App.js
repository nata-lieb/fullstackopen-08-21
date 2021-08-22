import React, { useState, useEffect } from 'react'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import Notification from './components/Notification'
import * as personService from './services/persons'

const initialMesssage = { text: '', error: false }

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [message, setMessage] = useState(initialMesssage)

  useEffect(() => {
    personService.getAll().then((response) => {
      setPersons(response.data)
    })
  }, [])

  useEffect(() => {
    message.text &&
      setTimeout(() => {
        setMessage(initialMesssage)
      }, 5000)
  }, [message])

  const addPerson = (event) => {
    event.preventDefault()
    const person = persons.find((person) => person.name === newName)
    if (person) {
      window.confirm(`${person.name} is already added to phonebook, replace the old number with a new one?`) &&
        personService
          .update({ ...person, number: newNumber })
          .then((response) => {
            setPersons(persons.map((p) => (p.id === person.id ? response.data : p)))
            setNewName('')
            setNewNumber('')
            setMessage({ text: `Updated ${response.data.name}`, error: false })
          })
          .catch((error) => {
            setMessage({
              text: error.response.data.error,
              error: true,
            })
          })
      return
    }
    personService
      .create({ name: newName, number: newNumber })
      .then((response) => {
        setPersons(persons.concat(response.data))
        setNewName('')
        setNewNumber('')
        setMessage({ text: `Added ${response.data.name}`, error: false })
      })
      .catch((error) => {
        setMessage({
          text: error.response.data.error,
          error: true,
        })
      })
  }

  const removePerson = (id) => {
    const personToDelete = persons.find((person) => person.id === id)
    if (id && window.confirm(`Delete ${personToDelete.name}?`)) {
      personService
        .remove(id)
        .then((response) => {
          response.status === 204 && setPersons(persons.filter((p) => p.id !== id))
        })
        .catch((error) => {
          setMessage({
            text: error.response.data.error,
            error: true,
          })
          setPersons(persons.filter((p) => p.id !== id))
        })
    }
  }

  const handleNameChange = (e) => setNewName(e.target.value)
  const handleNumberChange = (e) => setNewNumber(e.target.value)
  const handleFilterChange = (e) => setFilter(e.target.value)

  const personsToShow =
    filter === '' ? persons : persons.filter((person) => person.name.toLowerCase().includes(filter.toLowerCase()))

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message} />
      <Filter filter={filter} handleFilterChange={handleFilterChange} />
      <h2>add a new</h2>
      <PersonForm
        addPerson={addPerson}
        name={newName}
        number={newNumber}
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}
      />
      <h2>Numbers</h2>
      <Persons persons={personsToShow} removePerson={removePerson} />
    </div>
  )
}

export default App
