import React, {useState} from 'react';
import axios from 'axios';

const ForgottenPassword = ({
    handleExitReset
}) => {

    const [email, setEmail] = useState({"emailRequested": ''})


    const enterEmail = (event) => {
        setEmail({"emailRequested": event.target.value})
    }

    const submitReset = (event) => {
        event.preventDefault();
        axios.post(process.env.REACT_APP_SERVER_URL+"/recover/requestrecovery", email)
    };

    const handleCancel = (event) => {
        handleExitReset()
    }

    return(
        <form id='password-reset-form' onSubmit={submitReset}>
            <h1>Password Reset</h1>
            <p>Enter your email address to reset your password. Note that too many reset attempts will result in your account being locked.</p>
            <div id='label-div'>
                <label id='reset-by-email-label' htmlFor='reset-by-email'>Enter the email address you used to sign up</label>
                <input id='reset-by-email' required={true} type='email' onChange={enterEmail} value={email.emailRequested} placeholder='Your email address'/>
            </div>
            <span>
                <input type='button' className='bookmarko-button' onClick={handleCancel} value='Cancel'/>
                <input type='submit' className='bookmarko-button' value='Confirm'/>
            </span>
        </form>
    )
}

export default ForgottenPassword