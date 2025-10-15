import './Home.css';
import React from 'react'

const Home = () => {
  return (
    <>
    <div className="Home-headers">
        <h1 className='Home-head1'>Welcome to PopX</h1>
        <p className='Home-para'>Lorem ipsum dolor sit amet, consectetur adipiscing elit,</p>
        <button className='create-account'><a className='create-account' href="/register">Create Account</a></button>
        <button className='login-link'><a className='login-link' href="/login">Already Registered? Login</a></button>
    </div>
    </>
  )
}

export default Home