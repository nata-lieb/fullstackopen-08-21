import React, { useState } from 'react'

const Button = ({ text, onClick }) => <button onClick={onClick}>{text}</button>

const StatisticLine = ({ text, value }) => (
  <tr>
    <td>{text}</td>
    <td>{value}</td>
  </tr>
)

const Statistics = ({ good, neutral, bad }) => {
  const all = good + neutral + bad
  return (
    <div>
      <h1>statistics</h1>
      {all === 0 ? (
        <div>No feddback given</div>
      ) : (
        <table>
          <tbody>
            <StatisticLine text={'good'} value={good} />
            <StatisticLine text={'neutral'} value={neutral} />
            <StatisticLine text={'bad'} value={bad} />
            <StatisticLine text={'all'} value={all} />
            <StatisticLine text={'average'} value={(good - bad) / all} />
            <StatisticLine text={'positive'} value={`${(good * 100) / all} %`} />
          </tbody>
        </table>
      )}
    </div>
  )
}

const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <div>
      <h1>give feedback</h1>
      <Button text={'good'} onClick={() => setGood((state) => state + 1)} />
      <Button text={'neutral'} onClick={() => setNeutral((state) => state + 1)} />
      <Button text={'bad'} onClick={() => setBad((state) => state + 1)} />
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  )
}

export default App
