import React from 'react'

const SignupSignin = ({
    setNewUser,
    setSignedOut,
    setSignInScreen,
    loading
}) => {
    return(
        <div id='create-signup-wrapper'>
            <button className='filter button-hover' onClick={() => {setNewUser(true); setSignedOut(false)}}>Create Account</button>
            <button className='filter button-hover' onClick={() => {setSignInScreen(true); setSignedOut(false)}}>Sign in</button>
        </div> 
    )
}

export default SignupSignin