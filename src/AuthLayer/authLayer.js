import React, {useState, useEffect} from 'react'
import MainContainer from '../MainContainer/mainContainer'
import CryptoJs from 'crypto-js'
import axios from 'axios'

const tokenName = 'JWTBookmarkSite'

const AuthLayer = () => {

    const [ newUser, setNewUser ] = useState(false)
    const [ existingUser, setExistingUser ] = useState(false)
    const [ signedOut, setSignedOut ] = useState(true)
    const [ signedIn, setSignedIn ] = useState(false)
    const [ keepSignedIn, setKeepSignedIn ] = useState (false)
    const [ auth, setAuth ] = useState(false)
    const [ authToken, setAuthToken ] = useState()
    const [ ID, setID] = useState()
    const [ firstName, setFirstName ] = useState()
    const [ lastName, setLastName ] = useState()
    const [ password, setPassword ] = useState()
    const [ email, setEmail ] = useState()
    const [ encryptedPassword, setEncryptedPassword ] = useState()
    const [ userName, setUserName ] = useState()

    useEffect(() => {
        handleAuthSetting()
    }, [ID])


    const handleAuthSetting = () => {
        const auth = JSON.parse(localStorage.getItem(tokenName))
        if ( auth ){
            setAuth(auth)
            setID(auth.id)
            setAuthToken(`${auth.tokenType + ' ' + auth.accessToken}`)
        }
    }
    const handleFirstNameChange = (event) => {
        setFirstName(event.target.value)
    }

    const handleLastNameChange = (event) => {
        setLastName(event.target.value)
    }

    const handleUsernameChange = (event) => {
        setUserName(event.target.value)
    }

    const handlePasswordChange = (event) => {
        setPassword(event.target.value)
        setEncryptedPassword((CryptoJs.SHA3(password)).toString())
    }

    const handleEmailChange = (event) => {
        setEmail(event.target.value)
    }

    const handleSignUp = (event) => {
        event.preventDefault()
        axios.post(`${process.env.REACT_APP_SERVER_URL}authenticate/signup`,
            {
            "firstName": firstName,
            "lastName": lastName,
            "username": userName,
            "password": encryptedPassword,
            "email": email,
            "role": ["admin"]
        })
        .then(res => {
            alert(res.data.message)
            setSignedOut(true)
            setNewUser(false)
            setID(null)
            localStorage.setItem(tokenName, JSON.stringify(res.data))
        })
        .then(() => handleAuthSetting())
        .catch(err => console.log(err))
    }

    useEffect(() => {
        handleAuthSetting()
        const signInImmediately = JSON.parse(localStorage.getItem('keep-signed-in-bookmarko'))
        if(!existingUser){
            setUserName(signInImmediately.username)
            setEncryptedPassword(signInImmediately.password)}
        if(userName && encryptedPassword && !existingUser) {
            checkSignedInRequested(signInImmediately)
        } 
    }, [userName, encryptedPassword])

    const checkSignedInRequested = async (object) => {
        if(object.keepsignedin){
            handleSignIn()
        }
    }

    const handleSignInFromForm = (e) => {
        e.preventDefault()
        if(keepSignedIn){
            localStorage.setItem('keep-signed-in-bookmarko', JSON.stringify({keepsignedin: true, username: userName, password: encryptedPassword}))
        } else {
            localStorage.setItem('keep-signed-in-bookmarko', false)
        }
        handleSignIn()
    }

    const handleSignIn = () => {
        axios.post(`${process.env.REACT_APP_SERVER_URL}authenticate/signin`,
        {
            "username": userName,
            "password": encryptedPassword
        })
        .then( res => {
            if(res.data.id) {
                setID(res.data.id)
                localStorage.setItem(tokenName, JSON.stringify(res.data))
            }
        })
        .then(() => handleAuthSetting())
        .then(() => {
            setSignedIn(true)
            setSignedOut(false)
            // change this
            setExistingUser(false)
        })
        .catch( err => console.error(err))

    }

    const handleExitSignupModal = () => {
            setSignedOut(false)
            setNewUser(true)
    }
    const handleExitSigninModal = () => {
        setExistingUser(false); setSignedOut(true)
    }
    
    const handleSignedinCheckbox = (event) => {
        setKeepSignedIn(event.target.checked)
    }
    return(
        <>
        {   signedOut ? 
                <div id='create-signup-wrapper'>
                    <button onClick={() => {setNewUser(true); setSignedOut(false)}}>Create User</button>
                    <button onClick={() => {setExistingUser(true); setSignedOut(false)}}>Sign in</button>
                </div> 
                    : 
                newUser 
                    ? 
                    
                (
                    <div id='sign-up-wrapper'>
                        <form id='signup-form'>
                            <input onChange={handleFirstNameChange} value={firstName} placeholder='First Name' type='text'></input>
                            <input onChange={handleLastNameChange} value={lastName} placeholder='Last name' type='text'></input>
                            <input onChange={handleUsernameChange} value={userName} placeholder='Pick a username' type='text'></input>
                            <input onChange={handlePasswordChange} value={password} placeholder='Password' type='password'></input>
                            <input onChange={handleEmailChange} value={email} placeholder='Email address' type='email'></input>
                            <span>
                                <button onClick={handleExitSignupModal}>Cancel</button>    
                                <button onClick={handleSignUp}>Create account</button>
                            </span>
                        </form>
                    </div>
                )
                    :
                existingUser ?
                    <div id='signin-wrapper'>
                        <form id='signin-form'>
                            <input onChange={handleUsernameChange} value={userName} placeholder='Pick a username' type='text'></input>
                            <input onChange={handlePasswordChange} value={password} placeholder='Password' type='password'></input>
                            <span id='keep-signed-in'>
                                <input onChange={handleSignedinCheckbox} checked={keepSignedIn} type='checkbox' name='stay-signed-in'></input>
                                <label for='stay-signed-in'>Keep me signed in</label>
                            </span>
                            <span>
                                <button onClick={handleExitSigninModal}>Cancel</button>    
                                <button onClick={handleSignInFromForm}>Sign in</button>
                            </span>
                        </form>
                    </div>
                    :
                    signedIn ? 
                    <MainContainer 
                        setID={setID} 
                        id={ID} 
                        active={signedIn} 
                        authToken={authToken} 
                        setSignedIn={setSignedIn} 
                        setSignedOut={setSignedOut} 
                        setExistingUser={setExistingUser} 
                        setEncryptedPassword={setEncryptedPassword}
                        setPassword={setPassword}
                        setUserName={setUserName}
                        />
                :
                null
            }
        </>
    )
}

export default AuthLayer