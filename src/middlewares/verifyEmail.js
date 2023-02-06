const { getUser } = require('../modules/user/userService');

module.exports.verifyEmail = async (req, res, next) => {
  try {
    const where = {
      id: req.userId,
    };

    const user = await getUser(where);

    if (!user.verifiedAt) {
      res.status(400).send({ message: 'User is not verified!', error: 'NOT_VERIFIED' });
    } else {
      next();
    }
  } catch (error) {
  }
};
