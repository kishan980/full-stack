import React, {useCallback, useEffect, useRef} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useHistory} from 'react-router-dom';
import {useCookies} from 'react-cookie';
import {DndProvider} from 'react-dnd'
import {HTML5Backend} from 'react-dnd-html5-backend';
import {confirmAlert} from 'react-confirm-alert';
import { Helmet } from "react-helmet";

import {IMAGE_UPLOAD_ACCEPT} from '../../../../../constants/files';
import ROUTES from '../../../../../constants/routes';
import {addFile, removeFile, reorderFiles, selectFiles} from '../../../../../store/slices/filesSlice';
import {manageTooltipPopout} from '../../../../../utils/helpers';
import useWindowDimensions from '../../../../../hooks/useWindowDimensions';
import useScrollPosition from '../../../../../hooks/useScrollPosition';
import FileUpload from './FileUpload/FileUpload';
import DraggableFile from './DraggableFile/DraggableFile';
import useHeader from '../../../../screens/Header/useHeader'
import {openWindow} from '../../../../../store/slices/signInSlice';

import info from '../../../../../assets/images/info.png';
import tooltipPopout from '../../../../../assets/images/tooltip-popout.png';
import swapABInactive from '../../../../../assets/images/swap-a-b-inactive.png'
import swapBCInactive from '../../../../../assets/images/swap-b-c-inactive.png'
import swapABActive from '../../../../../assets/images/swap-a-b-active.png'
import swapBCActive from '../../../../../assets/images/swap-b-c-active.png'
import './files-container.scss';

const DESCRIPTIONS = [
  'ART FOCAL POINT',
  'SECONDARY ELEMENT',
  'BACKGROUND TEXTURE',
];


const ImagesUploadStep = ({creditModalOpen}) => {
  const files = useSelector(selectFiles);
  const dispatch = useDispatch();
  const history = useHistory();
  const [state] = useHeader();
  const [{uploadGuideSeen}, setCookie] = useCookies(['uploadGuideSeen']);
  const {width} = useWindowDimensions();
  const scrollPosition = useScrollPosition();
  const infoEl = useRef(null);
  const tooltipPopoutEl = useRef(null);

  const {accessToken} = state;
  const filesCount = files.length;

  const moveFile = (dragIndex, hoverIndex) => {
    dispatch(reorderFiles({from: dragIndex, to: hoverIndex}));
  };

  const deleteFile = (index) => {
    dispatch(removeFile(index));
  }

  const Description = ({index}) => (
    <div className="desc">
      <span className="desc__desc">{DESCRIPTIONS[index]}</span>
    </div>
  )
  const buttonLetterIds = [
    "create_art_file_upload_one",
    "create_art_file_upload_two",
    "create_art_file_upload_three",
  ];
  const displayUploadGuide = useCallback(() => {
    confirmAlert({
      childrenElement: () => <div>
        <img ref={tooltipPopoutEl} className="tooltip-popout tooltip_top_cross" src={tooltipPopout} alt="img "/>
        Upload images from your mobile gallery or local storage from your Mac or PC.
        <br/><br/>
        <strong>Image A</strong> = Art focal point<br/>
        <strong>Image B</strong> = Secondary element<br/>
        <strong>Image C</strong> = Background texture
        <br/><br/>
        Image types supported include jpg, png, heif, heic, bmp
        Minimum image resolution (recommended) is 1000px X 1000px
        Maximum (per) image size for upload is 12MB
        <br/><br/>
        For image slot swapping, drag ‘n’ drop (desktop) or press ‘switch’ buttons to swap A and B, and B and C images around.
      </div>,
      overlayClassName: 'create-art-help',
      afterClose: () => {
        if (tooltipPopoutEl.current !== null) {
          tooltipPopoutEl.current.classList.remove('tooltip-popout-visible');
        }
      },
      buttons: [
        {
          label: 'GOT IT',
          onClick: () => {
            setCookie('uploadGuideSeen', true);
          }
        }
      ],
    });
    manageTooltipPopout(width, infoEl, tooltipPopoutEl);
  }, [setCookie, width]);

  useEffect(() => {
    if (!uploadGuideSeen && !creditModalOpen) {
      if (accessToken) {
        window.setTimeout(displayUploadGuide, 100);
      }
    }
    window.scrollTo(0, 0);
  }, [uploadGuideSeen, creditModalOpen, accessToken, displayUploadGuide]);

  useEffect(() => {
    if (!accessToken) {
      
      dispatch(openWindow());
      history.push(ROUTES.index);
    }
  }, [accessToken, dispatch, history]);

  useEffect(() => {
    let inactiveButtons = document.getElementsByClassName('swap-inactive');
    let activeButtons = document.getElementsByClassName('swap-active');
    [...inactiveButtons].forEach((el) => {
      el.style.display = 'none';
    });
    [...activeButtons].forEach((el) => {
      el.style.display = 'none';
    });

    if (width < 768) {
      let filledCount = 0;
      files.forEach(el => {
        if (el.file !== undefined) {
          filledCount++;
        }
      });

      [...inactiveButtons].forEach((el) => {
        if (filledCount < 3) {
          el.style.display = 'block';
        } else {
          el.style.display = 'none';
        }
      });
      [...activeButtons].forEach((el) => {
        if (filledCount < 3) {
          el.style.display = 'none';
        } else {
          el.style.display = 'block';
        }
      });
    }
  }, [width, files])

  useEffect(() => {
    manageTooltipPopout(width, infoEl, tooltipPopoutEl);
  }, [width, scrollPosition, infoEl, tooltipPopoutEl]);


  return (
    <div className="wrap">
      <div className="heading">
      <Helmet>
        <title>Create Art in Collaboration with Featured Artists and AI</title>
        <meta name="description" content="Choose your style, upload your photos, choose your favourite color and create Art in collaboration with artist and AI." />
        <meta name="keywords" content="create, art, collaboration, artist, AI"/>
      </Helmet>
        <div className="step-title">
          Upload your images
        </div>
        <div ref={infoEl} className="info" onClick={displayUploadGuide}>
          <img src={info} alt="img"/>
          
        </div>
      </div>
      <div className="sub-heading">
        Once uploaded you may swap between A/B/C
      </div>
      <div className="swap-container">
        <img className="swap-inactive swap-ab" src={swapABInactive} alt="alt"/>
        <img className="swap-inactive swap-bc" src={swapBCInactive} alt="alt"/>
        <img className="swap-active swap-ab" onClick={() => moveFile(0, 1)} src={swapABActive} alt="alt"/>
        <img className="swap-active swap-bc" onClick={() => moveFile(1, 2)} src={swapBCActive} alt="alt"/>
      </div>
      <div className="files-container">
        <DndProvider backend={HTML5Backend}>
          {files.map((item, index) => {
            const {file, id} = item;
      

            let isImageFile = false;
            if (file) {
              const {type} = file
              isImageFile = type.split("/")[0] === "image";
            }

            return (
              <DraggableFile key={index} index={index} id={id} moveFile={moveFile}>

                <div className='files-container__item'>
                  <div className='files-container__content'>
                  {isImageFile && (
                    // {file && (
                      <div className="img">
                        <img
                          className='files-container__image-preview'
                          // src={file}
                          src={URL.createObjectURL(file)}
                          alt={`file preview ${index}`}
                        />
                      </div>
                    )}
                    
                    {isImageFile && (
                    // {file && (
                      <button className="delete-button" onClick={() => deleteFile(index)}>
                      </button>
                    )}
                       {!isImageFile && (
                    // {!file && (
                      <FileUpload
                      id={buttonLetterIds[index]}
                        accept={IMAGE_UPLOAD_ACCEPT}
                        label="Profile Image(s)"
                        key={Math.random()}
                        fIndex={index}
                        updateFilesCb={(file) => {
                          
                          return(
                            
                            dispatch(addFile({index: index, file: file}))
                            )
                        
                        }}
                        backgroundLetter={index}
                      />
                    )}
                    <Description index={filesCount + index}/>
                  </div>
                </div>

                <Description index={index}/>

              </DraggableFile>
            );
          })}
        </DndProvider>
      </div>
    </div>
  );
}

export default ImagesUploadStep
