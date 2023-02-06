import React, {useState, useEffect} from 'react';
import Select from 'react-select';
import {sizesArr, sizesOptions} from "../../../constants/texts";
import {selectCart, setCartItemList} from "../../../store/slices/cartSlice";
import {useDispatch, useSelector} from "react-redux";

import './cartmodal.scss'

const AddCartModal = ({setCartShowModal, item}) => {
  const cartList = useSelector(selectCart);
  const dispatch = useDispatch();

  const customSelectStyles = {
    control: base => ({
      ...base,
      height: 40,
      fontSize: '14px'
    }),
    option: provided => ({
      ...provided,
      fontSize: '12px',
      height: 25,

    }),
    indicatorsContainer: (provided) => ({
      ...provided,
      height: '40px',
    }),
    valueContainer: (provided) => ({
      ...provided,
      height: '40px',
    }),
    input: (provided) => ({
      ...provided,
      margin: '0px',
    }),
    indicatorSeparator: () => ({
      display: 'none',
    }),
  };

  const [artSize, setArtSize] = useState({letter: 'S', size: '30cm x 30cm', price: 390});
  const [quantity, setQtyVal] = useState(1);
  const [checkedDigitalArt, setDigitalArt] = useState(false);

  useEffect(() => {
    if (artSize && quantity && quantity !== '' && quantity > artSize.limit) {
      setQtyVal(parseInt(artSize.limit));
    }
  }, [quantity, artSize]);

  const handleChangeSize = async (event) => {
    const filteredSize = sizesArr.filter(item => item.letter === event.value)[0];
    setArtSize(filteredSize);
  }

  const handleChangeQty = (event) => {
    let qty = event.target.value;
    if (event.target.value < 1)
      qty = '';
    setQtyVal(qty);
  }

  const handleIsInCartState = () => {
    const data = {
      imgUrl: item.imgUrl ? item.imgUrl : item,
      quantity: quantity,
      artSize: {letter: artSize.letter, size: `${artSize.letter} - ${artSize.size}`, price: artSize.price},
      digitalArt: checkedDigitalArt,
      id: item.id
    };

    let updatedList = [...cartList];
    let hasDuplicate = false;

    updatedList = updatedList.map(cartItem => {
      const item = {...cartItem}
      if (cartItem.id === data.id && cartItem.artSize.letter === data.artSize.letter) {
        item.quantity = parseInt(cartItem.quantity) + parseInt(data.quantity)
        hasDuplicate = true;
      }
      return item
    });

    hasDuplicate ? dispatch(setCartItemList(updatedList)) : dispatch(setCartItemList([...updatedList, data]));
    setCartShowModal(false)
  }
  return (

    <div className="modal">
      <div className="modal__content">
        <button className="modal__cross" onClick={() => setCartShowModal(false)}/>
        <div className="modal__body">
          <span className="add-cart__span">ADD TO CART</span>

          <div className="cart-img-wrap">
            <img src={item.imgUrl ? item.imgUrl : item} alt="img"/>
            <div className='cart-form'>
              <input placeholder="Quantity" type="number" value={quantity ? quantity : ''} min=""
                     onChange={(event) => handleChangeQty(event)}/>
              <div className={'select-size'}>
                <Select
                  defaultValue={artSize?.letter}
                  //maxMenuHeight={120}
                  placeholder='S - 30cm x 30cm'
                  onChange={handleChangeSize}
                  options={sizesOptions}

                  styles={customSelectStyles}

                />
              </div>
              <div className="upper__button">
                {/*<label className="digital-art">*/}
                {/*  <span className="digital-art__text">Digital Art</span>*/}
                {/*  <input type="checkbox" onChange={(event) => setDigitalArt(event.target.checked)}/>*/}
                {/*  <span className="checkmark"/>*/}
                {/*</label>*/}
                {artSize && quantity && quantity !== '' &&
                  <div className='price-text'>A${(artSize?.price * quantity).toFixed(2)}</div>
                  // <NumberFormat value={artSize?.price * quantity} displayType={'text'} thousandSeparator={true} prefix={'$'} className='price-text' />
                }

                <div className="gst-text">All prices are inclusive of GST</div>
              </div>

              <button className='add-cart-button' disabled={!artSize || !quantity || quantity === ''}
                      onClick={handleIsInCartState}>ADD TO CART
              </button>

            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default AddCartModal;
