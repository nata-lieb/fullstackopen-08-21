import React from 'react'

const Weather = ({ weather, country }) => (
  <div>
    <h2>Weather in {country.capital || country.name}</h2>
    <div>
      <b>temperature:</b> {weather.temperature} Celcius
    </div>
    <img alt={`${country.name} weather`} src={weather.weather_icons[0]} />
    <div>
      <b>wind:</b> {weather.wind_speed} mph direction {weather.wind_dir}
    </div>
  </div>
)

export default Weather
