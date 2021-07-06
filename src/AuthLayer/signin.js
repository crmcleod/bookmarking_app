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

    return(

        <div id='signin-wrapper'>
        <form id='signin-form'>
            <input onChange={handleUsernameChange} value={userName} placeholder='Pick a username' type='text'></input>
            <input onChange={handlePasswordChange} value={password} placeholder='Password' type='password'></input>
            <span id='keep-signed-in'>
                <input onChange={handleSignedinCheckbox} checked={keepSignedIn} type='checkbox' name='stay-signed-in'></input>
                <label for='stay-signed-in'>Keep me signed in</label>
            </span>
            <span>
                <button onClick={handleSignInFromForm}>Sign in</button>
                <button onClick={handleExitSigninModal}>Cancel</button>    
            </span>
        </form>
    </div>
    
    )
}

export default SignIn