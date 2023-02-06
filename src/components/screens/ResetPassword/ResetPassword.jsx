import React, {useState} from 'react';
import {useDispatch} from "react-redux";
import {useCookies} from "react-cookie";
import {toast} from "react-toastify";

import useQuery from "../../../hooks/useQuery";
import {resetPassword} from "../../../utils/api";
import {openWindow} from "../../../store/slices/signInSlice";
import openedEye from "../../../assets/images/password-opened-eye.svg";
import crossedEye from "../../../assets/images/password-crossed-eye.svg";

import './reset-password.scss'
import classNames from "classnames";

const ResetPassword = ({setResetPasswordModal}) => {
  const dispatch = useDispatch();
  const [, setCookie] = useCookies(['accessToken']);
  const query = useQuery();

  const [inputValue, setInputValue] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [passwordButtonVisible, setPasswordButtonVisible] = useState(false);

  const handleSubmit = async () => {
    const result = await resetPassword({
      resetToken: query.get('resetToken'),
      password: inputValue,
    });
    if (result.data.success) {
      setCookie('accessToken', result.data.accessToken);
      toast('Password reset successful');
      setResetPasswordModal(false);
    } else {
      toast('Password reset failed');
      setResetPasswordModal(false);
    }
  }

  return (
    <div className="reset-pass" onClick={() => setPasswordButtonVisible(false)}>
      <div className="reset-pass__content">
        <button className="reset-pass__cross" onClick={() => {
          setResetPasswordModal(false)
        }}/>
        <div className="reset-pass__body">
          <span className="reset-pass__span">Reset Password</span>
          <div className="password"  onClick={(e) => {
            e.stopPropagation();
            setPasswordButtonVisible(true);
          }}>
            <input
              placeholder="Password"
              type={passwordVisible ? "text" : "password"}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <div onClick={() => setPasswordVisible(!passwordVisible)}
                 className={classNames("show-password-button", {["show-password-button__active"]: passwordButtonVisible})}>
              <img src={passwordVisible ? crossedEye : openedEye} alt="eye"/>
            </div>
          </div>
          <button
            className='reset-pass__button'
            disabled={inputValue === ''}
            onClick={() => {
              handleSubmit();
            }}
          >
            SET PASSWORD
          </button>
          <div className="line"/>
          <span
            className="back"
            onClick={() => {
              setResetPasswordModal(false);
              dispatch(openWindow());
            }}
          >Back to Sign In</span>
        </div>
      </div>
    </div>
  )
}

export default ResetPassword;
