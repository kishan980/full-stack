import React, {useEffect, useState, useRef, useCallback} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useCookies} from 'react-cookie';
import {confirmAlert} from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import ColorPicker from '@radial-color-picker/react-color-picker';
import '@radial-color-picker/react-color-picker/dist/react-color-picker.min.css';
import hsl from 'hsl-to-hex-simple'

import {selectColorHex, setColorHex} from '../../../../../store/slices/filesSlice';
import {hexToRgb, rgb2hsv, getColorStyle} from '../../../../../utils/color';
import {manageTooltipPopout} from '../../../../../utils/helpers';
import useWindowDimensions from '../../../../../hooks/useWindowDimensions';
import useScrollPosition from '../../../../../hooks/useScrollPosition';

import IroColorPicker from './IroColorPicker';

import info from '../../../../../assets/images/info.png';
import tooltipPopout from '../../../../../assets/images/tooltip-popout.png';
import './color-picker-step.scss'
import space from 'color-space';
import {selectStyle} from '../../../../../store/slices/filesSlice';
import {hslToRgb} from './../../../../../utils/color';
import IroSecondFile from './ColorPicker/IroSecondFile';

const ColorPickerStep = () => {


    const dispatch = useDispatch();
    const select = useSelector(selectStyle)
    const colorHex = useSelector(selectColorHex);
    console.log("🚀 ~ file: ColorPickerStep.jsx ~ line 32 ~ ColorPickerStep ~ colorHex", colorHex)

    const rgb = hexToRgb(colorHex);
    console.log("🚀 ~ file: ColorPickerStep.jsx ~ line 35 ~ ColorPickerStep ~ rgb", rgb)
    const [colorHsv, setColorHsv] = useState(rgb2hsv(rgb));
    const [
        {
            colorGuideSeen
        }, setCookie
    ] = useCookies(['colorGuideSeen']);
    const {width} = useWindowDimensions();
    const scrollPosition = useScrollPosition();
    const infoEl = useRef(null);
    const tooltipPopoutEl = useRef(null);

    let left,
        center,
        right,
        outer;
    left = getColorStyle(colorHex, select === "style_1" ? 'analogous+30' : "triadic-120", select);
    console.log("🚀 ~ file: ColorPickerStep.jsx ~ line 48 ~ ColorPickerStep ~ left", left)

    center = getColorStyle(colorHex, select === "style_1" ? 'complementary' : "triadic-120_obj", select);
    console.log("🚀 ~ file: ColorPickerStep.jsx ~ line 50 ~ ColorPickerStep ~ center", center)

    right = getColorStyle(colorHex, select === "style_1" ? 'analogous-30' : 'triadic+120', select);
    console.log("🚀 ~ file: ColorPickerStep.jsx ~ line 52 ~ ColorPickerStep ~ right", right)

    outer = getColorStyle(colorHex, select === "style_1" ? 'analogous+30' : "triadic-120", select);
    console.log("🚀 ~ file: ColorPickerStep.jsx ~ line 51 ~ ColorPickerStep ~ outer", outer)

    const displayColorGuide = useCallback(() => {
        confirmAlert({
            childrenElement: () => <div>
                <img ref={tooltipPopoutEl}
                    className="tooltip-popout tooltip_top_cross"
                    src={tooltipPopout}
                    alt="img "/>
                Use the wheel to select the predominant color of your art.
                <br/><br/>
                The slider underneath controls the saturation, or intensity of your chosen color.
                <br/><br/>
                The 3 targets represent the indicative color make-up of your final compositions, based on the ‘color logic’
                                                                                                                                                        determined by the style artist.
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
                        setCookie('colorGuideSeen', true);
                    }
                }
            ]
        });
        manageTooltipPopout(width, infoEl, tooltipPopoutEl);
    }, [setCookie, width]);

    useEffect(() => {
        window.scrollTo(0, 0);
        if (!colorGuideSeen) {
            window.setTimeout(displayColorGuide, 100);
        }
    }, [colorGuideSeen, displayColorGuide]);

    useEffect(() => {
        manageTooltipPopout(width, infoEl, tooltipPopoutEl);
    }, [width, scrollPosition, infoEl, tooltipPopoutEl]);

    const setColor = (color) => {

        const testRegex = /#[0-9A-Fa-f]{6}/g;
        const hsv = color.hsv;


        if (hsv.v > 90) {
            hsv.v = 90;
        }
        if (hsv.v < 10) {
            hsv.v = 10;
        }

        setColorHsv(hsv);
        if (testRegex.test(color.hexString)) {
            dispatch(setColorHex(color.hexString));

        }
    }
    const [color, setColors] = React.useState({hue: 90, saturation: 100, luminosity: 50, alpha: 1});

    const onInput = (hue) => {

        const testRegex = /#[0-9A-Fa-f]{6}/g;
        var hex = hsl(hue, 100, 50)

        if (testRegex.test(hex)) {
            dispatch(setColorHex(hex))
        }

        setColors(prev => {
            return {

                ...prev,
                hue
            };
        });
    };
    return (
        <div className="color-picker-step">
            <div className="heading">
                <div className="step-title">
                    Choose your color
                </div>
                <div ref={infoEl}
                    className="info"
                    onClick={displayColorGuide}>
                    <img src={info}
                        alt="img"/>
                </div>
            </div>
            <div className="layout-wrapper">
                <div className="color-picker">
                    {
                    select === "style_1" ? <IroColorPicker color={colorHsv}

                        onColorChange={
                            color => setColor(color)
                        }
                        layoutDirection="vertical"
                        borderWidth="1"/> : <>
                        <ColorPicker {...color}
                            onInput={onInput}
                            saturation={100}/>


                        <div className='d-bar'>
                            <span className='d-bar-overlay'></span>
                        </div>
                    </>
                } </div>
                <div className="style-container">
                    <div className="group">
                        <div className="title">Art #1</div>
                        <div className="display">
                            {
                            select === "style_1" ? <div className="outer"></div> : <div className="outer"
                                style={
                                    {backgroundColor: outer[0]}
                            }></div>
                        }
                            <div className="middle"
                                style={
                                    {backgroundColor: left[1]}
                            }></div>
                            <div className="center"
                                style={
                                    {backgroundColor: left[0]}
                            }></div>
                        </div>
                    </div>
                    <div className="group">
                        <div className="title">Art #2</div>
                        <div className="display">
                     
                            <div className="middle"
                                style={
                                    {backgroundColor: center[1]}
                            }></div>
                         
                            <div className="center"
                                style={
                                    {backgroundColor: center[0]}
                            }></div>
                            {
                                select === "style_1" ? <div className="outer"></div> : <div className="outer"
                                    style={
                                        {backgroundColor: outer[0]}
                                }></div>
                            }
                           
                        </div>
                    </div>
                    <div className="group">
                        <div className="title">Art #3</div>
                        <div className="display">
                       

                            <div className="middle"
                                style={
                                    {backgroundColor: right[1]}
                            }></div>
                            <div className="center"
                                style={
                                    {backgroundColor: right[0]}
                            }></div>
                            {
                                select === "style_1" ? <div className="outer"></div> : <div className="outer"
                                    style={
                                        {backgroundColor: outer[0]}
                                }></div>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ColorPickerStep
