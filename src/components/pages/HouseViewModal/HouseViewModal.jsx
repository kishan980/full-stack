import React, { useState } from 'react'
import classNames from 'classnames';

import './housemodal.scss'

const HouseViewModal = ({ item, setOpenHoseModal }) => {
    const [selectedSize, setSizeType] = useState('l');

    const handleChangeSize = (sizeType) => {
        setSizeType(sizeType);
    }
    return (
        <div className="house-modal">
            <div className="house-modal__content">
                <div className="body">
                    <button className="body__cross" onClick={() => setOpenHoseModal(false)} />
                    <div className='buttongroup'>
                        <button onClick={() => handleChangeSize('s')}
                            className={classNames('buttongroup__button', {
                                'buttongroup__button__selected': selectedSize === 's'
                            })}>S
                        </button>
                        <button onClick={() => handleChangeSize('m')}
                            className={classNames('buttongroup__button', {
                                'buttongroup__button__selected': selectedSize === 'm'
                            })}>M
                        </button>
                        <button onClick={() => handleChangeSize('l')}
                            className={classNames('buttongroup__button', {
                                'buttongroup__button__selected': selectedSize === 'l'
                            })}>L
                        </button>
                    </div>
                    <div className='artgroup'>
                        {selectedSize === 'l' && <img alt="large" src={item.imgUrl ? item.imgUrl : item} className="artgroup__large" />}
                        {selectedSize === 'm' && <img alt="medium" src={item.imgUrl ? item.imgUrl : item} className="artgroup__medium" />}
                        {selectedSize === 's' && <img alt="small" src={item.imgUrl ? item.imgUrl : item} className="artgroup__small" />}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HouseViewModal;
