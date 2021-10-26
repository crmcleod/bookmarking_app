import React from 'react'

const SignIn = ({
    handleUsernameChange,
    userName,
    handlePasswordChange,
    password,
    handleSignedinCheckbox,
    keepSignedIn,
    handleExitSigninModal,
    handleSignInFromForm
}) => {

    const viewPassword = (e) => {
        e.target.checked ?
        document.querySelector('#password').type = 'text' :
        document.querySelector('#password').type = 'password'
    }
    return(

        <div id='signin-wrapper'>
            <form id='signin-form' onSubmit={handleSignInFromForm}>
                <input onChange={handleUsernameChange} value={userName} placeholder='Pick a username' type='text'></input>
                <input onChange={handlePasswordChange} value={password} placeholder='Password' id='password' type='password'></input>
                <span id='keep-signed-in'>
                    <input id='showPassword' type='checkbox' onChange={viewPassword}></input>
                    <label htmlFor='showPassword'>Show password</label>
                </span>
                <span id='keep-signed-in'>
                    <input onChange={handleSignedinCheckbox} checked={keepSignedIn} type='checkbox' name='stay-signed-in'></input>
                    <label for='stay-signed-in'>Keep me signed in</label>
                </span>
                <span id='signin-buttons'>
                    <input type='button' tabIndex='0' onClick={handleExitSigninModal} value='Cancel'/>
                    <input type='submit' tabIndex='0' onClick={handleSignInFromForm} value='Sign in'/>
                </span>
            </form>
        </div>
    
    )
}

export default SignIn