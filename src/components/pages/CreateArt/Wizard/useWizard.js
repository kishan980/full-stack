import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useCookies } from 'react-cookie';

import { selectColorHex, selectFiles,  } from '../../../../store/slices/filesSlice';
import { createImageComposition,  } from '../../../../store/slices/resultsSlice';
import ImagesUploadStep from './ImagesUploadStep/ImagesUploadStep';
import ColorPickerStep from './ColorPickerStep/ColorPickerStep';
import ResultStep from './ResultStep/ResultStep';
import MyCollection from '../../MyCollection/MyCollection';
import StyleArt from './styleArt/StyleArt';

import { selectStyle } from '../../../../store/slices/filesSlice';

export const STEPS = [
  StyleArt,
  ImagesUploadStep,
  ColorPickerStep,
  ResultStep,
  MyCollection,
]

const checkIsLastStep = (step = 0) => (
  step === STEPS.length - 2
)

const useWizard = () => {
  const select =useSelector(selectStyle)
  const dispatch = useDispatch();
  const files = useSelector(selectFiles);
  const colorHex = useSelector(selectColorHex);
  const [{ accessToken }] = useCookies(['accessToken']);
  const [currentStep, setCurrentStep] = useState(0);



  const handleSubmit = () => {
    const resubmit = currentStep === 3;
    dispatch(createImageComposition({ files, colorHex, accessToken, resubmit, select}));
  }

  const handleClickNext = () => {
    const newStep = currentStep +1 
    setCurrentStep(newStep)

    const isLastStep = checkIsLastStep(newStep)

    if (isLastStep) {
      handleSubmit()
    }
  }

  const isLastStep = checkIsLastStep(currentStep)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, []);

  const state = {
    currentStep,
    files,
    isLastStep,
  }

  const actions = {
    handleClickNext,
    setCurrentStep,
    handleSubmit,
  }

  return [state, actions]
}

export default useWizard
