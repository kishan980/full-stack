import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { selectResultsList, setChoice } from "../../../../../store/slices/resultsSlice";

import ResultItem from "./ResultItem";

import houseCache from "../../../../../assets/images/house.jpg";
import houseMobileCache from "../../../../../assets/images/mobile-house1.jpg";


const Result = () => {
  const buttons = [
    '_A',
    '_B',
    '_C'
  ]
  const dispatch = useDispatch();
  const resultsList = useSelector(selectResultsList);

  const [radio, setRadio] = useState(-1)

  return (
    <div className="result__container">
      <img alt="cache house" style={{display: 'none'}} src={houseCache} />
      <img alt="cache house mobile" style={{display: 'none'}} src={houseMobileCache} />
      <span className="span_we">Your art is ready</span>
      <span className="span_select">You can either ‘1 click’ purchase, save to My Collection, share socially or can also just Re-Create another 3 compositions. Alternatively, try experimenting with color or moving the images around in the A/B/C slots</span>
        <div className="result__items result_item1">
          {resultsList.map((item, index) => { // will be removed
          // {resultsList.map((item) => {
            const active = radio === index // will be removed
            // const active = choice === item

            const handleSelectImage = () => {
              setRadio(index) // will be removed
              dispatch(setChoice(item))
            }

            return (
              <ResultItem
                key={`${item}-${index}`}
                item={item}
                index={index}
                active={active}
                handleSelectImage={handleSelectImage}
                buttonId={buttons[index]}
              />
            )
          })}
        </div>
    </div>
  )
}

export default Result
