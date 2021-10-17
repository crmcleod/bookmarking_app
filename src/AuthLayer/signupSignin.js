import React from 'react'

const SignupSignin = ({
    setNewUser,
    setSignedOut,
    setSignInScreen,
    loading,
    setForgottenPass
}) => {
    return(
        <div id='create-signup-wrapper'>
            <button className='filter button-hover' onClick={() => {setNewUser(true); setSignedOut(false)}}>Create Account</button>
            <button className='filter button-hover' onClick={() => {setSignInScreen(true); setSignedOut(false)}}>Sign in</button>
            <button className='filter button-hover' onClick={() => {setSignedOut(false); setForgottenPass(true)}}>I forgot my password 😢</button>
        </div> 
    )
}

export default SignupSignin