const jsonwebtoken = require('jsonwebtoken');
const {logger} = require('../helpers/logger');

module.exports.verifyAuthToken = function (req, res, next) {
  try {
    let accessToken =
      req.query.accessToken ||
      req.body.accessToken;

    if (!accessToken && req.headers['authorization']) {
      accessToken = req.headers['authorization'].split(' ')[1];
    }
    const decoded = jsonwebtoken.verify(accessToken, 'artyst');
    req.userId = decoded.id;
    next();
  } catch (error) {
    res.status(error.status || 500).send(error);
  }
};
