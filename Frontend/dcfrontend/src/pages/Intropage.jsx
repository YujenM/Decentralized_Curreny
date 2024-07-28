import React from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as icon from '@fortawesome/free-solid-svg-icons';

function Intropage() {
  return (
    <div>
        <h1>Intro Page</h1>
        <FontAwesomeIcon icon={icon.faBook}/>
        <Link type='button' to='/Login'>Login</Link>
        <Link to='/Signup'>Signup</Link>
    </div>
  )
}

export default Intropage