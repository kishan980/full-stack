import React, {useEffect,useState} from 'react'
import { GoogleLogin } from '@react-oauth/google';
import jwtDecode from 'jwt-decode';
import FingerprintJS from '@fingerprintjs/fingerprintjs-pro'
import  './social-media.scss';

const SocialMedia = (props) => {
  const {
    handleSignIn,
    text
  } = props

  const fpPromise = FingerprintJS.load({ apiKey: 'CDNwleLuF9gZRqY7vobp' })
 const [sessionValue ,setSessionValue] = useState();

  useEffect(() =>{
    fpPromise
      .then(fp => fp.get())
      .then(result =>setSessionValue(result.visitorId))   
  
  },[])
  return (
    <div className="social-media">
      <GoogleLogin
      text={text}
        onSuccess={async (credentialResponse) => {
          const credentials = jwtDecode(credentialResponse.credential);
          const sessionUser = {
            googleId: credentials.sub,
            email: credentials.email,
            name: credentials.name ?? null,
            user_session:sessionValue
          };
          await handleSignIn(sessionUser);
        }}
        onError={() => {
          console.log('Login Failed');
        }}
      />
    </div>
  )
}

export default SocialMedia
