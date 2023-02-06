import React, {useState,useEffect} from 'react'
import {useCookies} from 'react-cookie';
import classNames from 'classnames';
import {useDispatch} from 'react-redux';
import {Link, useHistory} from 'react-router-dom';

import ROUTES from '../../../constants/routes';
import {signUp} from '../../../utils/api';
import {getAccessToken} from '../../../utils/session';
import {closeWindow, openWindow} from '../../../store/slices/signInSlice';
import SocialMedia from '../SocialMedia/SocialMedia';
import useQuery from '../../../hooks/useQuery';

import './register.scss';

import openedEye from '../../../assets/images/password-opened-eye.svg';
import crossedEye from '../../../assets/images/password-crossed-eye.svg';
import FingerprintJS from '@fingerprintjs/fingerprintjs-pro'


const Register = ({setRegistrationModal}) => {

  const dispatch = useDispatch();
  const history = useHistory();
  const query = useQuery();

  const [, setCookie] = useCookies(['accessToken']);
  // const [sessionValue, setSessionValue] = useState();
  
  const [formData, setFormData] = useState({email: '', name: '', password: '', terms: false,});
  
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [passwordButtonVisible, setPasswordButtonVisible] = useState(false);
  const [signupError, setSignupError] = useState(false);

  const disabled = Object.values(formData).filter(Boolean).length < 4;
  
  // const fpPromise = FingerprintJS.load({ apiKey: 'CDNwleLuF9gZRqY7vobp' })

// Get the visitor identifier when you need it.
// useEffect(() =>{
//   fpPromise
//     .then(fp => fp.get())
//     .then(result =>setFormData((prev)=>{
//       return({...prev,
//       user_session:result.visitorId})
//     }))
// },[])

  const handleSignUp = async (formData) => {
    if (query.get('code')) {
      formData.referralCode = query.get('code');
    }
    try {
      const accessToken = await getAccessToken({callback: signUp, formData});
      setSignupError(false);
      setRegistrationModal(false);
      setCookie('accessToken', accessToken);
      setCookie('user_session', "artyst_ai_registered");
    } catch (e) {
      setSignupError(e.response.data.message);
    }
  }

  const handleSubmit = async () => {
    try {
      if (query.get('code')) {
        formData.referralCode = query.get('code');
      }
      await getAccessToken({callback: signUp, formData});
      setSignupError(false);
      setRegistrationModal(false);
      setCookie('user_session', "artyst_ai_registered");
      history.push('/verify-email');
    } catch (e) {
      setSignupError(e.response.data.message);
    }
  }


  return (
    <div className="reg" onClick={() => setPasswordButtonVisible(false)}>
      <div className="reg__content">
        <button className="reg__cross" onClick={() => setRegistrationModal(false)}/>
        <div className="reg__body">
          <span className="sign-up__span">Sign Up</span>
          <SocialMedia
          text={"signup_with"}
            handleSignIn={handleSignUp}
          />
          <span className="or-text">or</span>
          {signupError && (
            <div className="incorrect-input">{signupError}</div>
          )}
          <input className="reginfo" placeholder="Name" type="text"
                 value={formData.name}
                 onChange={(event) => setFormData((prevState) => ({
                   ...prevState,
                   name: event.target.value
                 }))}/>
          <input className="reginfo" placeholder="Email" type="email"
                 value={formData.email}
                 onChange={(event) => setFormData((prevState) => ({
                   ...prevState,
                   email: event.target.value
                 }))}/>
          <div className="password" onClick={(e) => {
            e.stopPropagation();
            setPasswordButtonVisible(true);
          }}>
            <input
              className="reginfo"
              placeholder="Password"
              type={passwordVisible ? "text" : "password"}
              value={formData.password}
              onChange={(event) => setFormData((prevState) => ({
                ...prevState,
                password: event.target.value
              }))}
            />
            <div onClick={() => setPasswordVisible(!passwordVisible)}
                 className={classNames("show-password-button", {["show-password-button__active"]: passwordButtonVisible})}>
              <img src={passwordVisible ? crossedEye : openedEye} alt="eye"/>
            </div>
          </div>
          <div className="check">
            <label className="check__input">
              <input
                type="checkbox"
                value={formData.terms}
                onChange={(event) => setFormData((prevState) => ({
                  ...prevState,
                  terms: !formData.terms
                }))}
              />
              <span className="checkmark"/>
            </label>
            <div className="check__text">By creating an account, you agree to our <Link to={ROUTES.policy}
                                                                                        onClick={() => {
                                                                                          setRegistrationModal(false);
                                                                                        }}>Privacy Policy</Link> and
              our <Link to={ROUTES.terms}
                        onClick={() => {
                          setRegistrationModal(false);
                        }}>Terms & Conditions</Link>.
            </div>
          </div>
          <button id="sign_up_button" className='sign-up-button' disabled={disabled} onClick={handleSubmit}>SIGN UP</button>
          <div className="line" />
          <span className="already">Already have an account? <a href="#" onClick={() => {
            setRegistrationModal(false);
            dispatch(openWindow())
          }}
          >Sign In</a></span>
        </div>
      </div>
    </div>
  )
}

export default Register;
