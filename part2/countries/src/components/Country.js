import React from 'react'
import Weather from './Weather'

const Country = ({ country, weather }) => (
  <div>
    <h1>{country.name}</h1>

    <div>capital: {country.capital}</div>
    <div>population: {country.population}</div>

    <h2>languages</h2>
    <ul>
      {country.languages.map((language) => (
        <li key={language.name}>{language.name}</li>
      ))}
    </ul>

    <img alt={`${country.name} flag`} src={country.flag} style={{ maxHeight: '100px' }} />

    {weather.current && <Weather country={country} weather={weather.current} />}
  </div>
)

export default Country
