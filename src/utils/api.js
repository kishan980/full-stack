import axios from './axios'
import AWS from 'aws-sdk';

import {
  CANVAS_API_HEADERS,
  ARTYST_API_URL,
  BUCKET_NAME,
  BUCKET_REGION,
  IDENTITY_POOL_ID,
  CANVAS_API_URL,
} from "../constants/api";

AWS.config.update({
  region: BUCKET_REGION,
  credentials: new AWS.CognitoIdentityCredentials({
    IdentityPoolId: IDENTITY_POOL_ID
  })
});

const s3Bucket = new AWS.S3({
  apiVersion: '2006-03-01',
  params: { Bucket: BUCKET_NAME }
});

export const s3BucketUpload = async (filesList = []) => {
  const promises = filesList.map(({ file }) => (
    new Promise((resolve, reject) => {
      s3Bucket.upload({
        Bucket: BUCKET_NAME,
        Key: file.name,
        Body: file,
        ACL: 'private'
      }, (err, data) => {
        if (err) {
          reject(err)
        }
        resolve(data.Location);
      })
    })
  ));

  return await Promise.all(promises);
}

export const createImageCompositionRequest = async (imageCompositionData) => {
  try {
    const { data } = await axios.post(CANVAS_API_URL, imageCompositionData, { headers: CANVAS_API_HEADERS })

    const { '05_final': finals } = JSON.parse(data.text);
    return finals;
  } catch (error) {
    if (error?.response?.status === 503) {
      return await createImageCompositionRequest(imageCompositionData);
    }
  }
}

export const signIn = (data) => axios.post(`${ARTYST_API_URL}/users/sign-in`, data);
export const signUp = (data) => axios.post(`${ARTYST_API_URL}/users/sign-up`, data);

export const saveImage = (data) => axios.post(`${ARTYST_API_URL}/images`, data);
export const deleteImage = (data) => axios.delete(`${ARTYST_API_URL}/images`, { data: data });
export const fetchImagesListRequest = (params) => axios.get(`${ARTYST_API_URL}/images`, { params });
export const uploadImage = ({ data, accessToken }) => axios.post(`${ARTYST_API_URL}/images/upload`, data, { headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${accessToken}` } });

export const fetchOrdersListRequest = (params) => axios.get(`${ARTYST_API_URL}/orders`, { params });

export const trackInteraction = (data) => axios.post(`${ARTYST_API_URL}/interactions`, data);

export const verifyEmail = (data) => axios.post(`${ARTYST_API_URL}/users/verify`, data);
export const fetchProductItemsRequest = (params) => axios.get(`${ARTYST_API_URL}/webhook/lineitems`, {params});

export const forgotPassword = (data) => axios.post(`${ARTYST_API_URL}/users/forgot-password`, data);
export const resetPassword = (data) => axios.post(`${ARTYST_API_URL}/users/reset-password`, data);

export const fetchCart = (params) => axios.get(`${ARTYST_API_URL}/carts`, {params});
export const saveCart = (data) => axios.post(`${ARTYST_API_URL}/carts`, data);

export const postCredit = (data) => axios.post(`${ARTYST_API_URL}/credit`, data);
export const getCredit = (params) => axios.get(`${ARTYST_API_URL}/credit`, {params});
export const getWallet = (params) => axios.get(`${ARTYST_API_URL}/credit/wallet`,{params});
export const cancelCreditPopUp = (data) => axios.post(`${ARTYST_API_URL}/credit/cancelPopUp`, data);
export const sendReferral = (data) => axios.post(`${ARTYST_API_URL}/credit/referral`, data);
export  const userSession = (data) => axios.post(`${ARTYST_API_URL}/users/user_session`, data);
export const processCheckoutStripe = (data) => axios.post(`${ARTYST_API_URL}/checkout/create-checkout-session`, data);
