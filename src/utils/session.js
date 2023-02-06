import jwtDecode from 'jwt-decode'

export const getSessionUser = (accessToken) => {
  if (accessToken) {
    const {id, email, name} = jwtDecode(accessToken);

    return ({
      id,
      email,
      name,
    });
  }

  return {};
}

export const getAccessToken = async ({callback, formData}) => {
  const {data} = await callback(formData);
  const {accessToken} = data;

  return accessToken;
}

export const getAccessTokenSubmit = async ({callback, formData}) => {
  try {
    const {data} = await callback(formData);
    const {accessToken} = data;

    return accessToken;
  } catch (e) {
    return false;
  }
}
