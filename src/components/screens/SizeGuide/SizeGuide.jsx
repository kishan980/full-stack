import React from 'react'

import './size-guide.scss'

import human from '../../../assets/images/human.png'

const SizeGuide = ({img, setSizeGuide}) => {

    const stylesArr = ['img-human', 'img-i120', 'img-i80', 'img-i50']
    const imagesArr = [human, img, img, img]
    const descArr = ['172 cm', '120x120 cm', '80x80 cm', '50x50 cm']

    const SizeGuideItem = ({styles, images, desc}) => (
        <div className="size-guide__item">
            <div className={styles}>
                <img src={images} alt="img"/>
            </div>
            <div className="size-desc">{desc}</div>
        </div>
    )

    return(
        <div className="size-guide">
            <div className="size-guide__content" onClick={() => {setSizeGuide(false)}}>
                <div className="size-guide__heading">Size Guide</div>
                <div className="size-guide__body">
                    {stylesArr.map((item, index) => (
                        <SizeGuideItem
                            key={item}
                            styles={item}
                            images={imagesArr[index]}
                            desc={descArr[index]}
                        />
                    ))}
                </div>
                <div className="size-guide__close" onClick={() => setSizeGuide(false)}/>
            </div>
        </div>
    )
}

export default SizeGuide;