import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useDispatch, useSelector } from "react-redux";

import useQuery from "../../../hooks/useQuery";
import { removeUser, selectUser, setUser } from "../../../store/slices/userSlice";
import { getSessionUser } from "../../../utils/session";
import ROUTES from './../../../constants/routes';
import {useHistory} from "react-router-dom";

const useHeader = () => {
  const dispatch = useDispatch();
  const query = useQuery();
  const history = useHistory();

  const user = useSelector(selectUser);
  const [{ accessToken, cookiesAccept }, setCookie, removeCookie] = useCookies(['accessToken', 'cookiesAccept']);
  const [registrationModal, setRegistrationModal] = useState(false);
  const [addCartModal, setCartShowModal] = useState(false);

  const [myAreaList, setMyAreaList] = useState(false);
  const [forgotPasswordModal, setForgotPasswordModal] = useState(false);
  const [resetPasswordModal, setResetPasswordModal] = useState(false);

  useEffect(() => {
    if (accessToken) {
      const sessionUser = getSessionUser(accessToken);
      dispatch(setUser(sessionUser));
    }
  }, [accessToken, dispatch]);

  useEffect(() => {
    window.scrollTo(0, 0)
  }, []);

  useEffect(() => {
    if (query.get('resetToken')) {
      setResetPasswordModal(true);
    }
  }, [query]);

  const handleLogout = () => {
    removeCookie('accessToken');
    removeCookie('alertOnSignUp');
    removeCookie('signupPopup');
    removeCookie('referrlCount');
    dispatch(removeUser());
    history.push(ROUTES.index)    
  }
  const setCookiesAccept = () => {
    setCookie('cookiesAccept', true);
  }
  const state = {
    accessToken,
    myAreaList,
    registrationModal,
    user,
    cookiesAccept,
    forgotPasswordModal,
    resetPasswordModal,
    addCartModal,
  
  };

  const actions = {
    handleLogout,
    setMyAreaList,
    setRegistrationModal,
    setCartShowModal,
    setCookiesAccept,
    setForgotPasswordModal,
    setResetPasswordModal,
  };

  return [state, actions];
}

export default useHeader
