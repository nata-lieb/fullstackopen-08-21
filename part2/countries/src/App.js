import React, { useState, useEffect } from 'react'
import axios from 'axios'

import Filter from './components/Filter'
import Countries from './components/Countries'

const apiKey = process.env.REACT_APP_API_KEY

function App() {
  const [countries, setCountries] = useState([])
  const [filter, setFilter] = useState('')
  const [weather, setWeather] = useState({})

  const countriesFiltered = countries.filter((country) => country.name.toLowerCase().includes(filter.toLowerCase()))

  useEffect(() => {
    axios.get('https://restcountries.eu/rest/v2/all').then((response) => setCountries(response.data))
  }, [])

  useEffect(() => {
    if (countriesFiltered.length === 1) {
      setWeather({})
      const weatherUrl = `http://api.weatherstack.com/current?access_key=${apiKey}&query=${countriesFiltered[0]?.capital
        .split('.')
        .join('')},${countriesFiltered[0].name}`
      axios.get(weatherUrl).then((response) => setWeather(response.data))
    } else if (weather.current) {
      setWeather({})
    }
  }, [countriesFiltered.length, countriesFiltered[0]?.name])

  const handleFilterChange = (event) => setFilter(event.target.value)
  const handleShowCountryClick = (name) => setFilter(name)

  return (
    <div>
      <Filter filter={filter} handleFilterChange={handleFilterChange} />
      <Countries countries={countriesFiltered} handleShowCountryClick={handleShowCountryClick} weather={weather} />
    </div>
  )
}

export default App
