import React, { useEffect} from 'react'
import { useDispatch, useSelector } from "react-redux";
import { useCookies } from "react-cookie";

import { getSessionUser } from "../../../utils/session";
import { setUser } from "../../../store/slices/userSlice";
import { fetchImagesList, selectCollectionList, selectCollectionLoading } from "../../../store/slices/collectionSlice";

import CollectionItem from "./CollectionItem";

import { openWindow } from "../../../store/slices/signInSlice";
import ROUTES from "../../../constants/routes";
import { Link, useHistory } from "react-router-dom";
import { switchToMyCollection } from "../../../store/slices/navColorSlice";
import { makeHeaderDark } from "../../../store/slices/whiteHeader";

import houseCache from "../../../assets/images/house.jpg";
import houseMobileCache from "../../../assets/images/mobile-house1.jpg";
import './my-collection.scss';


const MyCollection = () => {
  const collectionList = useSelector(selectCollectionList);
  const collectionLoading = useSelector(selectCollectionLoading);
  const [{ accessToken }] = useCookies(['accessToken']);
  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    if (accessToken) {
      window.scrollTo(0, 0);
      const sessionUser = getSessionUser(accessToken);
      dispatch(setUser(sessionUser));
      dispatch(fetchImagesList(accessToken));
      dispatch(switchToMyCollection());
      dispatch(makeHeaderDark());
    } else {
      dispatch(openWindow());
      history.push(ROUTES.index);
    }
  }, [accessToken, dispatch, history]);

  return (
    <div className="my-collection">
      <img alt="cache house" style={{display: 'none'}} src={houseCache} />
      <img alt="cache house mobile" style={{display: 'none'}} src={houseMobileCache} />
      {collectionList.length > 0 && (
        <div>
          <div className="my-collection__heading">Welcome to your art collection!</div>
          
            
        </div>
      )}
      {collectionList.length < 1 && (
        <div>
          <div className="my-collection__heading">Your collection is missing something!</div>
          <div className="my-collection__description">Read the <Link to={ROUTES.helpGuide}>composition guide </Link> first, or just click <Link to={ROUTES.createArt}>create art</Link> to start.</div>
        </div>

      )}

      <div className="my-collection__container">
        {!collectionLoading && (
          collectionList.map((item, index) => (
            <>
          
            <CollectionItem key={index} item={item} />
            </>
          ))
        )}
      </div>
    </div>
  )
}

export default MyCollection;
