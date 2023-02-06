import React, {useEffect, useState} from "react";
import {Link, useHistory} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import classNames from "classnames";
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

import {openWindow, selectSignIn} from "../../../store/slices/signInSlice";
import ROUTES from "../../../constants/routes";
import CookiesAccept from "../CookiesAccept/CookiesAccept";
import Login from "../Login/Login";
import Register from "../Register/Register";
import useHeader from "./useHeader";
import MobileHeaderMenu from "../MobileHeaderMenu/MobileHeaderMenu";
import ForgotPassword from "../ForgotPassword/ForgotPassword";
import ResetPassword from "../ResetPassword/ResetPassword";
import {selectNavColor} from "../../../store/slices/navColorSlice";
import {fetchImagesList, selectCollectionList, selectCollectionLoading} from "../../../store/slices/collectionSlice";
import {getCart, selectTotalPrice, updateCart, selectCartLoading} from "../../../store/slices/cartSlice";
import {selectCart} from "../../../store/slices/cartSlice";
import FingerprintJS from '@fingerprintjs/fingerprintjs-pro'
import './header.scss';

import account_circle from "../../../assets/images/Login Icon.svg";
import logo from "../../../assets/images/Artyst_Landscape_Mint_reverse.png";
import cart from "../../../assets/images/cart-reverse.png";
import {useCookies} from 'react-cookie';
import {userSession} from "../../../utils/api";

const MENU_ITEMS = {
    [ROUTES.index]: 'ABOUT ARTYST.AI',
    [ROUTES.helpGuide]: 'COMPOSITION GUIDE',
    [ROUTES.createArt]: 'CREATE ART'
}
const MENU_ITEMS_ENTRIES = Object.entries(MENU_ITEMS);

const Header = () => {
    const history = useHistory();
    const dispatch = useDispatch();
    const collectionList = useSelector(selectCollectionList);
    const cartList = useSelector(selectCart);
    const totalPrice = useSelector(selectTotalPrice);
    const cartLoading = useSelector(selectCartLoading);
    const collectionLoading = useSelector(selectCollectionLoading);
    const signIn = useSelector(selectSignIn);
    const navColor = useSelector(selectNavColor);

    const [state, actions] = useHeader();
    const [sessionSetValue, setSessionValuePost] = useState();
    const [headMobOpened, setHeadMobOpened] = useState(false);
    const [menuItems, setMenuItems] = useState(MENU_ITEMS_ENTRIES);


    const {
        accessToken,
        myAreaList,
        registrationModal,
        cookiesAccept,
        forgotPasswordModal,
        resetPasswordModal

    } = state;

    const {
        handleLogout,
        setMyAreaList,
        setRegistrationModal,
        setCookiesAccept,
        setForgotPasswordModal,
        setResetPasswordModal

    } = actions;
    // const [{user_session}] = useCookies(['user_session']);
    // const fpPromise = FingerprintJS.load({ apiKey: 'CDNwleLuF9gZRqY7vobp' })
    // useEffect(() =>{
    // fpPromise
    //     .then(fp => fp.get())
    //     .then(result =>setSessionValuePost(result.visitorId))
    // },[])

    // const sessionFunction = async ()=>{
    // const SessionDataNew = await userSession({user_session:sessionSetValue})

    // }

    // useEffect(() =>{
    // if(sessionSetValue){
    // sessionFunction()
    // }
    // })
    useEffect(() => {

        if (accessToken) {

            dispatch(fetchImagesList(accessToken));
            dispatch(getCart(accessToken));
            const MENU_ITEMS = {
                [ROUTES.index]: 'ABOUT ARTYST.AI',
                [ROUTES.helpGuide]: 'COMPOSITION GUIDE',
                [ROUTES.createArt]: 'CREATE ART'
            }
            setMenuItems(Object.entries(MENU_ITEMS));
        } else {
            const MENU_ITEMS = {
                [ROUTES.index]: 'ABOUT ARTYST.AI',
                [ROUTES.helpGuide]: 'COMPOSITION GUIDE',
                [ROUTES.createArt]: 'CREATE ART'
            }
            setMenuItems(Object.entries(MENU_ITEMS));
        }
    }, [accessToken, dispatch]);


    useEffect(() => {
        if (! cartLoading) {
            dispatch(updateCart({accessToken, list: cartList, totalPrice}));
        }

    }, [
        dispatch,
        cartLoading,
        accessToken,
        cartList,
        totalPrice
    ]);

    return (
        <div className="header-wrapper">

            <div className="header"
                onClick={
                    () => {
                        if (headMobOpened) {

                            setHeadMobOpened(false);
                        }
                        setMyAreaList(false);
                    }
            }>
                <ToastContainer/>
                <Link to={
                    ROUTES.index
                }>
                    <img alt="logo"
                        src={logo}
                        className="header__logo"/>
                </Link>

                <div className={
                    classNames("header__content", {"open": headMobOpened})
                }>
                    <ul className="nav">

                        {
                        menuItems.map(([key, value]) => (
                            <Link to={key}
                                key={key}>
                                <li id={
                                        value.replace(" ", "_").replace(".", "_").toLowerCase() + '_top_menu'
                                    }

                                    className={
                                        classNames('', {
                                            'mint': navColor === value
                                        })
                                    }
                                    onClick={
                                        () => setHeadMobOpened(false)
                                }>
                                    {value} </li>


                            </Link>
                        ))
                    }
                        {
                        accessToken && (
                            <Link to={
                                ROUTES.myCollection
                            }>
                                <li id="my_collection_to_menu"
                                    className={
                                        classNames('', {
                                            'mint': navColor === 'MY COLLECTION'
                                        })
                                    }
                                    onClick={
                                        () => setHeadMobOpened(false)
                                }>MY
                                                  COLLECTION {
                                    ! collectionLoading && collectionList.length > 0 ? `(${
                                        collectionList.length
                                    })` : ''
                                }</li>
                            </Link>
                        )
                    } </ul>

                    {
                    accessToken ? (
                        <>
                            <Link to={
                                    ROUTES.myCart
                                }
                                className="cart"
                                id="cart">
                                <img id="home_page_cart_icon"
                                    src={cart}
                                    className="cart-icon"
                                    alt="Shopping Cart"/> {
                                cartList.length > 0 && (
                                    <div className="cart-badge">
                                        {
                                        cartList.length
                                    }</div>
                                )
                            } </Link>
                            <div className={
                                    classNames("my-area", {"area-active": myAreaList})
                                }
                                onClick={
                                    (e) => {
                                        e.stopPropagation()
                                        setMyAreaList(!myAreaList)
                                    }
                            }>
                                <button className="my-area__button">
                                    <img src={account_circle}
                                        alt="img"
                                        id="account_circle_image"/>
                                </button>
                                <ul className="my-area__list">
                                    <li id="my_account_top_menu"
                                        onClick={
                                            () => {
                                                history.push(ROUTES.orders);
                                                setHeadMobOpened(false);
                                            }
                                    }>My Account
                                    </li>
                                    <li id="logout_top_menu"
                                        onClick={
                                            () => {
                                                handleLogout();
                                                setHeadMobOpened(false);
                                            }
                                    }>Log Out
                                    </li>
                                </ul>
                            </div>
                        </>
                    ) : (

                        <div className="iden">
                            <button className="log-in"
                                onClick={
                                    () => {

                                        dispatch(openWindow())


                                        setRegistrationModal(true);


                                        setHeadMobOpened(false);
                                    }
                            }>LOGIN / REGISTER
                            </button>
                        </div>
                    )
                }

                    <button className="header__burger-button"
                        onClick={
                            () => setHeadMobOpened(true)
                    }>
                        <div className="header__burger-button__line"/>
                        <div className="header__burger-button__line"/>
                        <div className="header__burger-button__line"/>
                    </button>
                </div>

                {
                headMobOpened && (
                    <MobileHeaderMenu setHeadMobOpened={setHeadMobOpened}
                        handleLogout={handleLogout}/>
                )
            }

                {
                signIn && (
                    <Login setRegistrationModal={setRegistrationModal}
                        setForgotPasswordModal={setForgotPasswordModal}/>
                )
            }
                {
                registrationModal && (
                    <Register setRegistrationModal={setRegistrationModal}/>
                )
            }
                {
                !cookiesAccept && (
                    <CookiesAccept setCookiesAccept={setCookiesAccept}/>
                )
            }
                {
                forgotPasswordModal && (
                    <ForgotPassword setForgotPasswordModal={setForgotPasswordModal}/>
                )
            }
                {
                resetPasswordModal && (
                    <ResetPassword setResetPasswordModal={setResetPasswordModal}/>
                )
            } </div>
        </div>
    )
}

export default Header
