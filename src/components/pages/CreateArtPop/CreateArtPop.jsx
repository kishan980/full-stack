import React, {useEffect} from 'react'
import {Link} from 'react-router-dom';

import ROUTES from '../../../constants/routes';

import logo from "../../../assets/images/Artyst_Icon_Mint Reverse-01.png";
import './CreateArtPop.scss';

const CreateArtPopModal = ({creditModalOpen, setCreditModalOpen}) => {
  useEffect(() => {
    let items = JSON.parse(localStorage.getItem('items'));
    if (items && items.success) {
      setCreditModalOpen(true);
    } else {
      setCreditModalOpen(false);
    }
  }, [setCreditModalOpen]);

  const onCloseModal = () => {
    setCreditModalOpen(false);
    localStorage.removeItem('items');
  }

  return (
    <>
      {
        creditModalOpen ?
          <div className="modal msgModal">
            <button className="modal__cross msgModal__cross" onClick={onCloseModal}/>
            <div className="modal__content msgModal__content">
              <div className="modal__body msgModal__body">
                <img alt="logo" src={logo} className="header__logo msgModal__logo"/>
                <div className='msgModal__textContent'>
                  <h4 className="add-cart__span msgModal__heading">CONGRATULATIONS! YOU'VE JUST BEEN CREDITED WITH
                    A$100!</h4>
                  <p>Your credit has been applied to your account and will be deducted when you make your first
                    purchase </p>
                  <Link className="" to={ROUTES.createArt}>
                    <button id="green_btn" className="green-btn" onClick={onCloseModal}>GOT IT</button>
                  </Link>
                </div>
              </div>
            </div>
          </div> : ""
      }
    </>
  )
}

export default CreateArtPopModal;
