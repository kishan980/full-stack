import React, {useState} from 'react'
import {useCookies} from 'react-cookie';
import classNames from 'classnames';
import {useDispatch} from 'react-redux';
import {useHistory} from 'react-router-dom';

import {closeWindow} from '../../../store/slices/contactSlice.js';

import './contact.scss';



const Contact = ({setContactModal}) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({name: '',email: '', description:''});

  const handleSubmit = async () => {
    console.log("coll",formData)
  }


  const disabled = Object.values(formData).filter(Boolean).length < 3;
  return (
    <div className="login" >
      <div className="login__content">
        <button className="login__cross" onClick={() =>{ 
          setContactModal(false)
          }}/>
        <div className="login__body">
          <span className="sign-in__span">Contact Us</span>
          
      
        
          <input
            placeholder="Name"
            type="text"
            value={formData.name}
            onChange={(event) => setFormData((prevState) => ({
              ...prevState,
              name: event.target.value
            }))}
          
          />

          <input
          placeholder="Email"
          type="email"
          value={formData.email}
          onChange={(event) => setFormData((prevState) => ({
            ...prevState,
            email: event.target.value
          }))}
        
        />      
        
        <textArea 
          placeholder="Description"
          value={formData.description}
            onChange={(event) => setFormData((prevState) => ({
              ...prevState,
              description: event.target.value
            }))}
        
        
        />
            
           
      
         
          <button id="sign_in_button" className='sign-in-button' disabled={disabled} onClick={handleSubmit} >Submit</button>
       
      </div>
    </div>
    </div>
  )
}

export default Contact;
