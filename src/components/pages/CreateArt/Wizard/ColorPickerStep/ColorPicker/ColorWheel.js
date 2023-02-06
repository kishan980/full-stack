import React, {
  useCallback, useEffect, useRef, useState,
} from 'react';
import PropTypes from 'prop-types';
import './styles/ColorWheel.css';
import { coordinatesToHS, hsToCoordinates } from './helpers/utils';
// import LevelBar from './LevelBar';

const ColorWheel = ({
  color,
  size,
  setColor,
}) => {
  const { height, width } = size
  const wheel = useRef(null);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    const mouseDown = event => {
      if (wheel.current.contains(event.target)) {
        setEditing(true);
      }
    };
    const mouseUp = () => {
      setEditing(false);
    };
    const mouseMove = event => {
      if (editing) {
        setColor(
          coordinatesToHS(
            (event.clientX - wheel.current.getBoundingClientRect().x) / width,
            (event.clientY - wheel.current.getBoundingClientRect().y) / height,
          ),
        );
      }
    };

    window.addEventListener('mousemove', mouseMove);
    window.addEventListener('mousedown', mouseDown);
    window.addEventListener('mouseup', mouseUp);

    return () => {
      window.removeEventListener('mousedown', mouseDown);
      window.removeEventListener('mouseup', mouseUp);
      window.removeEventListener('mousemove', mouseMove);
    };
  }, [editing, setColor, size, width, height]);

  const { x, y } = hsToCoordinates(color.h, color.s);

  const onMouseDown = useCallback(event => {
    setColor(
      coordinatesToHS(
        (event.clientX - event.currentTarget.getBoundingClientRect().x) / width,
        (event.clientY - event.currentTarget.getBoundingClientRect().y) / height,
      ),
    );
  }, [setColor, width, height]);

  return (
    <>
      <div className="colorWheel">
        <div
          ref={wheel}
          className="wheel"
          onMouseDown={onMouseDown}
          role="button"
          tabIndex={-5}
        >
          <div
            className="handle"
            style={{
              top: y * height,
              left: x * width,
              width: width / 15,
              height: height / 15,
              border: `${width / 150}px solid black`,
            }}
          />
        </div>
      </div>
    </>
  );
};

ColorWheel.propTypes = {
  /** Current picked color */
  color: PropTypes.shape({
    h: PropTypes.number,
    s: PropTypes.number,
    l: PropTypes.number,
  }),
  /** Size of color wheel */
  size: PropTypes.number.isRequired,
  /** Callback function to set color */
  setColor: PropTypes.func.isRequired,
};

ColorWheel.defaultProps = {
  color: {
    h: 0,
    s: 100,
    l: 50,
  },
};
export default ColorWheel;
