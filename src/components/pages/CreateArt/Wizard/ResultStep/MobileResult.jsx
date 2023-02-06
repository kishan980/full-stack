import React from "react"
import { useDispatch, useSelector } from "react-redux";
import { CarouselProvider, Slider, Slide, ButtonBack, ButtonNext } from "pure-react-carousel";
import 'pure-react-carousel/dist/react-carousel.es.css';

import { selectResultsList, setChoice} from "../../../../../store/slices/resultsSlice";

const MobileResult = () => {
  const resultsList = useSelector(selectResultsList);

  return (
    <CarouselProvider
      naturalSlideWidth={100}
      naturalSlideHeight={125}
      totalSlides={3}
      currentSlide={1}
    >
      <Slider>
        {resultsList.map((item, index) => {
          return (<Slide index={index}><img src={item}/></Slide>)
        })}
      </Slider>
    </CarouselProvider>
  );
}

export default MobileResult;
