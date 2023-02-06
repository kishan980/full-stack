import React, {useEffect} from 'react';
import {useDispatch} from 'react-redux';
import {useCookies} from 'react-cookie';
import {Link, useHistory} from 'react-router-dom';

import {openWindow} from '../../../store/slices/signInSlice';
import {clearCartList, getCart, updateCart} from '../../../store/slices/cartSlice';
import {getWallet} from '../../../utils/api';
import ROUTES from '../../../constants/routes';

import './thankyou.scss';

const Thankyou = () => {
  const history = useHistory();
  const dispatch = useDispatch()
  const [{accessToken}, setCookie] = useCookies(['accessToken', 'wallet']);

  useEffect(() => {
    if (!accessToken) {
      dispatch(openWindow());
      history.push(ROUTES.index);
    } else {
      dispatch(clearCartList());
      dispatch(updateCart({accessToken, list: [], totalPrice: 0})).then(() => {
        dispatch(getCart(accessToken));
      });
      getWallet({accessToken}).then((data) => {
        setCookie('wallet', data.data.wallet);
      });
    }
  }, [dispatch, history, accessToken, setCookie]);


  return (
    <div className="thank-you">
      <div className="heading">Thank you for your purchase. Your art will arrive within 15 business days<sup>*</sup>
      </div>
      <div className="text"><sup>*</sup>For further information about your order, please refer to our <Link
        to={ROUTES.policy}>Policies</Link> and/or the order invoice that we have emailed you.
      </div>
      <div className="button-wrap">
        <Link to={ROUTES.createArt}>
          <button className="button">CREATE ART</button>
        </Link>
      </div>
    </div>
  )
}
export default Thankyou
