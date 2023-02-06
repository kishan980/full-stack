import React, {useEffect, useRef} from 'react';
import {useSelector} from 'react-redux';
import TextLoop from 'react-text-loop';

import {selectResultsProgress} from '../../../../../store/slices/resultsSlice';

import loadingLogo from '../../../../../assets/images/loading-transparent-logo.webp';
import './loading.scss';
import ReactGA from 'react-ga';



const Loading = () => {

  useEffect(() =>{
    ReactGA.initialize('UA-236939229-1');
    ReactGA.pageview("/processingPage");
  },[])
  const actualProgress = useSelector(selectResultsProgress);
  const simulatedProgress = useRef(1);
  const progressBar = useRef(null);
  const intervalRef = useRef(null);
  const intervalMs = useRef(5000);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);



  useEffect(() => {
    if (actualProgress > simulatedProgress.current) {
      simulatedProgress.current = actualProgress;
    }

    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      if (simulatedProgress.current < 100) {
        simulatedProgress.current += 1;
      }

      if (progressBar.current) {
        progressBar.current.style.width = `${simulatedProgress.current}%`;
      } else {
        clearInterval(intervalRef.current);
      }
    }, intervalMs.current);
  }, [actualProgress, simulatedProgress, progressBar, intervalRef, intervalMs]);

  return (
    <div className="loading">
      <span className="heading">Creating art compositions</span>
      <span className="sub-heading">It will only take a few minutes, so don't leave this screen</span>
      <div className="logo">
        <img src={loadingLogo} alt="logo"/>
      </div>
      <div className="progress">
        <div className="border"></div>
        <div ref={progressBar} className="bar"></div>
      </div>
      <div className="quotes">
        <TextLoop interval="8000">
          <span>Every artist was first an amateur.<br/><em>Ralph Waldo Emerson</em></span>
          <span>Creativity takes courage.<br/><em>Henri Matisse</em></span>
          <span>Art enables us to find ourselves and lose ourselves at the same time.<br/><em>Thomas Merton</em></span>
          <span>Every child is an artist. The problem is how to remain an artist once we grow up.<br/><em>Pablo Picasso</em></span>
          <span>A picture is a poem without words.<br/><em>Horace</em></span>
          <span>Creativity is contagious. Pass it on.<br/><em>Albert Einstein</em></span>
          <span>The principles of true art is not to portray, but to evoke.<br/><em>Jerry Kosinski</em></span>
          <span>Painting is easy when you don't know how, but very difficult when you do.<br/><em>Edgar Degas</em></span>
          <span>We don't make mistakes, just happy little accidents.<br/><em>Bob Ross</em></span>
        </TextLoop>
      </div>
    </div>
  )
}

export default Loading;
