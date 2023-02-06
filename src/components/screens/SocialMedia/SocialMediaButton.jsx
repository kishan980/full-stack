import React from "react";

import googleLogo from "../../../assets/images/google_auth.png";
import facebookLogo from "../../../assets/images/facebook_auth.png";
import appleLogo from "../../../assets/images/apple_auth.png";

import  "./social-media.scss";

const LOGOS = {
  google: googleLogo,
  facebook: facebookLogo,
  apple: appleLogo,
}

const capitalizeFirstLetter = (str) => {
    return str[0].toUpperCase() + str.slice(1);
}

const SocialMediaButton = ({ loginAction, name, onClick, disabled }) => (
  <button className={`social-media__item social-media__item--${name}`} onClick={onClick} disabled={disabled}>
    <div className={`social-media__logo social-media__logo--${name}`}>
      <img
        alt={name}
        src={LOGOS[name]}
      />
    </div>
    <span className='text'>{loginAction} with {capitalizeFirstLetter(name)}</span>
  </button>
)

export default SocialMediaButton
