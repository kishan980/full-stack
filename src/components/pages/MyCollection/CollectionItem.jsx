import React, { useEffect, useState, useRef } from 'react'

import { useDispatch, useSelector } from "react-redux";
import { useCookies } from "react-cookie";
import {
  FacebookShareButton,
  LinkedinShareButton,
} from "react-share";
import {Helmet} from "react-helmet";
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { deleteImageFromCollection, fetchImagesList } from "../../../store/slices/collectionSlice";
import { formCreatedDate } from "../../../utils/helpers"; import './my-collection.scss'
import HouseViewModal from "../HouseViewModal/HouseViewModal";

import useHeader from "../../screens/Header/useHeader";

import facebookLogo from "../../../assets/images/facebook-logo.png";
import linkedinLogo from "../../../assets/images/linkedin-logo.png";
import removeIcon from "../../../assets/images/remove-64.png"
import AddCartModal from '../AddCartModal/AddCartModal';
import moment from 'moment/moment';
import AWS from 'aws-sdk';

import { Link } from 'react-router-dom';
import { useHistory } from 'react-router-dom';

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

const CollectionItem = ({ item }) => {
  const history = useHistory();

  const dispatch = useDispatch();
  const homeLocation = window.location.protocol + '//' + window.location.host
  const [state, actions] = useHeader();
  const { addCartModal } = state;
  const { setCartShowModal } = actions;
  const { imgUrl, createdAt, id } = item;


  const [{ accessToken }] = useCookies(['accessToken']);
  const [openedShareSelect, setOpenedShareSelect] = useState(false);
  const [showHouseModal, setOpenHoseModal] = useState(false);

  const shareWrapper = useRef(null);
  const buyWrapper = useRef(null);
  useOutsideShare(shareWrapper, setOpenedShareSelect);

  const currentDate = Date.now();
  const newDate = moment(currentDate).format('L');

  const removeFromCollection = () => {
    confirmAlert({
      title: 'Confirm',
      message: 'Are you sure you want to remove this?',
      buttons: [
        {
          label: 'Remove',
          onClick: () => {
            dispatch(deleteImageFromCollection({ accessToken, imgUrl: imgUrl })).then(() => {
              dispatch(fetchImagesList(accessToken));
            });
          }
        },
        {
          label: 'Cancel',
        }
      ]
    });
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

// let forceDownload = url => {
//   let urlArray = url.split("/")
//   console.log("🚀 ~ file: CollectionItem.jsx ~ line 103 ~ forceDownload ~ urlArray", urlArray)
//   let bucket = urlArray[3]
//   console.log("🚀 ~ file: CollectionItem.jsx ~ line 105 ~ forceDownload ~ bucket", bucket)
//   let key = `${urlArray[4]}/${urlArray[5]}`
//   console.log("🚀 ~ file: CollectionItem.jsx ~ line 107 ~ forceDownload ~ key", key)
//   let s3 = new AWS.S3({ params: { Bucket:` artyst-assets` }})
//   console.log("🚀 ~ file: CollectionItem.jsx ~ line 110 ~ forceDownload ~ s3", s3)
//   let params = {Bucket: bucket, Key: key}
//   s3.getObject(params, (err, data) => {
//     let blob=new Blob([data.Body], {type: data.ContentType});
//     let link=document.createElement('a');
//     link.href=window.URL.createObjectURL(blob);
//     link.download=url;
//     link.click();
//   })
  
// }


  return (
    <div className="my-collection__item">
      <Helmet>
      <title>Your Saved Art Collection</title>
      <meta name="description" content="Save your Art to My Collection for reviewing and purchasing it later" />
      <meta name="keywords" content="my collection, art, save, purchase, add to cart"/>
      </Helmet>
      <div className="collection-img-wrap">
        <img src={imgUrl} alt="img" />
        <div className="remove" onClick={removeFromCollection}><img alt="Remove" src={removeIcon} /></div>
      </div>
      <div className="collection-text">
        <div
          ref={shareWrapper}
          className={openedShareSelect ? "share-select share-select-opened" : "share-select"}
          onClick={() => setOpenedShareSelect(!openedShareSelect)}
        >

          <button 
    
          id="my_collection_share_icon" className="share-icon" title="Share" />

          <table className="socials">
            <tbody>
              <tr>
                <td className="first">
                  <FacebookShareButton  url={`https://artystfront-rahhul1.vercel.app?id=${id}`} id={id}><img alt="Facebook" src={facebookLogo} /><div className="divider">&nbsp;</div>FACEBOOK</FacebookShareButton>
                </td>
              </tr>
              <tr>
                <td className="last">
                  <LinkedinShareButton  id={id} url={`https://artystfront-rahhul1.vercel.app?id=${id}`}><img alt="LinkedIn" src={linkedinLogo} /><div className="divider">&nbsp;</div>LINKEDIN</LinkedinShareButton>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <button className="home-icon" id="my_collection_home_icon" title="View Art In-Situ" onClick={() => setOpenHoseModal(true)} />
        <a  href="javascript: return false;" onClick={()=>{forceDownload(imgUrl,"art_"+newDate+"_")}}  id="download_image"   className='download-btn1'  >
        </a>
        <div className="date">{formCreatedDate(createdAt)}</div>

        <div
          ref={buyWrapper}
          className={"collection-select"}
        >

          <button id="my_collection_cart_page" className={addCartModal ? "select-button choosen" : "select-button"} onClick={() => setCartShowModal(true)}>
            ADD TO CART
          </button>
          {addCartModal && (
            <AddCartModal setCartShowModal={setCartShowModal} item={item} />)}
        </div>
        {showHouseModal &&
          <HouseViewModal item={item} setOpenHoseModal={setOpenHoseModal} />
        }
      </div>

    </div>
  )
}

export default CollectionItem;
