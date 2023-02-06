import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useHistory} from 'react-router-dom';

import { selectResultsLoading } from '../../../../../store/slices/resultsSlice';
import {openWindow} from '../../../../../store/slices/signInSlice';
import ROUTES from '../../../../../constants/routes';
import useHeader from '../../../../screens/Header/useHeader';

import Loading from '../Loading/Loading';
import Result from './Result';
import './result.scss';


const ResultStep = () => {
  const resultsLoading = useSelector(selectResultsLoading);
  const history = useHistory();
  const dispatch = useDispatch();
  const [state] = useHeader();
  const {accessToken} = state;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (!accessToken) {
      dispatch(openWindow());
      history.push(ROUTES.index);
    }
  }, [accessToken, dispatch, history])

  return (
    <div className='result'>
      {resultsLoading
        ? <Loading />
        : <Result />
      }
    </div>
  )
}

export default ResultStep
