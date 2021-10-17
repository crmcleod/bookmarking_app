import React, {useState} from 'react';
import axios from 'axios';

const ForgottenPassword = () => {

    const [email, setEmail] = useState({"emailRequested": null})


    const enterEmail = (event) => {
        setEmail({"emailRequested": event.target.value})
    }

    const submitReset = (event) => {
        event.preventDefault();
        axios.post(process.env.REACT_APP_SERVER_URL+"/recover/requestrecovery", email)
    };

    return(
        <form onSubmit={submitReset}>
            <input type='email' onChange={enterEmail} value={email.emailRequested} placeholder='Forgotten your password?'/>
        </form>
    )
}

export default ForgottenPassword