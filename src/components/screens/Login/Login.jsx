import React, {useState, useEffect} from 'react'
import {useCookies} from 'react-cookie';
import classNames from 'classnames';
import {useDispatch} from 'react-redux';
import {useHistory} from 'react-router-dom';

import {signIn, userSession} from '../../../utils/api';
import {closeWindow} from '../../../store/slices/signInSlice';
import SocialMedia from '../SocialMedia/SocialMedia';

import './login.scss';

import openedEye from '../../../assets/images/password-opened-eye.svg';
import crossedEye from '../../../assets/images/password-crossed-eye.svg';
import FingerprintJS from '@fingerprintjs/fingerprintjs-pro'


const Login = ({setRegistrationModal, setForgotPasswordModal}) => {
    const dispatch = useDispatch();
    const history = useHistory();

    const [, setCookie] = useCookies(['accessToken']);
    const [formData, setFormData] = useState({email: '', password: ''});
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [passwordButtonVisible, setPasswordButtonVisible] = useState(false);
    const [signinError, setSigninError] = useState(false);
    // const [sessionSetValue, setSessionValuePost] = useState();
    // console.log("🚀 ~ file: Login.jsx ~ line 28 ~ Login ~ sessionSetValue", sessionSetValue)


    // const fpPromise = FingerprintJS.load({apiKey: 'CDNwleLuF9gZRqY7vobp'})
    // useEffect(() => {
    //     fpPromise.then(fp => fp.get()).then(result => setSessionValuePost(result.visitorId))
    // }, [])

    // const sessionFunction = async () => {
    //     await userSession({user_session: sessionSetValue})

    // }

    // useEffect(() => {
    //     if (sessionSetValue) {
    //         sessionFunction()
    //     }
    // }, [sessionSetValue])


    const handleSignIn = async (formData) => {
        try {
            const {data} = await signIn(formData);
            const {
                accessToken,
                alertOnSignUp,
                signupPopup,
                wallet,
                referrlCount
            } = data;
            setSigninError(false);
            setCookie('user_session', "artyst_ai_registered");
            dispatch(closeWindow());
            setCookie('accessToken', accessToken);
            setCookie('alertOnSignUp', alertOnSignUp);
            setCookie('signupPopup', signupPopup);
            setCookie('wallet', wallet);
            setCookie('referrlCount', referrlCount);
        } catch (e) {
            setSigninError(e.response.data.message);
        }
    }

    const handleSubmit = async () => {
        try {
            const {data} = await signIn(formData);
            const {
                accessToken,
                alertOnSignUp,
                signupPopup,
                wallet,
                referrlCount
            } = data;
            setSigninError(false);

            if (accessToken) {
                dispatch(closeWindow());
                if (data.emailVerified) {
                    setCookie('accessToken', accessToken);
                    setCookie('alertOnSignUp', alertOnSignUp);
                    setCookie('signupPopup', signupPopup);
                    setCookie('wallet', wallet);
                    setCookie('referrlCount', referrlCount);
                    // setCookie('user_session', "artyst_ai_registered");
                } else {
                    history.push('/verify-email');
                }
            }
        } catch (e) {
            setSigninError(e.response.data.message);
        }
    }

    const disabled = Object.values(formData).filter(Boolean).length < 2

    return (<div className="login"
        onClick={
            () => setPasswordButtonVisible(false)
    }>
        <div className="login__content">
            <button className="login__cross"
                onClick={
                    () => dispatch(closeWindow())
                }/>
            <div className="login__body">
                <span className="sign-in__span">Sign In</span>
                <SocialMedia text={"signin_with"}
                    handleSignIn={handleSignIn}/>
                <span className="or-text">or</span>
                {
                signinError && (<div className="incorrect-input"> {signinError}</div>)
            }
                <input placeholder="Email" type="email"
                    value={
                        formData.email
                    }
                    onChange={
                        (event) => setFormData((prevState) => ({
                            ...prevState,
                            email: event.target.value
                        }))
                    }/>
                <div className="password"
                    onClick={
                        (e) => {
                            e.stopPropagation();
                            setPasswordButtonVisible(true);
                        }
                }>
                    <input placeholder="Password"
                        type={
                            passwordVisible ? "text" : "password"
                        }
                        value={
                            formData.password
                        }
                        onChange={
                            (event) => setFormData((prevState) => ({
                                ...prevState,
                                password: event.target.value
                            }))
                        }/>
                    <div onClick={
                            () => setPasswordVisible(!passwordVisible)
                        }
                        className={
                            classNames("show-password-button", {["show-password-button__active"]: passwordButtonVisible})
                    }>
                        <img src={
                                passwordVisible ? crossedEye : openedEye
                            }
                            alt="eye"/>
                    </div>
                </div>
                {/* {incorrectInput && (
            <div className="incorrect-input">Email Or Password Entered Incorrectly</div>
          )} */}
                <div className="upper__button">
                    <label className="remember">
                        <span className="remember__text">Remember Me</span>
                        <input type="checkbox"/>
                        <span className="checkmark"/>
                    </label>
                    <div>
                        <a id="forget_password" href="#" className="forgot"
                            onClick={
                                (e) => {
                                    e.stopPropagation();
                                    dispatch(closeWindow());
                                    setForgotPasswordModal(true);
                                }
                        }>Forgot your password?</a>
                    </div>
                </div>
                <button id="sign_in_button" className='sign-in-button'
                    disabled={disabled}
                    onClick={handleSubmit}>SIGN IN</button>
                <div className="line"/>
                <span className="dont">Don't have an account?
                    <a href="#" className="dontSign"
                        onClick={
                            () => {
                                setRegistrationModal(true);
                                dispatch(closeWindow())
                            }
                    }>Sign Up</a>
                </span>
            </div>
        </div>
    </div>)
}

export default Login;
