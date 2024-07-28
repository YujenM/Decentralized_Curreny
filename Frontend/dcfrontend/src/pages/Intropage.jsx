import React from 'react'
import { Link } from 'react-router-dom'
function Intropage() {
  return (
    <div>
        <h1>Intro Page</h1>
        <Link type='button' to='/Login'>Login</Link>
        <Link to='/Signup'>Signup</Link>
    </div>
  )
}

export default Intropage