import React, {useState, useEffect} from "react";

import info from "../../../../../assets/images/info.png";
import StyleImg1 from "../../../../../assets/images/styleimg1.png";
import StyleImg2 from "../../../../../assets/images/styleimg2.png";
import TrueIcon from "../../../../../assets/images/trueIcon.svg";
import StyleArtModal from "./StyleArtModal";

import "./styleart.scss";
import {useDispatch} from 'react-redux';
import {useSelector} from 'react-redux';
import {setStyle} from "../../../../../store/slices/filesSlice";
import {selectStyle} from './../../../../../store/slices/filesSlice';


function StyleArt() {
  const [open,setOpen] = useState(false);
  const [ClickImageToolTip, setClickImageToolTip]= useState(false)
  const select = useSelector(selectStyle)
  const [style,setstyle] = useState("style_1");
    const dispatch = useDispatch()
    const handleSelect = (data) => {
        dispatch(setStyle(data))

    }

    const handleHandler = () => {
      setOpen(!open);
      setClickImageToolTip(!ClickImageToolTip)
    }

    return (
        <div className="wrap styleart-main">
            <div class="heading">
                <div class="step-title styleart-title">Choose Your style</div>
                <div class="info">
                    <img src={info}
                        alt="img"/>
                </div>
            </div>
            <div className="style-files-container">
                <div className="style-files-container__item mr-21" id="lary">
                    <div className={
                        `style-files-container__item__select ${
                            select === "style_1" ? "d-flex" : ""

                        }`
                    }>
                        <img src={TrueIcon}
                            alt="checked"/>
                    </div>
                    <div className="style-files-container__item__body mr-34">
                        <h2 className="style-files-container__item__body__title">Layr</h2>
                        <img src={StyleImg1}
                            alt="styleimg"/>
                        <span className="style-files-container__item__body__imgart">
                            ARTIST_MARK STOTT
                        </span>
                    </div>
                    <div className="style-files-container__item__body mt-9">
                        <p className="style-files-container__item__body__detail">
                            An exploration of life's complexities through texture and tension, contrast and repetition - resulting in highly textual, organic and intricate art pieces.
                        </p>
                        <button className="style-files-container__item__body__button"
                            onClick={
                                () => handleSelect("style_1")
                        }>
                            CHOOSE
                        </button>
                        <div className="style-files-container__item__body__mobile">
                            <button className="style-files-container__item__body__button style-files-container__item__body__buttonmobile"
                                onClick={
                                    () => handleSelect("style_1")
                            }>
                                <span>LAYR</span>
                            </button>

                            <img src={info}
                                alt="img" onClick={()=>{
                                  handleHandler()
                                }}/>
                        </div>
                    </div>
                </div>

                <div className="style-files-container__item" id="punk_pop">
                    <div className={
                        `style-files-container__item__select ${
                            select === "style_2" ? "d-flex" : ""
                        }`
                    }>
                        <img src={TrueIcon}
                            alt="checked"/>
                    </div>
                    <div className="style-files-container__item__body mr-34">
                        <h2 className="style-files-container__item__body__title">
                            Punk Pop
                        </h2>
                        <img src={StyleImg2}
                            alt="styleimg"/>
                        <span className="style-files-container__item__body__imgart">
                            ARTIST_MARK STOTT
                        </span>
                    </div>
                    <div className="style-files-container__item__body mt-9">
                        <p className="style-files-container__item__body__detail">
                            Influenced by the vibrant anti establishment punk pop album
                                          sleeves of the late 70’s and 80’s. This style is vivid in color
                                          and graphic in texture using more geometric representations of ink
                                          on paper. texture using more geometric represents of ink on paper.
                        </p>
                        <button onClick={
                                () => handleSelect("style_2")
                            }
                            className="style-files-container__item__body__button">
                            CHOOSE
                        </button>
                        <div className="style-files-container__item__body__mobile">
                            <button className="style-files-container__item__body__button style-files-container__item__body__buttonmobile"
                                onClick={
                                    () => handleSelect("style_2")
                            }>
                                <span>Punk Pop</span>
                            </button>
                            <img src={info}
                                alt="img" onClick={()=>{
                                  handleHandler()
                                }}/>
                        </div>
                    </div>
                </div>
               { ClickImageToolTip && open &&(<StyleArtModal  setClickImageToolTip={setClickImageToolTip} handleHandler={handleHandler} handleSelect={handleSelect} style={style}/>)}
            </div>
        </div>
    );
}

export default StyleArt;
