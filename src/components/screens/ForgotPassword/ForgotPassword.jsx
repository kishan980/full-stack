import React, { useState } from 'react';
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

import { forgotPassword } from "../../../utils/api";
import { openWindow } from "../../../store/slices/signInSlice";

import './forgot-password.scss'

const ForgotPassword = ({ setForgotPasswordModal }) => {
  const dispatch = useDispatch();
  const [inputValue, setInputValue] = useState('');
  const [resetError, setResetError] = useState(false);

  const handleSubmit = async () => {
    try {
      const result = await forgotPassword({ email: inputValue });
      if (result.data.success) {
        toast('Password reset email sent');
        setForgotPasswordModal(false);
      }
    } catch (e) {
      setResetError(e.response.data.message);
    }
  }

  return (
    <div className="forgot-pass">
      <div className="forgot-pass__content">
        <button className="forgot-pass__cross" onClick={() => {
          setForgotPasswordModal(false)
        }} />
        <div className="forgot-pass__body">
          <span className="forgot-pass__span">Forgot Password</span>
          {resetError && (
            <div className="incorrect-input">{resetError}</div>
          )}
          <input
            placeholder="Email"
            type="email"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <button
            id="forget_password_page"
            className='forgot-pass__button'
            disabled={inputValue === ''}
            onClick={() => {
              handleSubmit();
            }}
          >
            RESET PASSWORD
          </button>
          <div className="line" />
          <span
          id="back_to_sing_in_link"
            className="back"
            onClick={() => {
              setForgotPasswordModal(false);
              dispatch(openWindow());
            }}
          >Back to Sign In</span>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword;
