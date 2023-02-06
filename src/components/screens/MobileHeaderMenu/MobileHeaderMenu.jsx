import React, {useEffect} from 'react'

import './mobile-header-menu.scss'
import logo from '../../../assets/images/mobile-header-logo-without-text.png'
import {useCookies} from "react-cookie";
import {useDispatch, useSelector} from "react-redux";
import {openWindow} from "../../../store/slices/signInSlice";
import ROUTES from "../../../constants/routes";
import {Link} from "react-router-dom";
import {socialMedias} from "../../../constants/texts";
import {fetchImagesList, selectCollectionList, selectCollectionLoading} from "../../../store/slices/collectionSlice";
import {selectCart} from "../../../store/slices/cartSlice";

const MobileHeaderMenu = ({setHeadMobOpened, handleLogout}) => {
  const collectionList = useSelector(selectCollectionList);
  const collectionLoading = useSelector(selectCollectionLoading);
  const cartList = useSelector(selectCart);

  const dispatch = useDispatch();
  const [{accessToken}] = useCookies(['accessToken']);
  useEffect(() => {
    if (accessToken) {
      dispatch(fetchImagesList(accessToken))
    }
  }, [accessToken, dispatch]);

  return (
    <div className="mobile-header" onClick={(e) => {setHeadMobOpened(false)}}>
      <div className="mobile-header__content">
        <div className="mobile-header__logo mb-logo">
          <Link to={ROUTES.index}>
            <img src={logo} alt="logo"/>
          </Link>
        </div>
        <ul className="mobile-nav">
          <Link to={ROUTES.index}>
            <li className="mobile-nav__item">ABOUT ARTYST.AI</li>
          </Link>
          <Link to={ROUTES.helpGuide}>
            <li className="mobile-nav__item">COMPOSITION GUIDE</li>
          </Link>
          <Link to={ROUTES.createArt}>
            <li className="mobile-nav__item">CREATE ART</li>
          </Link>
          {accessToken &&
            <>
              <Link to={ROUTES.myCollection}>
                <li
                  className={!collectionLoading && collectionList.length > 0 ? "mobile-nav__item" : "mobile-nav__item mobile-nav__item__disabled"}>MY
                  COLLECTION 
                  {/* {!collectionLoading && collectionList.length > 0 ? `(${collectionList.length})` : ''} */}
                  
                  {!collectionLoading && collectionList.length > 0 && (
                    <span>&nbsp;({collectionList.length})
                    </span>) }
                    </li>
                    
              </Link>
              <Link to={ROUTES.myCart}>
                <li
                  className={cartList.length > 0 ? "mobile-nav__item" : "mobile-nav__item mobile-nav__item__disabled"}>
                  MY CART {cartList.length > 0 && (<span>&nbsp;({cartList.length})</span>)}</li>
              </Link>
              <Link to={ROUTES.orders}>
                <li className="mobile-nav__item">MY ACCOUNT</li>
              </Link>
            </>
          }
          {!accessToken ?
            <li className="mobile-nav__item" onClick={() => dispatch(openWindow())}>LOG IN / REGISTER</li>
            :
            <li className="mobile-nav__item" onClick={() => handleLogout()}>LOG OUT</li>
          }
        </ul>

        <ul className="mobile-help">
          <li className="mobile-help__item">
            <Link to={ROUTES.policy}>POLICIES</Link>
          </li>
          <li className="mobile-help__item">
            <Link to={ROUTES.terms}>TERMS & CONDITIONS</Link>
          </li>
          <li className="mobile-help__item">
            <Link to="#">CONTACT US</Link>
          </li>
        </ul>

        <div className="mobile-footer">
          <div className="mobile-footer__copyright">
            © 2022 Artyst.AI Pty Ltd
          </div>
          <ul className="mobile-footer__social">
            {socialMedias.map((item, index) => (
              <li key={index} className={`mobile-footer__social__item ${item.name}`}><a href={item.link}/></li>
            ))}
          </ul>
        </div>

      </div>
    </div>
  )
}

export default MobileHeaderMenu;
