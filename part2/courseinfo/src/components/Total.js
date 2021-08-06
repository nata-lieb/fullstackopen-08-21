import React from 'react'

const Total = ({ parts }) => <b>Total of {parts.reduce((total, part) => total + part.exercises, 0)} exercises</b>

export default Total
