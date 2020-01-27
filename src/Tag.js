import React from 'react'
import './Tag.css'

function Tag ({ children }) {
  return (
    <div className="tag">
      { children }
    </div>
  )
}

export default Tag