import React, {useEffect} from "react";
import Routes from "./routes";
import jwt_decode from "jwt-decode";
import {useCookies} from "react-cookie";
import smartlookClient from "smartlook-client";
// import ReactGA from 'react-ga';
import {googleAnalyticsActions} from "../src/utils/google_analytics";

const App = () => {
  const [
    {
      accessToken
    }
  ] = useCookies(['accessToken']);
  useEffect(() => {
    smartlookClient.init("e4f199d6e11f955a5a833118c71635dfd13046f8");
  }, []);
  const handleIdentify = () => {
    var {
      id,
      email,
      name
    } = jwt_decode(accessToken);
    smartlookClient.identify(id, {
      name: name,
      email: email
    });
    smartlookClient.record({  ips: true, })
  };
  useEffect(() => {
    if (accessToken) {
      handleIdentify();
    }
  }, []);

  // useEffect(() =>{
  //   ReactGA.initialize('UA-236939229-1');
  //   ReactGA.pageview("/");
  // },[])
  useEffect(() =>{
   googleAnalyticsActions.initGoogleAnalytics('UA-236939229-1')
  },[])
  return (
    <div className="app-component">
      <Routes/>
    </div>
  )
}
export default App;
