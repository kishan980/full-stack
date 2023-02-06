import React from 'react'
import StyleImg1 from "../../../../../assets/images/modal-img.png"

import "./styleart.scss"

const styleArtModal = ({handleHandler, style}) => {
  return (
    <div className='styleArt-modal'>
    <div className=''>
    
    <div className='style-files-container'>
            
            <div className=''>
          
            <div className='text-center'>
              <h2 className='text-center'>Layr</h2>
              <div className='style-img'>
              <img src={StyleImg1}  alt='styleimg' />
              </div>
              
              <span className='d-block'>ARTIST_MARK STOTT</span>
            </div>
            <div className='text-center'>
              <p  className='discription'>Influenced by the vibrant anti establishment punk pop album sleeves of the late 70’s and 80’s. This style is vivid in color and graphic in texture using more geometric representations of ink on paper. 
              </p>
              <button className='modal-btn' onClick={() => handleHandler()}>CHOOSE</button>
              
            </div>
      </div>
           
    </div>
    </div>

    </div>
  )
}

export default styleArtModal
