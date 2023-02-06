import React, { useState } from "react";
import { useSelector } from "react-redux";
import { selectCollectionList } from "../../../store/slices/collectionSlice";
import qs from "qs";
import { useEffect } from "react";
import { Helmet } from "react-helmet";
import jwt_decode from "jwt-decode";
import { useCookies } from "react-cookie";
import { useLocation } from "react-router-dom";

const CartSharePage = (props) => {
  // let location = useLocation();
  // console.log("🚀 ~ file: CartSharePage.jsx ~ line 13 ~ CartSharePage ~ location", location)
  const Id = qs.parse(props.location.search, { ignoreQueryPrefix: true }).id;
  console.log("🚀 ~ file: CartSharePage.jsx ~ line 15 ~ CartSharePage ~ Id", Id)
  const collectionList = useSelector(selectCollectionList);
  let [stateData, setStateData] = useState([]);

  const [{ accessToken }] = useCookies(["accessToken"]);
  var { name } = jwt_decode(accessToken);

  useEffect(() => {

    const currentArt =
      collectionList &&
      collectionList.filter((item) => item.id === parseInt(Id));
 
    setStateData(currentArt);
  }, []);

  return (

      <Helmet>
  
        <title>{name} art from Artyst</title>

        <meta name="title"  property="og:title" content="[Content title here]" />

        <meta name="type" property="og:type" content="[Content type here]" />

        <meta  property="og:image" content={stateData.imgUrl[0]} />

       <meta  name="url" property='og:url' content={stateData.imgUrl[0]} />

        <meta
          name="description"
          property="og:description"
          content="[Content description here]"
        />
        <meta name="author" content="[Author name here]" />
        
        </Helmet> 


  );
};

export default CartSharePage;
