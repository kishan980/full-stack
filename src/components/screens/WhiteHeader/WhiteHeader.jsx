import React from 'react'
import './white-header.scss'
import logo from '../../../assets/images/white-header-logo.png'
import ROUTES from "../../../constants/routes";
import {Link} from "react-router-dom";
import {useDispatch} from "react-redux";
import {makeHeaderDark} from "../../../store/slices/whiteHeader";

const WhiteHeader = () => {

    const dispatch = useDispatch();
    return(
        <div
            className="white-header"
            onClick={() =>  dispatch(makeHeaderDark())}
        >
            <div className="white-header__logo-prev">
                <Link to={ROUTES.index}>
                    <img
                        src={logo}
                        alt="logo"
                    />
                </Link>
            </div>
        </div>
    );
}

export default WhiteHeader;