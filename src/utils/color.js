export const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

  return {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
  };
}

export const rgbToHex = ({r, g, b}) => {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

export const rgbToHsl = ({r, g, b}) => {
  r = r/255;
  g = g/255;
  b = b/255;

  let max = Math.max(r, g, b);
  let min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if (max === min){
    h = s = 0; // achromatic
  } else {
    let d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  h = Math.round(180*h);
  s = s*255;
  s = Math.round(s);
  l = l*255;
  l = Math.round(l);

  return {h, s, l};
}

export const rgb2hsv = ({r, g, b}) => {
  let rabs, gabs, babs, rr, gg, bb, h, s, v, diff, diffc, percentRoundFn;
  rabs = r / 255;
  gabs = g / 255;
  babs = b / 255;
  v = Math.max(rabs, gabs, babs);
  diff = v - Math.min(rabs, gabs, babs);
  diffc = c => (v - c) / 6 / diff + 1 / 2;
  percentRoundFn = num => Math.round(num * 100) / 100;
  if (diff === 0) {
    h = s = 0;
  } else {
    s = diff / v;
    rr = diffc(rabs);
    gg = diffc(gabs);
    bb = diffc(babs);

    if (rabs === v) {
      h = bb - gg;
    } else if (gabs === v) {
      h = (1 / 3) + rr - bb;
    } else if (babs === v) {
      h = (2 / 3) + gg - rr;
    }
    if (h < 0) {
      h += 1;
    }else if (h > 1) {
      h -= 1;
    }
  }
  return {
    h: Math.round(h * 360),
    s: Math.floor(percentRoundFn(s * 100)),
    v: Math.floor(percentRoundFn(v * 100))
  };
}

export const hslToRgb = ({h, s, l}) => {
  h /= 180;
  s /= 255;
  l /= 255;
  let r, g, b;
  if (s === 0) {
    r = g = b = l; // achromatic
  } else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = Math.floor(hue2rgb(p, q, h + 1 / 3) * 255);
    g = Math.floor(hue2rgb(p, q, h) * 255);
    b = Math.floor(hue2rgb(p, q, h - 1 / 3) * 255);
  }
  return {r, g, b};
}

export const getColorStyle = (hex, mode,select) => {

  let rgb = hexToRgb(hex);

  let {
    h: colorAHue,
    s: colorASaturation,
    l: colorALightness
  } = rgbToHsl(rgb);

  // let colorBHue = colorAHue;
  let colorCHue;
  let colorAHueDelta = Math.floor(-15 + (Math.random() * 31)); //between -15 and 15 (30 degrees in a 360 degree space)
  if(select === "style_1"){
  if (mode === 'complementary') {
       colorCHue = colorAHue - 90;  // Complementary color
  } else if (mode.includes('analogous')) {
      if (mode.includes('-30')) {
      colorAHueDelta = -15;
     
    } else if (mode.includes('+30')) {
      colorAHueDelta = +15;
  
    }
    colorCHue = colorAHue + colorAHueDelta;
    if (mode.includes('dull') && colorALightness > Math.floor(0.3 * 255)) {
      colorALightness = colorALightness - Math.floor(255 * 0.3);
    }
  }
  } else {
    if (mode === 'triadic') {
      colorCHue = colorAHue;  // triadic color
    } else if (mode.includes('triadic')) {
        if (mode.includes('-120')) {
        colorAHueDelta = -60;
      } else if (mode.includes('+120')) {
        colorAHueDelta = +60;
        
      }
      colorCHue = colorAHue + colorAHueDelta;
      // if (mode.includes('dull') && colorALightness > Math.floor(0.3 * 255)) {
      //   colorALightness = colorALightness - Math.floor(255 * 0.3);
      // }
    }
  }

  if (colorCHue < 0) {
    colorCHue = 180 + colorCHue;
  }

  let colorA = [colorAHue, colorASaturation, colorALightness, null];
  // let colorB = [colorBHue, 255, null, 96];
  // let colorC = [colorCHue, Math.floor(colorASaturation * 0.1), null, null];
  let colorD = [colorCHue, 255, null, -64];

  return [
    rgbToHex(hslToRgb({ h: colorA[0], s: colorA[1], l: colorA[2]})),
    rgbToHex(hslToRgb({ h: colorD[0], s: colorD[1], l: colorA[2]})),
    rgbToHex(hslToRgb({ h: colorD[0], s: colorD[1], l: colorA[2]})),
  ];
}
