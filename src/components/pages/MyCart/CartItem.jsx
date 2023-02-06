import React from 'react';
import {useDispatch} from 'react-redux';
import {confirmAlert} from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

import {setCartItemList} from '../../../store/slices/cartSlice';
import './my-cart.scss';

import removeIcon from '../../../assets/images/remove-64.png';

const CartItem = ({item, index, cartList}) => {
  const dispatch = useDispatch();
  const removeFromCart = () => {
    confirmAlert({
      title: 'Confirm',
      message: 'Are you sure you want to remove this?',
      buttons: [
        {
          label: 'Remove',
          onClick: () => {
            const filteredList = [...cartList];
            filteredList.splice(index, 1);
            dispatch(setCartItemList(filteredList));
          }
        },
        {
          label: 'Cancel',
        }
      ]
    });
  }

  return (
    <div className="my-cart__item">
      <div className="collection-img-wrap">
        <img src={item.imgUrl} alt="img"/>
        <div className="remove" onClick={removeFromCart}><img alt="Remove" src={removeIcon}/></div>
      </div>
      <div className="cart-text">
        <div>{item?.artSize?.size}</div>
        <div>Qty: {item?.quantity}</div>
        {/* <NumberFormat value={item?.quantity * item?.artSize?.price} displayType={'text'} thousandSeparator={true} prefix={'$'} className='price-text' /> */}
        <span className='price-text'>A${(item?.quantity * item?.artSize?.price).toFixed(2)}</span>

      </div>
    </div>
  )
}

export default CartItem;
