import React from 'react'
import Country from './Country'

const Countries = ({ countries, handleShowCountryClick, weather }) => {
  if (countries.length === 0) return <div>No matches found</div>

  if (countries.length > 10) return <div>Too many matches, specify another filter</div>

  if (countries.length > 1 && countries.length <= 10)
    return countries.map((country) => (
      <div key={country.name}>
        {country.name} <button onClick={() => handleShowCountryClick(country.name)}>show</button>
      </div>
    ))

  if (countries.length === 1) return <Country country={countries[0]} weather={weather} />
}

export default Countries
