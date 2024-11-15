import React from 'react'
import spinner from '../Images/output-onlinegiftools.gif';

function Spinner() {
  return (
    <div>
        <img src={spinner} alt="Loading..." style={{ width: '400px', margin: 'auto', display: 'block' }} />
    </div>
  )
}

export default Spinner