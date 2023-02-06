import React from 'react'
import './help-guide.scss'

const HelpGuideItem = ({img, heading, text}) => {
    return(
        <>
            <img src={img} alt="img"/>
            <span className="text__heading">{heading}</span>
            <div className="help-guide__line"/>
            <span className="text__desc">{text}</span>
        </>
    )
}

export default HelpGuideItem;