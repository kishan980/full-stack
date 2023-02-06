import React from 'react';
import {Link} from 'react-router-dom';
import {useDispatch} from 'react-redux';
import ROUTES from '../../../constants/routes';
import {socialMedias} from '../../../constants/texts';
import {openWindow, selectContact} from "../../../store/slices/contactSlice";
import Contact from "../contact/Contact";
import { useSelector } from 'react-redux';
import './footer.scss';
import { useState } from 'react';



const Footer = () =>{

   const  [contactModal, setContactModal] = useState(false);
  const contactIn = useSelector(selectContact);

  const dispatch = useDispatch();

  
  return (<div className="footer">

    <ul className="footer__help">
      <li id="policies_bottom_nav_menu">
        <Link to={ROUTES.policy}>POLICIES</Link>
      </li>
      <li id="term_condition__bottom_nav_menu">
        <Link to={ROUTES.terms}>TERMS & CONDITIONS</Link>
      </li>
      <li id="contact_us__bottom_nav_menu">
      <button 
       onClick={() => {
        setContactModal(true);
        dispatch(openWindow())
      }} 
     >CONTACT US</button>
      </li>
    </ul>

    <ul className="footer__social-medias">
      {socialMedias.map((item) => (
        <li  key={item.name} className={item.name} id={item.name +"_bottom_link"}><a href={item.link} target="_blank"/></li>
      ))}
    </ul>

    <div className="footer__copyright">
      © {new Date().getUTCFullYear()} Artyst.AI Pty Ltd
    </div>
    
    {contactModal  &&  (
    
      <Contact setContactModal={setContactModal}/>
    )}
  </div>)
      }



// <a href="mailto:hi@artyst.ai?subject=Artyst.ai website query" target="_blank">CONTACT US</a>
export default Footer