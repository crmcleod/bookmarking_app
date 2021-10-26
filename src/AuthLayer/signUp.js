import React from 'react'

const SignUp = ({
    handleFirstNameChange,
    firstName,
    handleLastNameChange,
    lastName,
    handleUsernameChange,
    userName,
    handlePasswordChange,
    password,
    handleEmailChange,
    email,
    handleExitSignupModal,
    handleSignUp
}) => {
    return(
        <div id='sign-up-wrapper'>
            <form id='signup-form' onSubmit={handleExitSignupModal}>
                <input onChange={handleFirstNameChange} value={firstName} placeholder='First Name' type='text'></input>
                <input onChange={handleLastNameChange} value={lastName} placeholder='Last name' type='text'></input>
                <input onChange={handleUsernameChange} value={userName} placeholder='Pick a username' type='text'></input>
                <input onChange={handlePasswordChange} value={password} placeholder='Password' type='password'></input>
                <input onChange={handleEmailChange} value={email} placeholder='Email address' type='email'></input>
                <span id='signup-buttons'>
                    <input type='button' onClick={handleExitSignupModal} value='Cancel'/>    
                    <input type='submit' onClick={handleSignUp} value='Create Account'/>
                </span>
            </form>
        </div>
    )
}

export default SignUp