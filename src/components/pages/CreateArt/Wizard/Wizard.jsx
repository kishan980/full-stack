import React, {useEffect, useState} from 'react';
import classNames from 'classnames';
import { useDispatch, useSelector } from 'react-redux';

import { selectResultsLoading } from '../../../../store/slices/resultsSlice';
import { makeHeaderDark } from '../../../../store/slices/whiteHeader';
import { switchToCreate } from '../../../../store/slices/navColorSlice';
import CreateArtPopModal from '../../CreateArtPop/CreateArtPop';

import useWizard, { STEPS } from './useWizard';
import './wizard.scss';
import { selectStyle } from './../../../../store/slices/filesSlice';
import {selectFiles} from '../../../../store/slices/filesSlice';
const BREADCRUMBS = [
  'Styles',
  'Input Images',
  'Color',
  'Art',
]

const Wizard = ()  => {
  const [state, actions] = useWizard();

  const select =useSelector(selectStyle)
  const filesData = useSelector(selectFiles);
  const [creditModalOpen, setCreditModalOpen] = useState(true);
  const dispatch = useDispatch();

  const {
    currentStep,
    files,
  } = state;

  const {
    handleClickNext,
    setCurrentStep,
    handleSubmit,
  } = actions;

  const CurrentStep = STEPS[currentStep];

  const resultsLoading = useSelector(selectResultsLoading);

  const  getFilesFilled =  () => {
    let res = true;
   
    files.forEach(el => {
      if (el.file === undefined) {
        res = false
      }
    })

    if(currentStep === 1) {
      filesData.forEach(fl => {
        if(fl.file === undefined) {
          res = false
        }
      })
    }

    return res;

  }



  const getValueForClassesAndDisable = (index) => {
    const use = currentStep >= index;

    if (index > 1) {
      return !resultsLoading && currentStep > 1;
    } else {
      return use;
    }
  }

  const BreadcrumbsButton = ({ item, index, defaultClass }) => {
    const activeClass = () => {
      return (currentStep === index ? `` : `${defaultClass}--active__current`);
    }

    return (
      <button
        key={item}
        className={classNames(defaultClass, { [`${activeClass()}`]: getValueForClassesAndDisable(index) })}
        onClick={() => !resultsLoading ? setCurrentStep(index) : null}
        disabled={!getValueForClassesAndDisable(index)}
      >{item}</button>
    )
  }

  useEffect(() => {
    dispatch(makeHeaderDark())
    window.scrollTo(0, 0)
    dispatch(switchToCreate())
  }, [dispatch])

  return (
    <>
      <CreateArtPopModal creditModalOpen={creditModalOpen} setCreditModalOpen={setCreditModalOpen}/>
    
      <div className="wizard">

        <div className="wizard__breadcrumbs-container">
          <div className="head">
            {BREADCRUMBS.map((item, index) => (
              <BreadcrumbsButton key={index} item={item} index={index} defaultClass="wizard__breadcrumb" />
            ))}
          </div>
          <div className="bot">
            <div className="bot-wrap">
              {[0, 1, 2,3].map((item, index) => 
                (
                <BreadcrumbsButton key={index} item='' index={item} defaultClass="bot__circle"  />
              )
              )}
            </div>
            <div className="bot__line__wrap">
              {[0, 1 ,2].map((item, index) => 
                (
                <div key={index} className={currentStep > item || (!resultsLoading && currentStep > 2) ? 'bot__line__segment bot__line__segment__active' : 'bot__line__segment'} />
              ))}
            </div>
          </div>
        </div>

        <CurrentStep creditModalOpen={creditModalOpen} />

        {(!resultsLoading || currentStep !== 3) && (
          <div className="wizard__buttons-container">
            {[0, 1,2,3 ].map((item, index) => {
            
              const disableDefault = !currentStep || currentStep === 1;
              const disableForFirstStep = disableDefault && !getFilesFilled();
              // console.log("🚀 ~ file: Wizard.jsx ~ line 133 ~ {[0,1,2,3].map ~ disableForFirstStep", disableForFirstStep)
              // const disableValues = [disableForFirstStep,disableDefault, disableDefault];
              // const onClickEvents = [handleClickNext, handleClickNext, handleSubmit];
              // const buttonText = ['UPLOAD IMAGES','SELECT COLOR', 'CREATE ART', 'RE-CREATE ART'];
              const disableValues = [!select,disableForFirstStep ,disableDefault,  disableDefault];
              
              
              const onClickEvents = [handleClickNext,handleClickNext, handleClickNext, handleSubmit];
              const buttonText = ['UPLOAD IMAGES','SELECT COLOR', 'CREATE ART', 'RE-CREATE ART'];
              const buttonIds =['style_select','file_upload_image','select_color_section','create_art_color_section','re_create_art_color_section']
              return (
                <div key={index}>

                  {currentStep === item && (
                    <button id={buttonIds[item]}
                      className="wizard__button"
                      onClick={onClickEvents[item]}
                      disabled={disableValues[item]}
                    >
                     {buttonText[item]}
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </>
  )
}

export default Wizard;
