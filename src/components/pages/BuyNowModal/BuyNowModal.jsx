import React, {useState, useEffect} from 'react';
import Select from 'react-select';
import {sizesArr, sizesOptions} from "../../../constants/texts";
import {selectCart, setCartItemList} from "../../../store/slices/cartSlice";
import {checkoutStripe} from "../../../store/slices/checkoutStripeSlice";
import {saveImageToCollection} from "../../../store/slices/collectionSlice";
import {useCookies} from "react-cookie";
import {useDispatch, useSelector} from "react-redux";
import {getWallet} from "../../../utils/api";
import {fetchImagesList} from "../../../store/slices/collectionSlice";

// import './cartmodal.scss'

const BuyNowModal = ({setCartShowModal, item}) => {
  let cartList = useSelector(selectCart);
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
  const [{accessToken}] = useCookies(['accessToken']);
  const [, setCookie] = useCookies(['wallet']);
  // const [{ wallet }] = useCookies(['wallet']);

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

  const handleIsInCartState = async () => {
    const collectionReq = await dispatch(fetchImagesList(accessToken));
    let itemInCollection = false;
    if (collectionReq) {
      let filteredItems = collectionReq.payload.filter(collectionItem => {
        return collectionItem.imgUrl === item;
      });
      if (filteredItems && filteredItems.length > 0) {
        item = filteredItems[0];
        itemInCollection = true;
      }
    }

    if (!itemInCollection) {
      const saveToCollectionReq = await dispatch(saveImageToCollection({accessToken, imgUrl: item}));
      item = {
        id: saveToCollectionReq.payload.data.id,
        imgUrl: item,
      };
    }

    const data = {
      imgUrl: item.imgUrl,
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
      return item;
    });

    let update;
    if (data && !hasDuplicate) {
      update = [...updatedList, data]
    } else {
      update = updatedList
    }

    hasDuplicate ? dispatch(setCartItemList(update)) : dispatch(setCartItemList(update));
    setCartShowModal(false);

    let walletData;
    let walletReq = await getWallet({accessToken});
    if (walletReq.data.success) {
      walletData = walletReq.data.wallet > 0 ? walletReq.data.wallet : 0;
    }

    if (cartList && cartList.length === 0) {
      cartList = [data];
    } else {
      cartList = update;
    }

    dispatch(checkoutStripe({accessToken, cartList, walletData})).then((res) => {
      if (res && res.payload.status === 200) {
        getWallet({accessToken}).then((data) => {
          setCookie('wallet', data.data.wallet);
          window.location = res.payload.data.url;
        }).catch((e) => console.log(e));
      }
    }).catch((e) => console.log(e));
  }

  return (

    <div className="modal">
      <div className="modal__content">
        <button className="modal__cross" onClick={() => setCartShowModal(false)}/>
        <div className="modal__body">
          <span className="add-cart__span">BUY NOW</span>

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
                {artSize && quantity &&
                  <div className='price-text'>A${(artSize?.price * quantity).toFixed(2)}</div>
                  // <NumberFormat value={artSize?.price * quantity} displayType={'text'} thousandSeparator={true} prefix={'$'} className='price-text' />
                }
                <div className="gst-text">All prices are inclusive of GST</div>
              </div>

              <button className='add-cart-button' disabled={!artSize || !quantity}
                      onClick={handleIsInCartState}>BUY NOW
              </button>

            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default BuyNowModal;
