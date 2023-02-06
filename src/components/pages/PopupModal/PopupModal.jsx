import React, {useState, useEffect} from 'react'
import {Link} from "react-router-dom";
import {useCookies} from "react-cookie";

import ROUTES from "../../../constants/routes";
import {cancelCreditPopUp, getCredit} from "../../../utils/api";

import './Popupmodal.scss'

import logo from "../../../assets/images/Artyst_Icon_Mint Reverse-01.png";

const PopupModal = ({}) => {
  const [checkedDigitalArt, setDigitalArt] = useState(false);
  const [open, setOpen] = useState(false);
  const [{
    accessToken,
    signupPopup,
    alertOnSignUp
  }, setCookie] = useCookies(['accessToken', 'signupPopup', 'alertOnSignUp']);

  const onCloseModal = async () => {
    if (checkedDigitalArt) {
      let postData = {
        accessToken,
        isRead: true
      }
      await cancelCreditPopUp(postData);
      let {data} = await getCredit({accessToken});
      setCookie('signupPopup', data.signupPopup);
      setCookie('wallet', data.wallet);
      setCookie('alertOnSignUp', data.alertOnSignUp);
    }
    setOpen(false);
  }

  useEffect(() => {
    setTimeout(() => {
      setOpen(true);
    }, 20000);
  }, [setOpen])

  return (
    <>
      {
        open && (signupPopup === 'false' || signupPopup === undefined) && (alertOnSignUp === '0' || alertOnSignUp === 'false') ?
          <div className="modal msgModal">
            <button className="modal__cross msgModal__cross" onClick={onCloseModal}/>
            <div className="modal__content msgModal__content">
              <div className="msgModal__body">
                <img alt="logo" src={logo} className="header__logo msgModal__logo"/>
                <div className='modalText msgModal__textContent'>
                  <h4 className="add-cart__span  msgModal__heading">READ OUR COMPOSITION GUIDE TO EARN A$100 CREDIT!</h4>
                  <p>Because we want you to understand how to get the best possible results from our platform. read our
                    Composition Guide first.
                    When you reach the bottom of the page and click “Create art” button, you will be automatically credited with A$100 against your first purchase from Artyst.ai
                  </p>
                  <div className="msgModal__takelink">
                    <Link to={ROUTES.helpGuide}>
                      <button className="green-btn" id="popup_model_take_me_there" type="submit">TAKE ME THERE</button>
                    </Link>
                    <div className="dontShowCheck">
                      <label><input type="checkbox" onClick={() => setDigitalArt(true)}/>
                        <span>Don't show again</span></label>
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

export default PopupModal;
