
const User = require("../../models/user");
const Credit = require("../../models/credit");
const Referral = require("../../models/referral");
const {logger} = require("../../helpers/logger");

const deleteShalin = async () => {
  try {
    const accounts = await User.findAll({
      where: { email: ['shalin@artyst.ai', 'shalintest123@gmail.com'] }
    });
    accounts.forEach(async (account) => {
      await Credit.destroy({
        where: { userId: account.id }
      });
      await account.destroy();
    });
    await Referral.destroy({
      where: { email: ['shalin@artyst.ai', 'shalintest123@gmail.com'] }
    });

    return ({
      message: 'Shalin user deleted',
      success: true,
    });
  } catch (error) {
    console.log(error);
    logger.error(error);
  }
}


const utilityService = {
  deleteShalin,
}

module.exports = utilityService;
