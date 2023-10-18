import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Link } from 'react-router-dom'

function App() {

  // const logInGoogle = async () => await fetch('http://localhost:4010/auth/google', {credentials: 'include'})

  return (
    <>
      <a href='http://localhost:4010/auth/google'>Google</a>
      <br />
      <a href='http://localhost:4010/auth/github'>GitHub</a>
      <br />
      <a href='http://localhost:4010/auth/logout'>LogOut</a>
    </>
  )
}

export default App
