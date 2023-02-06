import React, {useState, useEffect} from 'react';
import {useCookies} from 'react-cookie';

import {cancelCreditPopUp, getCredit, sendReferral} from '../../../utils/api';
import './refer.scss';

import logo from '../../../assets/images/Artyst_Icon_Mint Reverse-01.png';
import { toast } from "react-toastify";


const ReferModal = ({referImage}) => {
  const [open, openModal] = useState()
  const [{accessToken, hideReferModal}, setCookie] = useCookies(['accessToken', 'hideReferModal']);
  const [value, setValue] = useState();
  const [incorrectInput, setIncorrectInput] = useState(false);

  const onCloseModal = async () => {
    openModal(false);
    referImage(false);
  }

  const handleSubmit = async () => {
    try{
    if (value.split("@").length<=51) {
      setIncorrectInput(false);
      const postData = {
        inviteList: value.split(","),
        accessToken: accessToken
      }
      let {data} = await sendReferral(postData);
      if (data) {
        onCloseModal()
        openModal(false);
        referImage(false);
        toast("Your Invitation has been sent successfully");
      } else {
        setIncorrectInput(false);
      }
    } else {
      setIncorrectInput(false);
      onCloseModal()
      openModal(false);
      referImage(false);
      toast("You can only enter 50 emails per invite");
    }
  }catch(e){
    onCloseModal()
    openModal(false);
    referImage(false);
    toast(e.response.data.message);
  }
  }

  useEffect(() => {
    openModal(true);
    referImage(true);
    
  }, [open, referImage]);

  return (
    <>
      {
        open && !hideReferModal ?
          <div className="modal msgModal">
            <button className="modal__cross msgModal__cross" onClick={onCloseModal}/>
            <div className='msgModal-outer'>
              <div className="modal__content msgModal__content">
                <div className="modal__body msgModal__body">
                  <img alt="logo" src={logo} className="header__logo msgModal__logo"/>
                  <div className="msgModal__textContent">
                    <h4 className="add-cart__span msgModal__heading">INVITE FRIENDS AND EARN A$200 CREDIT </h4>
                    <p>Yes, you read that right! We'll credit your account with A$20 for every one of your friend's that signs up to Artyst, up to a total of A$200.</p>

                    {incorrectInput && (
                      <div className="incorrect-input">Please enter the valid email</div>
                    )}

                    <textarea className="formField" onChange={(e) => {
                      setValue(e.target.value);
                    }} placeholder="Enter your Friends email addresses. To send multiple invites please enter email ids separated by comma"></textarea>

                    <div className="msgModal__takelink">
                      <button id="invite_button" className="green-btn" onClick={handleSubmit}>INVITE</button>
                      <div className="dontShowCheck"><input type="checkbox" onClick={() => setCookie('hideReferModal', true)}/>
                        <span>Don't show again</span></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div> : ""
      }
    </>
  )
}

export default ReferModal;
