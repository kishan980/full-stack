import React from 'react'

import './cookies-accept.scss'
import ROUTES from "../../../constants/routes";
import {Link} from "react-router-dom";

const CookiesAccept = ({setCookiesAccept}) => {
    return(
        <div className="cookies">
            <div className="cookies__text">
                This site uses cookies. By continuing to browse the website, you agree to our use of cookies. <Link to={ROUTES.policy}>Privacy Policy</Link>
            </div>
            <button className="cookies__button" onClick={setCookiesAccept}>ACCEPT</button>
        </div>
    )
}

export default CookiesAccept;
