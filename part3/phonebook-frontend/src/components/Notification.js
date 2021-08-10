import React from 'react'

const Notification = ({ message }) => {
  if (!message.text) return null

  const style = {
    background: 'lightgrey',
    fontSize: '20px',
    borderStyle: 'solid',
    borderRadius: '5px',
    padding: '10px',
    marginBottom: '10px',
    color: message.error ? 'red' : 'green',
  }

  return <div style={style}>{message.text}</div>
}

export default Notification
