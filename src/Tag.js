import React from 'react'
import './Tag.css'

function Tag ({ children, number }) {
  return (
    <div className="tag">
      <div className="number">
        { number }
      </div>
      { children }
    </div>
  )
}

export default Tag