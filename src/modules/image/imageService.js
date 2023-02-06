const {literal} = require('sequelize');

const Image = require("../../models/image");
const User = require("../../models/user");
const Referral = require("../../models/referral");
const {logger} = require('../../helpers/logger');
const Mailchimp = require('../../helpers/mailchimp');
const config = require('../../config/config');


const listImages = async (userId = '') => {
  try {
    const images = await Image.findAll({where: {userId}});
    logger.info("listImages:success", images);
    return images;
  } catch (error) {
    logger.error("listImages:failure", error);
    throw error;
  }
}

const createImage = async (imageData) => {
  try {
    let count = await Image.findAll({
      where: {
        userId: imageData.userId
      },
      order: [
        ['createdAt', 'ASC'],
      ],
    });
    // if (count.length === 0) {
    //   let referredBy = await Referral.findOne({where: {userId: imageData.userId, creditAssigned: false}, raw: true});
    //   if (referredBy) {
    //     await User.update({
    //       wallet: literal('wallet + 20')
    //     }, {
    //       where: {
    //         id: referredBy.referedBy
    //       }
    //     });
    //     await Referral.update({
    //       creditAssigned: true
    //     }, {
    //       where: {
    //         id: referredBy.id
    //       }
    //     });
    //     let user = await User.findOne({where: {id: referredBy.referedBy}, raw: true})
    //     let sendObj = {
    //       templateName: 'Credits by Inviting Friends',
    //       email: user.email,
    //       variables: [
    //         {
    //           name: 'link',
    //           content: `${config.FRONT_END_URL}/create-art`,
    //         }
    //       ]
    //     }
    //     await Mailchimp.sendTemplate(sendObj);

    //     if (user.mailchimpId) {
    //       await Mailchimp.editMember({id: user.mailchimpId, tags: ['Invite_Credits']})
    //     }
    //   }
    //   imageData.reminderAt = Date.now();
    // }
    const image = await Image.create(imageData);
    logger.info("createImage:success");
    return ({
      id: image.id,
      message: 'Image successfully saved to collection!',
      success: true,
    });
  } catch (error) {
    console.log(error, "<<,,");
    logger.error(error);
    throw error;
  }
}

const deleteImage = async (imageData) => {
  try {
    let imageCheck = await Image.findOne({where: imageData, raw: true})
    if (imageCheck.reminderAt) {
      let allImage = await Image.findAll({
        where: {userId: imageData.userId}, order: [
          ['createdAt', 'ASC'],
        ],
      })
      if (allImage.length > 1) {
        Image.update({
          reminderAt: Date.now()
        }, {
          where: {
            id: allImage[0].id
          }
        })
      }
    }
    await Image.destroy({
      where: imageData,
    });

    logger.info("deleteImage:success");
    return ({
      message: 'Image successfully deleted from collection!'
    });
  } catch (error) {
    logger.error(error);
    throw error;
  }
}


module.exports = {listImages, createImage, deleteImage};
