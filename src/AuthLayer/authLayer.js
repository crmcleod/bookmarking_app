import React, {useState, useEffect} from 'react'
import MainContainer from '../MainContainer/mainContainer'
import CryptoJs from 'crypto-js'
import axios from 'axios'
import SignIn from './signin'
import SignUp from './signUp'
import SignupSignin from './signupSignin'
import ForgottenPassword from './forgottenPassword'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import ResetPassword from './resetPassword'


const tokenName = 'JWTBookmarkSite'

const AuthLayer = () => {

    const [ newUser, setNewUser ] = useState(false)
    const [ signInScreen, setSignInScreen ] = useState(false)
    const [ signedOut, setSignedOut ] = useState(true)
    const [ signedIn, setSignedIn ] = useState(false)
    const [ forgottenPass, setForgottenPass ] = useState(false)
    const [ keepSignedIn, setKeepSignedIn ] = useState (false)
    // eslint-disable-next-line no-unused-vars
    const [ auth, setAuth ] = useState(false)
    const [ authToken, setAuthToken ] = useState()
    const [ ID, setID] = useState()
    const [ firstName, setFirstName ] = useState()
    const [ lastName, setLastName ] = useState()
    const [ password, setPassword ] = useState()
    const [ email, setEmail ] = useState()
    const [ encryptedPassword, setEncryptedPassword ] = useState()
    const [ userName, setUserName ] = useState()
    const [ loading, setLoading ] = useState(true)
    
    const signInImmediately = () => JSON.parse(localStorage.getItem('keep-signed-in-bookmarko'))

    useEffect(() => {
        if(auth && signInImmediately()) {
            setTimeout(() => {
                setSignedOut(false)
                setLoading(false)
            }, 1000)
        } else {
            setTimeout(() => {
                setLoading(false)
            }, 500)
        }
    },[auth])


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
        setEncryptedPassword((CryptoJs.SHA3(event.target.value)).toString())
    }

    const handleEmailChange = (event) => {
        setEmail(event.target.value)
    }

    const handleSignUp = (event) => {
        event.preventDefault()
        axios.post(`${process.env.REACT_APP_SERVER_URL}/authenticate/signup`,
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
        if(!signInScreen && signInImmediately()){
            setUserName(signInImmediately().username)
            setEncryptedPassword(signInImmediately().password)
                if(userName && encryptedPassword && !signInScreen) {
                    checkSignedInRequested(signInImmediately())
        }}
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userName, encryptedPassword])

    const checkSignedInRequested = (object) => {
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
        axios.post(`${process.env.REACT_APP_SERVER_URL}/authenticate/signin`,
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
            setSignInScreen(false)
        })
        .catch( err => console.error(err))

    }

    const handleExitSignupModal = (e) => {
            e.preventDefault()
            setSignedOut(true)
            setNewUser(false)
    }
    const handleExitSigninModal = (event) => {
        event.preventDefault()
        setSignInScreen(false); setSignedOut(true)
    }

    const handleExitReset = () => {
        setSignInScreen(true)
        setSignedOut(true)
        setForgottenPass(false)
    }
    
    const handleSignedinCheckbox = (event) => {
        setKeepSignedIn(event.target.checked)
    }

    if(loading){
        return(
            <div id='loading'>
                <h1>⏱</h1>
            </div>
        )
    }

    return(
        <Router>
            <Switch>
                <Route path="/resetPassword/:id"
                render={(props) => <ResetPassword {...props}/>}/>

            {   signedOut ? 
                    <SignupSignin 
                        setNewUser={setNewUser}
                        setSignedOut={setSignedOut}
                        setSignInScreen={setSignInScreen}
                        setForgottenPass={setForgottenPass}
                    /> 
                    : 
                    newUser 
                    ? 
                    (
                        <SignUp 
                            handleFirstNameChange={handleFirstNameChange}
                            firstName={firstName}
                            handleLastNameChange={handleLastNameChange}
                            lastName={lastName}
                            handleUsernameChange={handleUsernameChange}
                            userName={userName}
                            handlePasswordChange={handlePasswordChange}
                            password={password}
                            handleEmailChange={handleEmailChange}
                            email={email}
                            handleExitSignupModal={handleExitSignupModal}
                            handleSignUp={handleSignUp}
                        />
                    )
                    :
                    signInScreen 
                    ?
                       <SignIn 
                            handleUsernameChange={handleUsernameChange}
                            userName={userName}
                            handlePasswordChange={handlePasswordChange}
                            password={password}
                            handleSignedinCheckbox={handleSignedinCheckbox}
                            keepSignedIn={keepSignedIn}
                            handleExitSigninModal={handleExitSigninModal}
                            handleSignInFromForm={handleSignInFromForm}
                       />
                    :
                    signedIn 
                    ? 
                        <MainContainer
                            setID={setID} 
                            id={ID} 
                            active={signedIn} 
                            authToken={authToken} 
                            setSignedIn={setSignedIn} 
                            setSignedOut={setSignedOut} 
                            setExistingUser={setSignInScreen} 
                            setEncryptedPassword={setEncryptedPassword}
                            setPassword={setPassword}
                            setUserName={setUserName}
                            />
                    :
                    forgottenPass
                    ?
                        <ForgottenPassword
                            setForgottenPass={setForgottenPass}
                            handleExitReset={handleExitReset}
                        />
                    :
                    null
            }
        </Switch>
        </Router>
    )
}

export default AuthLayer