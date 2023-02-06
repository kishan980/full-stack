import React, { useEffect, useRef, useState } from "react";
import lodash from "lodash";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useCookies } from "react-cookie";
import { Helmet } from "react-helmet";
import PopupModal from "../PopupModal/PopupModal";
import useWindowScroll from "../../../hooks/useWindowScroll";
import ROUTES from "../../../constants/routes";
import { HOME_PAGE_TEXTS, sizesArr } from "../../../constants/texts";
import { makeHeaderDark } from "../../../store/slices/whiteHeader";
import { switchToAbout } from "../../../store/slices/navColorSlice";
import useQuery from "../../../hooks/useQuery";
import Register from "../../screens/Register/Register";
import { Parallax } from "react-scroll-parallax";
import { ParallaxBanner } from "react-scroll-parallax";
import MobileDetect from "mobile-detect";

import "./home.scss";
import artPiece from "../../../assets/images/wall-art-piece.webp";
import canvas1 from "../../../assets/images/canvas-human.webp";
import canvas2 from "../../../assets/images/canvas-printer.svg";
import canvas3 from "../../../assets/images/canvas-scissors.svg";
import canvas4 from "../../../assets/images/canvas-fsc.svg";
import source1 from "../../../assets/images/source-1.webp";
import source2 from "../../../assets/images/source-2.webp";
import source3 from "../../../assets/images/source-3.webp";
import source4 from "../../../assets/images/source-4.webp";
import canvasExample1 from "../../../assets/images/canvas-example-1.webp";
import canvasExample2 from "../../../assets/images/canvas-example-2.webp";
import canvasExample3 from "../../../assets/images/canvas-example-3.webp";
import canvasExample4 from "../../../assets/images/canvas-example-4.webp";
import Download from "../../../assets/images/download.svg"


 const Home = () => {
  const dispatch = useDispatch();
  const query = useQuery();
  const [scrollButton, setScrollButton] = useState(false);
  const [registrationModal, setRegistrationModal] = useState(false);

  const code = query.get("code");

  const artPieceElement = useRef(null);

  const CANVAS_TEXTS = [
    HOME_PAGE_TEXTS.canvas1,
    HOME_PAGE_TEXTS.canvas2,
    HOME_PAGE_TEXTS.canvas3,
    HOME_PAGE_TEXTS.canvas4,
  ];

  const CANVAS_IMAGES = [canvas1, canvas2, canvas3, canvas4];

  const handleScroll = lodash.debounce(() => {
    const { height = 0, top = 0 } =
      artPieceElement.current?.getBoundingClientRect() || {};

    const offset = top < 0 && Math.abs(top) + 70;
    setScrollButton(offset >= height);
  }, 50);

  useWindowScroll({ handleScroll, element: artPieceElement });

  useEffect(() => {
    dispatch(makeHeaderDark());
    window.scrollTo(0, 0);
    dispatch(switchToAbout());
    if (query.get("code")) {
      setRegistrationModal(true);
    } else {
      setRegistrationModal(false);
    }
  }, [dispatch, query]);

  let type = new MobileDetect(window.navigator.userAgent);
  return (
    <div className="home modalHome">
      {code ? "" : <PopupModal />}
      {registrationModal && (
        <Register setRegistrationModal={() => setRegistrationModal(false)} />
      )}
      <Helmet>
        <title>Artyst - A.I. Art Commissions</title>
        <meta
          name="description"
          content="We feel that the creation of art is going through an exciting evolutionary phase. This is why we created Artyst.ai, a ‘smart’ AI art composition platform."
        />
        <meta
          name="keywords"
          content="Artyst, AI, Art, Generation, Platform, composition, sydney, canvas, artist, australia"
        />
      </Helmet>
    
      <div className="art-piece" ref={artPieceElement}>
        <div className="art-piece__container">
          <div className="art-piece__text">
            <span className="title">Your vision.</span>
            <span className="text">An artist's expression</span>
            <Link to={ROUTES.createArt}>
              <button className="art-piece__text__button">
                <span id="create_art_home_page">CREATE ART</span>
              </button>
            </Link>
          </div>
          <div className="art-piece__img">
            <img src={artPiece} alt="img" />
            <div className="artist">ART COMMISSION BY HAYLEY M_SYDNEY</div>
          </div>
        </div>
      </div>

      {scrollButton && (
        <div
          className="home__scroll-button-container"
          id="home_page_scroll_create_art"
        >
          <Link className="home__scroll-button" to={ROUTES.createArt}>
            <span>CREATE ART</span>
          </Link>
        </div>
      )}
      {type.os() !== "iOS" ? (
        <div className="first-parallax">
          <div className="upper-shadow" />
          <div className="lower-shadow" />
        </div>
      ) : (
        <ParallaxBanner
          layers={[
            {
              image: "/static/media/first-parallax.9c1381d5.webp",
              speed: -5,
            },
          ]}
          style={{ aspectRatio: "3/ 3", transition: "all ease-out" }}
        />
      )}

      <div className="our-story">
        <div className="our-story__text">
          <span className="title">Your story, not ours</span>
          <div className="line" />
             
          <span className="paragraph">
          We believe that everybody (and not just the few) should be able to commission an artist to create a highly-personalized work of art.
          </span>
         
          <span className="paragraph">
          That’s why we created Artyst.ai - a ‘smart’ A.I. art commissioning platform.
          </span>
          <span className="paragraph">
          We partner with existing and emerging artists, by first deconstructing, then reconstructing their style within the platform. Their artistic style is then innovatively combined with your chosen subject matter. This makes the art more meaningful to you - creating a visual connection to what’s important in your life. Strengthening memories and bringing a little happiness each and every day.
          </span>
        </div>
      </div>

      <div className="source">
        <img src={source1} alt="img" />
        <img src={source2} alt="img" />
        <img src={source3} alt="img" />
        <img src={source4} alt="img" />
      </div>

      <div className="art-3">
        <div className="art-3__text">
          <span className="paragraph">
          The creation of art is going through an exciting evolutionary phase.
          </span>
          <span className="paragraph">
          Our A.I. assisted approach to the commissioning of art is a great example of this. And we’ve only just started on our journey.
          </span>
          <span className="paragraph">
          We won’t claim to make the world a better place, but we know that we can make the world a happier place. One art piece at a time.
          </span>
        </div>
      </div>

      {type.os() !== "iOS" ? (
        <div className="second-parallax">
          <div className="upper-shadow" />
          <div className="lower-shadow" />
        </div>
      ) : (
        <ParallaxBanner
          layers={[
            {
              image: "/static/media/second-parallax.7fd1636d.webp",
              speed: -5,
            },
          ]}
          style={{ aspectRatio: "3/ 3", transition: "all ease-out" }}
        />
      )}

      <div className="mark">
        <div className="mark__text">
          <span className="artyst">Artists</span>
          <div className="line" />
          <span className="author">Mark Stott_Sydney</span>
          <span className="paragraph">
            We are delighted to welcome Mark to Artyst.ai as our first platform
            artist. Over the past 25 years, Mark has spent his time between
            London, New York and Sydney, designing and creating art for both
            himself, and some of the world’s most pioneering creative agencies,
            such as The Designers Republic and Attik.
          </span>
          <span className="paragraph">
            In Australia, Mark's been a board member of{" "}
            <a href="https://awardonline.com" rel="noreferrer" target="_blank">
              AWARD
            </a>{" "}
            and Vice Chairman of{" "}
            <a href="https://agda.com.au" rel="noreferrer" target="_blank">
              AGDA
            </a>
            , both key creative industry bodies. His work featured prominently
            in 2020's Rise Exhibition, where numerous renowned Australian
            artists came together to raise money for the BushFire appeal. Mark’s
            work has been sold in both The Design Museum in London, as well as
            New York’s Guggenheim Museum of Art.
          </span>
          <span className="style">Platform style_Layr</span>
          <span className="paragraph">
            Mark wanted to explore life's complexities through tone, contrast
            and repetition, resulting in highly textual, organic and intricate
            art pieces.
          </span>
          <span class="style more-art">More artists coming soon.</span>
        </div>
      </div>
          
       {type.os() !== "iOS" ? (
        <div className="third-parallax">
          <div className="upper-shadow" />
          <div className="lower-shadow" />
        </div>
      ) : ( 
        <ParallaxBanner
          layers={[
            {
              image: "/static/media/third-parallax.b1108c6a.webp",
              speed: -5,
            },
          ]}
          style={{ aspectRatio: "3/ 3", transition: "all ease-out" }}
        /> 
       )}

      <div className="canvas">
        <div className="canvas__content">
          <div className="canvas__content__desc">
            <div className="canvases">
              <div className="canvases__head">Product</div>
              <div className="canvases__line" />
              <div className="canvases__text">
                We believe in creating the highest quality products possible,
                whilst also being as environmentally responsible as we can. We
                feel that by creating products that actually last, is an
                important step towards sustainability. In fact, if our canvases
                are looked after correctly, they will last a lifetime.
              </div>
            </div>
            <div className="canvas--prices">
              <div className="canvas--prices__head">Our product prices</div>
              <div className="canvases__line" />
              <div className="canvas--prices__content">
                <table>
                  <tbody>
                  <tr>
                  <td className="download-icon">
                    <img src={Download} alt="download" />
                  </td>
                  <td>567k x 567k</td>
                  <td>FREE</td>
                  </tr>
                    {sizesArr.map((item) => {
                      return (
                        <tr key={item.letter}>
                          <td>{item.letter}</td>
                          <td>{item.size}</td>
                          <td>
                            {item.price !== null ? `A$${item.price}` : ""}
                          </td>
                        </tr>
                      );
                    })}
                    <tr>
                      <td>XL</td>
                      <td>Coming Soon</td>
                      <td></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div className="canvas__content__container">
            <div className="body">
              {CANVAS_TEXTS.map((item, index) => (
                <div className="body__item" key={item}>
                  <div className="img-wrap">
                    <img src={CANVAS_IMAGES[index]} alt="img" />
                  </div>
                  <div className="text">{item}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="canvas-example">
        <div className="examples">
          <img src={canvasExample1} alt="img" />
          <img src={canvasExample2} alt="img" />
          <img src={canvasExample3} alt="img" />
          <img src={canvasExample4} alt="img" />
        </div>
      </div>
    </div>
  );
};

export default Home;
