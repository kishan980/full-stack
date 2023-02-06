import React, {useState, useRef, useEffect} from 'react'
import classNames from "classnames";
import {useDispatch} from "react-redux";
import {useCookies} from "react-cookie";
import useHeader from "../../../../screens/Header/useHeader";
import {
  FacebookShareButton,
  LinkedinShareButton,
} from "react-share";
import {
  saveImageToCollection,
  deleteImageFromCollection,
  fetchImagesList
} from "../../../../../store/slices/collectionSlice";
import facebookLogo from "../../../../../assets/images/facebook-logo.png";
import linkedinLogo from "../../../../../assets/images/linkedin-logo.png";
import BuyNowModal from "../../../BuyNowModal/BuyNowModal";
import HouseViewModal from "../../../HouseViewModal/HouseViewModal";
import ReferModal from '../../../ReferModal/ReferModal';
import Download from "../../../../../assets/images/download.svg"
import moment from 'moment/moment';

function useOutsideShare(ref, setOpenShareSelect) {
  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        setOpenShareSelect(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, setOpenShareSelect]);
}

const ResultItem = ({active, handleSelectImage, index, item,buttonId}) => {
  const dispatch = useDispatch();
  const [state, actions] = useHeader();
  const {addCartModal} = state;
  const {setCartShowModal} = actions;
  const [{accessToken, referrlCount}] = useCookies(['accessToken', 'referrlCount']);
  const [added, setAdded] = useState(false);
  const [openedShareSelect, setOpenedShareSelect] = useState(false);
  const [showHouseModal, setOpenHoseModal] = useState(false);
  const [referImage, setReferImage] = useState(false);
  const shareWrapper = useRef(null);
  const buyWrapper = useRef(null);
  useOutsideShare(shareWrapper, setOpenedShareSelect);
 const currentDate = Date.now();
 const newDate = moment(currentDate).format('L');
 
  const handleIsInCollectionState = async () => {
    if (added) {
      
      setAdded(false);
      dispatch(deleteImageFromCollection({accessToken, imgUrl: item})).then(() => {
        dispatch(fetchImagesList(accessToken));

      });
    } else {
      setAdded(true);
      await dispatch(saveImageToCollection({accessToken, imgUrl: item}));
      const data = await dispatch(fetchImagesList(accessToken));
      if ((data.payload.length + 2) % 3 === 0 && referrlCount !== 0) {
        setReferImage(true);
      }
    }
  }


  function forceDownload(url, fileName){
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.responseType = "blob";
    xhr.onload = function(){
        var urlCreator = window.URL || window.webkitURL;
        var imageUrl = urlCreator.createObjectURL(this.response);
        var tag = document.createElement('a');
        tag.href = imageUrl;
        tag.download = fileName;
        document.body.appendChild(tag);
        tag.click();
        document.body.removeChild(tag);
    }
    xhr.send();
}


  return (
    <>
      {referImage && <ReferModal referImage={(referImage) => {
        setReferImage(referImage)
      }}/>}

      <div
        key={`${item}-${index}`}
        className={classNames('result__item', {'result__item--active': active})}
        onClick={handleSelectImage}
      >
        <div className="img_wrap">
          <img src={item} alt="img"/>
        </div>
        <div className="button-wrap">
          <div
            ref={shareWrapper}
            className={openedShareSelect ? "result-share-select result-share-select-opened" : "result-share-select"}
            onClick={() => setOpenedShareSelect(!openedShareSelect)}
          >
            <button id="share_icon" className="result-share" title="Share"/>
            <table className="result-socials">
              <tbody>
              <tr>
                <td className="first">
                  <FacebookShareButton url={item}><img alt="Facebook" src={facebookLogo}/>
                    <div className="divider">&nbsp;</div>
                    FACEBOOK</FacebookShareButton>
                </td>
              </tr>
              <tr>
                <td className="last">
                  <LinkedinShareButton url={item}><img alt="LinkedIn" src={linkedinLogo}/>
                    <div className="divider">&nbsp;</div>
                    LINKEDIN</LinkedinShareButton>
                </td>
              </tr>
              </tbody>
            </table>
          </div>
          <button id={"wish_list" + buttonId}
                  className={added ? "result-add result-add--active" : "result-add"}
                  onClick={handleIsInCollectionState}
                  title={added ? "Remove from My Collection" : "Add to My Collection"}
          />
          <button id={"home_icon" + buttonId} className="home-icon" title="View Art In-Situ" onClick={() => setOpenHoseModal(true)}/>
            <a href="javascript: return false;" onClick={()=>{forceDownload(item,"art_"+newDate+"_")}}  id={"download_image" + buttonId }   className='download-btn' >
        </a>

          <div
            ref={buyWrapper}
            className={"result-select"}
          >
            <button id={"buy"+ buttonId} className={addCartModal ? "select-button choosen" : "select-button"}
                    onClick={() => setCartShowModal(true)}>
              BUY NOW
            </button>
            {addCartModal && (
              <BuyNowModal setCartShowModal={setCartShowModal} item={item}/>)}
            {showHouseModal &&
              <HouseViewModal item={item} setOpenHoseModal={setOpenHoseModal}/>
            }
          </div>
        </div>
      </div>
    </>
  )
}

export default ResultItem;
