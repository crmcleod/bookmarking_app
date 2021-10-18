import React, {useEffect, useState} from 'react'

import axios from 'axios'
import CryptoJS from 'crypto-js'

const ResetPassword = (props) => {

    const [password, setPassword] = useState()
    const [confirmPassword, setConfirmPassword] = useState()
    const [match, setMatch] = useState(false)
    

    const updatePassword = (event) => {
        setPassword(event.target.value)
    };

    const updateConfirmPassword = (event) => {
        setConfirmPassword(event.target.value)
        
    };

    const resetPassword = (event) => {
        if(match){
            event.preventDefault()
            const encryptedPassword = (CryptoJS.SHA3(password)).toString()
            const reqestResetBody = {"token": props.match.params.id, "password": encryptedPassword}
            console.log(reqestResetBody)
            axios.post(process.env.REACT_APP_SERVER_URL+"recover/request_reset", reqestResetBody)}
    };

    const cancel = () => {
        window.location.href='https://bookmarko-client.herokuapp.com/'
    }

    useEffect(() => {
        password === confirmPassword ? setMatch(true) : setMatch(false)
    }, [password, confirmPassword])

    return(
        <>
            <h1>Reset password page</h1>
            <input type='password' onChange={updatePassword} placeholder='New Password'/>
            <input type='password' onChange={updateConfirmPassword} placeholder='Confirm new password'/>
            <input type='button' onClick={resetPassword} value='Confirm'></input>
            <input type='button' onClick={cancel} value='Cancel' />
            {match ? <h2>Passwords match</h2> : <h2>Passwords don't match</h2>}

        </>
    )
}

export default ResetPassword