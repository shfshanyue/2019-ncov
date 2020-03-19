import React from 'react'
import './Tag.css'

function Tag ({ children, number,fColor ,increased }) {

  return (
    <div className="tag">
        {
            increased>0?<div style={{fontSize:'60%',display:'inline-flex'}}><div style={{color:`${fColor}`}}>+{increased}</div>&nbsp;today</div>:<div style={{fontSize:'60%',display:'inline-flex'}}><div>&nbsp;</div>&nbsp;</div>
        }
      <div style={{color:`${fColor}`,  fontSize: '1.2rem',
          fontWeight: '600'}} className="number">
        { number }
      </div>
      { children }
    </div>
  )
}

export default Tag