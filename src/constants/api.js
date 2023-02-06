export const BUCKET_NAME = 'artyst-web'
export const BUCKET_REGION = 'ap-southeast-2'
export const IDENTITY_POOL_ID = 'ap-southeast-2:8f281dda-fd6b-4822-b5fa-2c3d2fcaf6d5'
export const IMAGE_UPLOAD_API_URL = 'https://mjgxtm53drnzvrestdnizkwgoa0uhjwk.lambda-url.us-east-1.on.aws/'


export const ARTYST_API_URL = process.env.REACT_APP_ARTYST_API_URL
export const CANVAS_API_URL = process.env.REACT_APP_CANVAS_URL;
export const WORDPRESS_CHECKOUT_URL = process.env.REACT_APP_WORDPRESS_CHECKOUT_URL

export const CANVAS_API_HEADERS = process.env.REACT_APP_CANVAS_ENABLE_HEADER === '1' ? {
  'content-type': 'text/plain',
  accept: '*/*',
  'x-canvas-process': process.env.REACT_APP_CANVAS_HEADER,
} : {
  'content-type': 'text/plain',
  accept: '*/*',
};
