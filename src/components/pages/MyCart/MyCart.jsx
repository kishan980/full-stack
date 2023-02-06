import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import ReactLoading from "react-loading";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { Helmet } from "react-helmet";

import ROUTES from "../../../constants/routes";
import { selectCart, selectTotalPrice } from "../../../store/slices/cartSlice";
import { checkoutStripe } from "../../../store/slices/checkoutStripeSlice";
import { getWallet } from "../../../utils/api";
import { openWindow } from "../../../store/slices/signInSlice";
import { setUser } from "../../../store/slices/userSlice";
import { getSessionUser } from "../../../utils/session";
import ReferModal from "../ReferModal/ReferModal";
import CartItem from "./CartItem";
import "./my-cart.scss";

const MyCart = () => {
  const [submitting, setSubmitting] = useState(false);
  const cartList = useSelector(selectCart);
  const totalPrice = useSelector(selectTotalPrice);
  const [{ accessToken, wallet }, setCookie] = useCookies([
    "accessToken",
    "wallet",
  ]);
  const history = useHistory();
  const dispatch = useDispatch();
  const [referImage, setReferImage] = useState(false);

  const handleBuy = async () => {
    let walletData;
    let { data } = await getWallet({ accessToken });
    if (data.success) {
      walletData = data.wallet > 0 ? data.wallet : 0;
    }

    dispatch(checkoutStripe({ accessToken, cartList, walletData }))
      .then((res) => {
        if (res && res.payload.status === 200) {
          getWallet({ accessToken })
            .then((data) => {
              setCookie("wallet", data.data.wallet);
              window.location = res.payload.data.url;
            })
            .catch((e) => console.log(e));
        }
      })
      .catch((e) => console.log(e));
  };

  useEffect(() => {
    if (accessToken) {
      window.scrollTo(0, 0);
      const sessionUser = getSessionUser(accessToken);
      dispatch(setUser(sessionUser));
    } else {
      dispatch(openWindow());
      history.push(ROUTES.index);
    }
  }, [accessToken, dispatch, history, cartList]);

  useEffect(() => {
    getWallet({ accessToken }).then((data) => {
      setCookie("wallet", data.data.wallet);
    });
  }, []);

  return (
    <>
      <Helmet>
        <title>My Cart</title>
        <meta name="description" content="Add items in your cart for purchase." />
        <meta name="keywords" content="my cart, purchase, art"/>
      </Helmet>
      {referImage && (
        <ReferModal
          referImage={(referImage) => {
            setReferImage(referImage);
          }}
        />
      )}
      <div className="my-cart">
       
        {cartList.length > 0 && (
          <div>
            <div className="my-cart__heading">My Cart</div>
            <div className="my-cart__description">
              <p> Original Price: A${totalPrice.toFixed(2)}</p>
              <p>Account Credits: A${wallet}</p>

              <p>Total: A${totalPrice.toFixed(2) - wallet}</p>
              {/* <NumberFormat value={totalPrice} displayType={'text'} thousandSeparator={true} prefix={'$'} className='total-cart-price' /> */}
            </div>
          </div>
        )}
        {cartList.length < 1 && (
          <div>
            <div className="my-cart__heading">Your cart is empty now!</div>
          </div>
        )}
        <div className="my-cart__container">
          {cartList.length > 0 &&
            cartList.map((item, index) => (
              <CartItem
                key={index}
                item={item}
                index={index}
                cartList={cartList}
              />
            ))}
        </div>
        {cartList.length > 0 && (
          <button
            type="submit"
            id="my_cart_buy"
            className={
              submitting ? "my-cart__button__disabled" : "my-cart__button"
            }
            onClick={handleBuy}
          >
            {submitting ? (
              <ReactLoading
                type="bubbles"
                color="#8FCEB9"
                height={50}
                width={60}
              />
            ) : (
              "BUY"
            )}
          </button>
        )}
      </div>
    </>
  );
};

export default MyCart;
