'use strict';

const Interaction = require("../../models/interaction");
const {logger} = require("../../helpers/logger");
const {literal} = require('sequelize');
const crypto = require('crypto');

const User = require("../../models/user");
const Credit = require("../../models/credit");
const Referral = require("../../models/referral");
const {FRONT_END_URL} = require('../../config/config');
const {sendMail} = require('../../helpers/mailer');
const Mailchimp = require('../../helpers/mailchimp')


const creditForReading = async (req) => {
  try {
    let obj = await Credit.findOne({where: {userId: req.userId}, raw: true})
   
    if (obj && obj.signingBonousAt) {
      return ({
        message: 'Already bonus assigned.',
        success: false,
      });
    }
    await User.update({
      wallet: literal('wallet + 100'),
      creditReminder: Date.now()
    }, {
      where: {
        id: req.userId
      }
    });
    await Credit.update({
      signingBonousAt: Date.now()
    }, {
      where: {
        userId: req.userId
      }
    });
    let userData = await User.findOne({where: {id: req.userId}, raw: true})
    // let sendObj = {
    //     templateName: 'Composition Guide Credits',
    //     email: userData.email,
    //     variables: []
    // }
    // Mailchimp.sendTemplate(sendObj);
    if (userData.mailchimpId) {
      Mailchimp.editMember({id: userData.mailchimpId, tags: ['Comp_Credits']})
    }
    return ({
      message: 'Amount credited successfully',
      success: true,
    })
  } catch (error) {
    console.log("creditForReading:failure", error);
    throw error;
  }
};

const blockSignUpPopUp = async (req) => {
  try {
    await Credit.update({
      alertOnSignUp: true
    }, {
      where: {
        userId: req.userId
      }
    });
    return ({
      message: 'Pop up blocked successfully !!',
      success: true,
    })
  } catch (error) {
    console.log("blockSignUpPopUp", error);
    throw error;
  }
};

const blockInvitePopUp = async (req) => {
  try {
    await Credit.update({
      alertForInvite: true
    }, {
      where: {
        userId: req.userId
      }
    });
    return {
      message: 'Pop up blocked successfully !!',
      success: true,
    }
  } catch (error) {
    logger.error("blockInvitePopUp:failure", error);
    throw error;
  }
};

const fetchPreferenceData = async (req) => {
  try {
    const userData = await User.findOne({where: {id: req.userId}, raw: true})
    const userPreferences = await Credit.findOne({where: {userId: req.userId}, raw: true})
    return ({
      message: 'Fetched successfully !!',
      wallet: userData.wallet,
      signupPopup: !!userPreferences.signingBonousAt,
      alertOnSignUp: userPreferences.alertOnSignUp,
      success: true,
    })
  } catch (error) {
    logger.error("fetchPreferenceData:failure", error);
    throw error;
  }
};

const sendReferral = async (req) => {
  try {
    const inviteList = req.body.inviteList;
  
    let checkUser = await User.findOne({where: {id: req.userId}, raw: true})
     
    if (checkUser.referrlCount > 0) {
      if (inviteList.length <= parseInt(checkUser.referrlCount)) {
        for (let i = 0; i < inviteList.length; i++) {
          let check = await Referral.findOne({where: {email: inviteList[i]}, raw: true})
          
          if (check) {
            return ({
              message: 'Duplicate invite found !!!',
              success: false,
            })
          }
        }
        await User.update({
          referrlCount: literal(`referrlCount - ${inviteList.length}`)
        }, {
          where: {
            id: req.userId
          }
        });
   
        let today = new Date();
        // let resultDate = today.setDate(today.getDate() + 21)
        let resultDate = today.setMinutes(today.getMinutes() + 15)
        inviteList.forEach(async (invite) => {
          let link = crypto.randomBytes(10).toString("hex");
        
          await Referral.create({
            link: link,
            email: invite,
            referedBy: req.userId,
            expiresAt: resultDate
          })
         
          const invitationLink = `${FRONT_END_URL}/?code=${encodeURIComponent(link)}`;
         
          let payload = {
            templateName: 'Referral Invite',
            email: invite,
            variables: [{
              name: 'link',
              content: invitationLink
            }]
          }
          Mailchimp.sendTemplate(payload);
        })
     
        return ({
          message: 'Referral sent successfully !!',
          success: true,
        })
      }
      return ({
        message: 'Referral limit over !!',
        success: false,
      })
    }
    return ({
      message: 'Referral limit over !!',
      success: false,
    })
  } catch (error) {
    logger.error("sendReferral:failure", error);
    console.log(error)
    throw error;
  }
};

const getWallet = async (req, res, next) => {
  try {
    let userData = await User.findOne({where: {id: req.userId}, raw: true})
    return ({
      wallet: userData.wallet,
      success: true,
    })
  } catch (error) {
    next(error);
  }
};
module.exports = {creditForReading, blockSignUpPopUp, blockInvitePopUp, fetchPreferenceData, sendReferral, getWallet};
