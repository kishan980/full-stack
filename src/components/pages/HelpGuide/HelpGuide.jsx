import React, {useEffect, useState, useRef} from 'react';
import {useDispatch,useSelector} from "react-redux";
import {Link} from 'react-router-dom';
import {useCookies} from 'react-cookie';
import moment from 'moment';
import {Helmet} from "react-helmet";
import {useScrollPosition} from '@n8tb1t/use-scroll-position';

import ROUTES from '../../../constants/routes';

import Register from "../../screens/Register/Register";
import {switchToHelp} from "../../../store/slices/navColorSlice";
import {postCredit, getCredit, userSession} from "../../../utils/api";
import './help-guide.scss';

import inputA from '../../../assets/images/help-guide-in-a.webp';
import inputB from '../../../assets/images/help-guide-in-b.webp';
import inputC from '../../../assets/images/help-guide-in-c.webp';
import output1 from '../../../assets/images/help-guide-out-1.webp';
import output2 from '../../../assets/images/help-guide-out-2.webp';
import output3 from '../../../assets/images/help-guide-out-3.webp';

import doIcon from '../../../assets/images/help-guide-do.svg';
import dontIcon from '../../../assets/images/help-guide-dont.svg';

import doA1 from '../../../assets/images/help-guide-do-a1.webp';
import dontA1 from '../../../assets/images/help-guide-dont-a1.webp';
import doA2 from '../../../assets/images/help-guide-do-a2.webp';
import dontA2 from '../../../assets/images/help-guide-dont-a2.webp';
import doB1 from '../../../assets/images/help-guide-do-b1.webp';
import dontB1 from '../../../assets/images/help-guide-dont-b1.webp';
import doB2 from '../../../assets/images/help-guide-do-b2.webp';
import dontB2 from '../../../assets/images/help-guide-dont-b2.webp';
import doC1 from '../../../assets/images/help-guide-do-c1.webp';
import dontC1 from '../../../assets/images/help-guide-dont-c1.webp';
import doC2 from '../../../assets/images/help-guide-do-c2.webp';
import dontC2 from '../../../assets/images/help-guide-dont-c2.webp';

import colorPicker from '../../../assets/images/help-guide-color-picker.webp';
import buyNowButton from '../../../assets/images/help-guide-buy-now-button.webp';
import resultActions from '../../../assets/images/help-guide-result-actions.webp';
import helpGuideSwap from '../../../assets/images/help-guide-swap.webp';
import reCreateButton from '../../../assets/images/help-guide-re-create-art-button.webp';
import breadcrumbs from '../../../assets/images/help-guide-breadcrumbs.webp';
import { ParallaxBanner } from 'react-scroll-parallax';
import MobileDetect from "mobile-detect";


const HelpGuide = () => {
  const dispatch = useDispatch();
  const [registrationModal, setRegistrationModal] = useState(false);
  const [elementPosition, setElementPosition] = useState({x: 20, y: 150});
  const [readTime, setReadTime] = useState();
  const [{accessToken}] = useCookies(['accessToken']);
  const [{signupPopup}] = useCookies(['signupPopup']);
  const [, setCookie] = useCookies(['accessToken']);
  const elementRef = useRef();


 

  useScrollPosition(
    ({currPos}) => {
      setElementPosition(currPos);
    }, [], elementRef
  )

  useEffect(() => {
    window.scrollTo(0, 0);
    dispatch(switchToHelp());
  }, [dispatch])

  useEffect(() => {
    if (elementPosition.y === 150) {
      setReadTime(Date.now());
    }
  }, [elementPosition, signupPopup])


  const handleSubmit = async () => {
    if (accessToken) {
      await postCredit({accessToken});
      let {data} = await getCredit({accessToken});
      if (data) {
        setCookie('signupPopup', data.signupPopup);
        setCookie('wallet', data.wallet);
        setCookie('alertOnSignUp', data.alertOnSignUp);
        localStorage.setItem('items', JSON.stringify(data));
        window.location.href = '/create-art';
      }
    } else {
      setRegistrationModal(true)
    }
  }

  let type = new MobileDetect(window.navigator.userAgent);
  return (
    <div className="help-guide">
      <Helmet>
      <title>Artyst Composition Guide</title>
      <meta name="description" content="Navigate your way through how to use Artyst. Reading this guide will give you all the knowledge that you need to create stunning and highly-personal art." />
      <meta name="keywords" content="artyst, composition, help, guide, images, art, canvas"/>
      </Helmet>
      {registrationModal && (
        <Register setRegistrationModal={() => setRegistrationModal(false)}/>
      )}

    

      <div className="top-image"/>
      <div className="example-section">
        <div className="content">

          <h1 className='title'>Composition Guide</h1>
          <div className="text guide-body">
            <div className="paragraph">
              If you’re new to Artyst.ai, reading this guide will give you all the knowledge that you need to create
              stunning and highly-personal pieces of bespoke art.
            </div>
            <div className="paragraph">
              The most important thing to remember is that great imagery produces great art. If you give your art piece
              the thought and consideration it deserves, you’ll be happy for years to come.
            </div>
            <div className='paragraph'>
            Navigate your way through how to use Artyst. Reading this guide will give you all the knowledge that you need to create stunning and highly-personal art.
            </div>
          </div>

          <div className="input-output">
            <div className="info">
              <h1>Your Images</h1>
              <div className="line"></div>
              <div className="text">
                Whether you use your own imagery, download from an inspiring site like <a href="https://unsplash.com" rel="noreferrer"
                                                                                          target="_blank">Unsplash</a>,
                or do a Google search,
                all you have to do is choose 3 images that make up the theme of your art piece.
              </div>
            </div>
            <div className="images">
              <div className="container">
                <img src={inputA} className="image" alt="Input A"/>
                <div className="text">Image A</div>
              </div>
              <div className="container">
                <img src={inputB} className="image" alt="Input B"/>
                <div className="text">Image B</div>
              </div>
              <div className="container">
                <img src={inputC} className="image" alt="Input C"/>
                <div className="text">Image C</div>
              </div>
            </div>
          </div>

          <div className="input-output mb-0">
            <div className="info">
              <h1>Our Style</h1>
              <div className="line"></div>
              <div className="text">
                Once you’ve chosen your images and color, we’ll show you 3 completely different bespoke art compositions
                in your chosen style. You could either purchase there and then, add to ‘My Collection’ or change the
                images and/or color to see new compositions.
              </div>
            </div>
            <div className="images input-output-img">
              <div className="container">
                <img src={output1} className="image" alt="Art #1"/>
                <div className="text">Art #1</div>
              </div>
              <div className="container">
                <img src={output2} className="image" alt="Art #2"/>
                <div className="text">Art #2</div>
              </div>
              <div className="container">
                <img src={output3} className="image" alt="Art #3"/>
                <div className="text">Art #3</div>
              </div>
            </div>
          </div>

        </div>
      </div>
      <div>
      <div className="parallax for-desktop">
      <div className="upper-shadow"/>
      <div className="lower-shadow"/>
    </div>
    </div>
   
   <div className='parallax-for-mobile'>
   <div className="upper-shadow"/>
   <div className="lower-shadow"/>
   <ParallaxBanner
       layers={[
         {
           image: "static/media/help-guide-parallax.7df520c3.webp",
           speed: -10,
         },
       ]}
       style={{ aspectRatio: "3/ 3", transition: "all ease-out" , height:"361px" }}
     />
   </div>   


      <div className="image-section">
        <div className="content">

          <h1>Image slots</h1>
          <div className="line"></div>
          <div className="text">
            <div className="paragraph">
              The platform comprises 3 image slots, and depending on which slot you assign each of your images to, has a
              bearing on how the end art compositions will look.
            </div>
            <div className="paragraph">
              Image A is the primary focal point of your art. Image B is the secondary element of your piece, which
              supports image A. Image C serves as the background for your art, so is best used as a textual layer.
            </div>
            <div className="paragraph">
              Once uploaded, the platform also lets you experiment to create different outcomes, by allowing the A, B
              and C images to be swapped around for different results.
            </div>
          </div>

          <h1>Images A & B</h1>
          <div className="text">
            <div className="paragraph">
              These images should represent the core theme of your art. Relate them to one another, but the best results
              are achieved when they’re quite different compositionally i.e. a person and a place or a pet and an
              object.
            </div>
          </div>

          <h1>Framing your subject</h1>
          <div className="text">
            <div className="paragraph">
              The best results are achieved when your subject matter is well-framed within the image and highly visible,
              with minimal background ‘clutter’. Also, avoid images where your subject matter is obscured by something
              in the foreground.
            </div>
          </div>

          <div className="image-guide-row">
            <div className="column left-column">
              <div className="images">
                <div className="container">
                  <img src={doA1} className="image" alt="Do"/>
                  <div className="hint">
                    <img src={doIcon} alt="do"/>
                    <div className="text">Do</div>
                  </div>
                </div>
                <div className="container">
                  <img src={dontA1} className="image" alt="Don't"/>
                  <div className="hint">
                    <img src={dontIcon} alt="dont"/>
                    <div className="text">Don't</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="column right-column">
              <div className="images">
                <div className="container">
                  <img src={doA2} className="image" alt="Do"/>
                  <div className="hint">
                    <img src={doIcon} alt="do"/>
                    <div className="text">Do</div>
                  </div>
                </div>
                <div className="container">
                  <img src={dontA2} className="image" alt="Don't"/>
                  <div className="hint">
                    <img src={dontIcon} alt="dont"/>
                    <div className="text">Don't</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <h1>Quality and contrast</h1>
          <div className="text">
            <div className="paragraph">
              It might sound obvious, but ensure that your images are good quality (resolution), in focus and have a
              good definition of contrast (between light and dark areas).
            </div>
          </div>

          <div className="image-guide-row">
            <div className="column left-column">
              <div className="images">
                <div className="container">
                  <img src={doB1} className="image" alt="Do"/>
                  <div className="hint">
                    <img src={doIcon} alt="do"/>
                    <div className="text">Do</div>
                  </div>
                </div>
                <div className="container">
                  <img src={dontB1} className="image" alt="Don't"/>
                  <div className="hint">
                    <img src={dontIcon} alt="dont"/>
                    <div className="text">Don't</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="column right-column">
              <div className="images">
                <div className="container">
                  <img src={doB2} className="image" alt="Do"/>
                  <div className="hint">
                    <img src={doIcon} alt="do"/>
                    <div className="text">Do</div>
                  </div>
                </div>
                <div className="container">
                  <img src={dontB2} className="image" alt="Don't"/>
                  <div className="hint">
                    <img src={dontIcon} alt="dont"/>
                    <div className="text">Don't</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <h1>Image C</h1>
          <div className="text">
            <div className="paragraph">
              Relates to the background texture of the canvas. It is less visible but plays a crucial part in the
              composition and quality of the artwork produced. Darker images produce a darker tone in the background and
              lighter images a lighter tone. Here are some tips for great results.
            </div>
          </div>

          <div className="image-guide-row">
            <div className="column left-column">

              <h1>Texture</h1>
              <div className="text">
                <div className="paragraph">
                  Patterns and textures work beautifully, so make sure the image has recognisable contrast and texture.
                </div>
              </div>

              <div className="images">
                <div className="container">
                  <img src={doC1} className="image" alt="Do"/>
                  <div className="hint">
                    <img src={doIcon} alt="do"/>
                    <div className="text">Do</div>
                  </div>
                </div>
                <div className="container">
                  <img src={dontC1} className="image" alt="Don't"/>
                  <div className="hint">
                    <img src={dontIcon} alt="dont"/>
                    <div className="text">Don't</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="column right-column">

              <h1>Detail</h1>
              <div className="text">
                <div className="paragraph">
                  The art may only have hints of image C in the final result, so choose images that are clearly defined
                  and recognisable.
                </div>
              </div>

              <div className="images">
                <div className="container">
                  <img src={doC2} className="image" alt="Do"/>
                  <div className="hint">
                    <img src={doIcon} alt="do"/>
                    <div className="text">Do</div>
                  </div>
                </div>
                <div className="container">
                  <img src={dontC2} className="image" alt="Don't"/>
                  <div className="hint">
                    <img src={dontIcon} alt="dont"/>
                    <div className="text">Don't</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      <div className="color-section">
        <div className="content">
        
        <div className="color-guide-row">
            <div className="column left-column">
            <h1 className='block'>Color</h1>
              <div className="text">
                <div className="paragraph">
                  After selecting your images, you’ll be able to choose color. The wheel combines both hue (color) and
                  luminance (the amount light in a color), whilst the slider underneath controls saturation (the
                  intensity of a color).
                </div>
                <div className="paragraph">
                  For each style, the artist has determined 3 different applications of ‘color logic’, that will
                  appear in the 3 different art compositions generated for you.
                </div>
                <div className="paragraph">
                  Your chosen color will appear in the center of the target, with the outer two rings being dynamically
                  generated to give you an idea of the overall palette you can expect.
                </div>
                <div className="paragraph last-paragraph">
                  Tip: experiment with the slider by darkening your color for some really interesting results!
                </div>
              </div>
            </div>
            <div className="column right-column">
            <h1 className='block color-mb'>Color</h1>
              <img src={colorPicker} alt="Color Picker"/>
            </div>
          </div>
        </div>
      </div>

      <div className="divider"></div>

      <div className="results-section">
        <div className="content">
          <h1>Results</h1>
          <div className="text">
            <div className="paragraph">
              After only a couple of minutes, you will be shown your 3 art compositions. At this point you could
              purchase, add to My Collection, share socially or view how your art would look in-situ on a wall. Just
              look for these icons below.
            </div>
          </div>

          <div className="control-wrapper">
            <img src={buyNowButton} className="left" alt="Buy Now"/>
            <img src={resultActions} className="right" alt="Result Actions"/>
          </div>

          <div className="text">
            <div className="paragraph">
              Alternatively, you could continue to experiment, either by hitting the RE-CREATE button to see 3
              entirely new compositions, or clicking on the Color or Input Images links above. The platform will remember
              the last color you chose, as well as the images and image slots they were assigned to.
            </div>
          </div>

          <div className="control-wrapper stack">
            <img src={reCreateButton} className="left" alt="Re-Create Art"/>
            <img src={breadcrumbs} className="right" alt="Breadcrumbs"/>
          </div>

          <div className="text">
            <div className="paragraph">
              Also, try swapping the positions of the A and B images, or the B and C images for different results. Or
              keep some images and upload a new one. The more you experiment, the better the results you’ll get.
            </div>
          </div>

          <div className="control-wrapper">
            <img src={helpGuideSwap} alt="Swap"/>
          </div>

          <div className="text">
            <div className="paragraph">
              Tip: if you’re in two minds about any piece of art, it’s always safer to add it to My Collection. This is
              because once you leave the results screen, you can’t recover those compositions again due to the bespoke
              nature of the platform.
            </div>
          </div>

          <hr/>

          <div className="button-wrap">
            {(signupPopup === "true") ?
              <Link to={ROUTES.createArt}>
                <button className="button" id="create_art_composition_guide">CREATE ART</button>
              </Link>
              : ((moment(moment()).diff(moment(readTime), 'seconds') > 10)
                ? <button className="button" onClick={handleSubmit}>CREATE ART</button>
                : (accessToken ? <button type="disable" className="disable">CREATE ART</button> :
                  <button className="button" onClick={(e) => {
                    e.preventDefault()
                   
                      setRegistrationModal(true);
                    
                  }}>CREATE ART</button>))}
          </div>
        </div>
      </div>

    </div>
  )
}

export default HelpGuide;
