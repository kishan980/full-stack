import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import PropTypes from 'prop-types';
import './styles/LevelBar.css';

const LevelBar = ({
  size,
  background,
  onChange,
  value,
}) => {
  const { height, width } = size
  const bar = useRef(null);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    const mouseDown = event => {
      if (bar.current.contains(event.target)) {
        setEditing(true);
      }
    };
    const mouseMove = event => {
      if (editing) {
        // Y coordinate difference as [0,1] (0 is full saturation)
        const xDifference = event.clientX - bar.current.getBoundingClientRect().x;
        const s = (1 - Math.min(width / 2, Math.max(0, xDifference / 2)) / width) * 100;
        onChange(parseFloat(s.toFixed(2)));
      }
    };
    const mouseUp = () => setEditing(false);

    window.addEventListener('mousedown', mouseDown);
    window.addEventListener('mousemove', mouseMove);
    window.addEventListener('mouseup', mouseUp);

    return () => {
      window.removeEventListener('mousedown', mouseDown);
      window.removeEventListener('mousemove', mouseMove);
      window.removeEventListener('mouseup', mouseUp);
    };
  }, [editing, onChange, size, width]);

  const indicatorPosition = useMemo(() => {
    let left = (width * 2) * (1 - value / 100) - width / 50 - 5
    if(left > 285){
      left = 285;
    }
    return { left };
  }, [width, value]);

  return (
    <div
      ref={bar}
      className="lightnessBar"
      style={{ background, backgroundColor: background, height: height / 15 }}
    >
      <div
        className='defaultHandle'
        style={{
          left: indicatorPosition.left,
          width: width / 15,
          height: height / 15,
          border: `${width * 0.005}px solid black`,
        }}
      />
    </div>
  );
};

LevelBar.propTypes = {
  /** Background in css format */
  background: PropTypes.string,
  size: PropTypes.shape({
    height: PropTypes.number,
    width: PropTypes.number
  }),
  /** zero saturation color string in css hsl format (hsl(0, 5%, 10%)). */
  onChange: PropTypes.func,
  /** current value level ([0,100]) */
  value: PropTypes.number,
};

LevelBar.defaultProps = {
  background: 'black',
  onChange: (() => {}),
  value: 100,
};
export default LevelBar;
