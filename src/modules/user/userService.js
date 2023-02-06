const jsonwebtoken = require('jsonwebtoken');
const lodash = require('lodash');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const emailValidator = require('email-validator');

const User = require('../../models/user');
const Referral = require('../../models/referral');
const Credit = require('../../models/credit');
const Mailchimp = require('../../helpers/mailchimp')
const config = require('../../config/config');
const {logger} = require('../../helpers/logger');
const {sendMail} = require('../../helpers/mailer');
const {FRONT_END_URL} = require('../../config/config');
const {literal} = require('sequelize');

const getUsers = async (where) => {
    try {
        const users = await User.findAll({where});
        logger.info("getUsers:success", users);
        return users.map(({dataValues}) => { // eslint-disable-next-line no-unused-vars
            const {
                password,
                ...user
            } = dataValues;

            return user;
        })
    } catch (error) {
        logger.error(error);
        throw error;
    }
}

const getUser = async (where) => {
    try {
        const {dataValues} = await User.findOne({where}) || {}

        logger.info("getUser:success", dataValues);
        return dataValues;
    } catch (error) {
        logger.error(error);
        throw error;
    }
}

const createUserSession = async (userData) => {
    try {
        const {email, password} = userData;

        const user = await getUser({email});
        if (lodash.isEmpty(user)) {
            return({success: false, message: 'Email not found'});
        }
        if (! lodash.isEmpty(user.googleId)) {
            return({success: false, message: 'Please use Google Sign-in'});
        }
        const validPassword = await bcrypt.compare(password, user.password);
        if (! validPassword) {
            return({success: false, message: 'Invalid password, Please try again'});
        }
        const payload = {
            id: user.id,
            name: user.name
        }

        if (email) {
            payload.email = email;
        }
        const accessToken = jsonwebtoken.sign(payload, 'artyst');
        const userPreferences = await Credit.findOne({
            where: {
                userId: user.id
            },
            raw: true
        })
        logger.info("createUserSession:success", accessToken);
        if (! lodash.isEmpty(userPreferences)) {
            return({
                accessToken,
                emailVerified: !! user.verifiedAt,
                wallet: user.wallet,
                signupPopup: !! userPreferences.signingBonousAt,
                alertOnSignUp: userPreferences.alertOnSignUp,
                alertForInvite: userPreferences.alertForInvite,
                referrlCount: user.referrlCount,
                success: true,
                message: 'Successfully logged in!'
            });
        }

        return({
            accessToken,
            emailVerified: !! user.verifiedAt,
            wallet: user.wallet,
            success: true,
            message: 'Successfully logged in!'
        });
    } catch (error) {
        logger.error(error);
        throw error;
    }
}

const createUser = async (userData) => {
    try {
        const {
            email,
            name,
            password,
            referralCode,
            user_session
        } = userData;
        let checkReferral;

        if (! emailValidator.validate(email)) {
            return({success: false, message: 'Email address is invalid'});
        }

        const existingUser = await getUser({email});

        if (! lodash.isEmpty(existingUser)) {
            if (! lodash.isEmpty(existingUser.googleId)) {
                return({success: false, message: 'Please use Google Sign-in'});
            }
            return({success: false, message: 'Email is already in use'});
        }
        // referral logic
        if (referralCode) {
            checkReferral = await Referral.findOne({
                where: {
                    link: referralCode,
                    email: email
                },
                raw: true
            });
        }
        const salt = await bcrypt.genSalt(10);
        // now we set user password to hashed password
        const hash = await bcrypt.hash(password, salt);

        // Generate a random verification code
        // We will send this code to the user via email
        const randomBytes = crypto.randomBytes(20).toString('hex');
        const verificationCode = crypto.createHash('sha256').update(randomBytes).digest('base64');
        const result = await Mailchimp.addMember({email: email, name: name})
        let newUser = {
            email,
            name,
            password: hash,
            verificationCode,
            user_session,
            mailchimpId: result.id
        };
        if (! lodash.isEmpty(checkReferral)) {
            newUser.referedBy = checkReferral.referedBy;

        }
        const user = await User.create(newUser);
        // create credit Model
        await Credit.create({userId: user.id});

        if (! lodash.isEmpty(checkReferral)) {
            await Referral.findOne({
                where: {
                    userId: user.id,
                    creditAssigned: false
                },
                raw: true
            });

            await Referral.update({
                userId: user.id,
                expiresAt: null
            }, {
                where: {
                    id: checkReferral.id
                }
            });

        }
        // Send verification email
        const verificationLink = `${FRONT_END_URL}/verify-email?code=${
            encodeURIComponent(verificationCode)
        }`;

        let sendObj = {
            templateName: 'Verify Email',
            email: user.email,
            variables: [
                {
                    name: 'link',
                    content: verificationLink
                }
            ]
        }
        Mailchimp.sendTemplate(sendObj);

        const payload = {
            id: user.id,
            name,
            email
        };

        const accessToken = jsonwebtoken.sign(payload, 'artyst');

        logger.info("createUser:success", accessToken);

        return({accessToken, wallet: user.wallet, success: true, message: 'User successfully registered!'});
    } catch (error) {
        logger.error(error);
        throw error;
    }
}

const singleSignOn = async (userData) => {
    try {
        const {
            email,
            googleId,
            name,
            referralCode,
            user_session
        } = userData;
        let userPreferences;
        let user;
        let checkReferral;

        const existingUser = await getUser({email});
        const payload = {
            name,
            email
        };
        let message;
        if (! lodash.isEmpty(existingUser)) {
            if (! lodash.isEmpty(existingUser.password)) {
                return({success: false, message: 'Please use email and password to sign-in'});
            }

            payload.id = existingUser.id;
            payload.name = existingUser.name;
            payload.email = existingUser.email;
            message = 'Successfully logged in!';
            userPreferences = await Credit.findOne({
                where: {
                    userId: existingUser.id
                }
            });
        } else { /**
             * CREATE USER
             */
            if (referralCode) {
                checkReferral = await Referral.findOne({
                    where: {
                        link: referralCode,
                        email: email
                    },
                    raw: true
                })
            }
            const result = await Mailchimp.addSocialMember({email: email, name: name})
            let dataObject = {
                email,
                name,
                googleId,
                user_session,
                verifiedAt: new Date(),
                mailchimpId: result.id
            };
            if (! lodash.isEmpty(checkReferral)) {
                dataObject.referedBy = checkReferral.referedBy;
            }
            user = await User.create(dataObject);
            if (! lodash.isEmpty(checkReferral)) {
                await Referral.update({
                    userId: user.id,
                    expiresAt: null
                }, {
                    where: {
                        id: checkReferral.id
                    }
                });

                // code my
                // let allReferById = await Referral.count({
                //     where: {
                //         referedBy: checkReferral.referedBy
                //     }
                // }, {raw: true})

                // if (allReferById > 10) {
                //     let userSend = await User.findOne({
                //         where: {
                //             id: checkReferral.referedBy
                //         },
                //         raw: true
                //     })

                //     let sendObjUserInviteCredits = {
                //         templateName: 'Credits by Inviting Friends',
                //         email: userSend.email,
                //         variables: [
                //             {
                //                 name: 'link',
                //                 content: `${
                //                     config.FRONT_END_URL
                //                 }/create-art`
                //             }
                //         ]
                //     }
                //    await Mailchimp.sendTemplate(sendObjUserInviteCredits);
               
                //     if (userSend.mailchimpId) {
                //         await Mailchimp.editMember({id: userSend.mailchimpId, tags: ['Invite_Credits']})
                //     }

                //     return({
                //         accessToken: jsonwebtoken.sign(payload, 'artyst'),
                //         wallet: ! lodash.isEmpty(existingUser) ? existingUser.wallet : user.wallet,
                //         signupPopup: !! userPreferences.signingBonousAt,
                //         alertOnSignUp: userPreferences.alertOnSignUp,
                //         alertForInvite: userPreferences.alertForInvite,
                //         referrlCount: ! lodash.isEmpty(existingUser) ? existingUser.referrlCount : user.referrlCount,
                //         success: true,
                //         message
                //     });

                // }
                // let userToBeCredited = await User.findOne({
                //     where: {
                //         id: checkReferral.referedBy
                //     }
                // })

                // if (userToBeCredited) {
                //     await User.update({
                //         wallet: literal('wallet + 20')
                //     }, {
                //         where: {
                //             id: checkReferral.referedBy
                //         }
                //     });
                //     await Referral.update({
                //         creditAssigned: true
                //     }, {
                //         where: {
                //             id: checkReferral.id
                //         }
                //     });

                //     let userSend = await User.findOne({
                //         where: {
                //             id: checkReferral.referedBy
                //         },
                //         raw: true
                //     })

                //     let sendObjUserInviteCredits = {
                //         templateName: 'Credits by Inviting Friends',
                //         email: userSend.email,
                //         variables: [
                //             {
                //                 name: 'link',
                //                 content: `${
                //                     config.FRONT_END_URL
                //                 }/create-art`
                //             }
                //         ]
                //     }
                //    await Mailchimp.sendTemplate(sendObjUserInviteCredits);
               
                //     if (userSend.mailchimpId) {
                //         await Mailchimp.editMember({id: userSend.mailchimpId, tags: ['Invite_Credits']})
                //     }

                // }

            }
            payload.id = user.id;
            message = 'User successfully registered!';

            let sendObj = {
                templateName: 'Welcome Email',
                email: email,
                variables: [
                    {
                        name: 'link',
                        content: `${FRONT_END_URL}/create-art`
                    }
                ]
            }
            await Mailchimp.sendTemplate(sendObj);
        }
        if (lodash.isEmpty(userPreferences)) {
            userPreferences = await Credit.create({userId: payload.id});
        }

        return {
            accessToken: jsonwebtoken.sign(payload, 'artyst'),
            wallet: ! lodash.isEmpty(existingUser) ? existingUser.wallet : user.wallet,
            signupPopup: !! userPreferences.signingBonousAt,
            alertOnSignUp: userPreferences.alertOnSignUp,
            alertForInvite: userPreferences.alertForInvite,
            referrlCount: ! lodash.isEmpty(existingUser) ? existingUser.referrlCount : user.referrlCount,
            success: true,
            message
        };


    } catch (error) {
        logger.error(error);
    }
}

const verifyUserEmail = async (userData) => {
    try {
        const {verificationCode} = userData;
      
        const where = {
            verificationCode
        };

        const user = await getUser(where);

        
        if (! lodash.isEmpty(user)) {
            if (user.verifiedAt) {
                return({error: 'ALREADY_VERIFIED', success: false, message: 'Already Verified!'});
            }

            if (user.verificationCode.toString() === verificationCode) {
                const updatedUser = await User.update({
                    verifiedAt: new Date()
                }, {
                    where: {
                        email: user.email
                    }
                });
           
                               
                if (user.mailchimpId) {
                    Mailchimp.editMember({id: user.mailchimpId, tags: ['Welcome']})
                    let payload = {
                        templateName: 'Welcome Email',
                        email: user.email,
                        variables: [
                            {
                                name: 'link',
                                content: `${FRONT_END_URL}/create-art`
                            }
                        ]
                    }
                    Mailchimp.sendTemplate(payload);
                }

                logger.info("verifyUserEmail:success", updatedUser);
                const payload = {
                    id: user.id,
                    name: user.name,
                    email: user.email
                };
                const userPreferences = await Credit.findOne({
                    where: {
                        userId: user.id
                    },
                    raw: true
                })

                let userToBeCreditedLast = await Referral.findOne({
                    where: {
                        userId: user.id
                    }
                })
                console.log("🚀 ~ file: userService.js ~ line 532 ~ verifyUserEmail ~ userToBeCreditedLast", userToBeCreditedLast)
                if(userToBeCreditedLast){
        
                let allReferById = await Referral.count({
                
                    where: {
                        referedBy: userToBeCreditedLast.referedBy
                    }
                }, {raw: true})
                console.log("🚀 ~ file: userService.js ~ line 540 ~ verifyUserEmail ~ allReferById", allReferById)
               
        
                if (allReferById > 10) { 
                    let userSend = await User.findOne({
                        where: {
                            id: user.referedBy
                        },
                        raw: true
                    })
                    let sendObjUserInviteCredits = {
                        templateName: 'Credits by Inviting Friends',
                        email: userSend.email,
                        variables: [
                            {
                                name: 'link',
                                content: `${
                                    config.FRONT_END_URL
                                }/create-art`
                            }
                        ]
                    }
                     await Mailchimp.sendTemplate(sendObjUserInviteCredits);
               
                    if (userSend.mailchimpId) {
                        await Mailchimp.editMember({id: userSend.mailchimpId, tags: ['Invite_Credits']})
                    }
                    return({
                        accessToken: jsonwebtoken.sign(payload, 'artyst'),
                        wallet: user.wallet,
                        signupPopup: !! userPreferences.signingBonousAt,
                        alertOnSignUp: userPreferences.alertOnSignUp,
                        alertForInvite: userPreferences.alertForInvite,
                        referrlCount: user.referrlCount,
                        success: true,
                        message: 'Successfully verified!'
                    });
                }
           
        
                let userToBeCreditedLastOld = await Referral.findOne({
                    where: {
                        userId: user.id
                    }
                })
                if(userToBeCreditedLastOld){

            
                let userToBeCredited = await User.findOne({
                    where: {
                        id: userToBeCreditedLastOld.referedBy
                    }
                })
                
        
                if (userToBeCredited) {
                   
                 const userUpdate =  await User.update({
                        wallet: literal('wallet + 20')
                    }, {
                        where: {
                            id: userToBeCreditedLastOld.referedBy
                        }
                    });
                    console.log("🚀 ~ file: userService.js ~ line 595 ~ verifyUserEmail ~ userUpdate", userUpdate)
                    
                 const updateReffer =  await Referral.update({
                        creditAssigned: true
                    }, {
                        where: {
                            id: userToBeCreditedLastOld.id
                        }
                    });
                  console.log("🚀 ~ file: userService.js ~ line 604 ~ verifyUserEmail ~ updateReffer", updateReffer)
                  
        
                }
                let userSend = await User.findOne({
                    where: {
                        id: userToBeCreditedLastOld.referedBy
                    },
                    raw: true
                })
                console.log("🚀 ~ file: userService.js ~ line 613 ~ verifyUserEmail ~ userSend", userSend)
              
                let sendObjUserInviteCredits = {
                    templateName: 'Credits by Inviting Friends',
                    email: userSend.email,
                    variables: [
                        {
                            name: 'link',
                            content: `${
                                config.FRONT_END_URL
                            }/create-art`
                        }
                    ]
                }
               
               await Mailchimp.sendTemplate(sendObjUserInviteCredits);
           
                if (userSend.mailchimpId) {
                    await Mailchimp.editMember({id: userSend.mailchimpId, tags: ['Invite_Credits']})
                }
            }
            }
      
                return({
                    accessToken: jsonwebtoken.sign(payload, 'artyst'),
                    wallet: user.wallet,
                    signupPopup: !! userPreferences.signingBonousAt,
                    alertOnSignUp: userPreferences.alertOnSignUp,
                    alertForInvite: userPreferences.alertForInvite,
                    referrlCount: user.referrlCount,
                    success: true,
                    message: 'Successfully verified!'
                });
            }
        }
        logger.info('failure');
        return({error: 'INVALID_CODE', success: false, message: 'Verification code is not valid!'});

    } catch (error) {
        logger.error(error)
    }
}

const forgotPassword = async (email) => {
    try {
        const where = {
            email
        };

        const user = await getUser(where);
        if (lodash.isEmpty(user)) {
            return({success: false, message: 'Email not found'});
        }
        if (! lodash.isEmpty(user.googleId)) {
            return({success: false, message: 'Please use Google Sign-in'});
        }

        if (user.mailchimpId) {
            Mailchimp.editMember({id: user.mailchimpId, tags: ['Reset_Password']})
        }
        const payload = {
            email
        };

        const resetToken = jsonwebtoken.sign(payload, 'artyst');
        // Send reset email
        const resetLink = `${FRONT_END_URL}/reset-password?resetToken=${resetToken}`;
        let sendObj = {
            templateName: 'Reset Password',
            email: user.email,
            variables: [
                {
                    name: 'link',
                    content: resetLink
                }
            ]
        }
        Mailchimp.sendTemplate(sendObj);

        logger.info("forgotPassword:success", resetToken);
        return({success: true, message: 'Successfully completed forgot password request!'});
    } catch (error) {
        logger.error(error);
    }
}

const resetPassword = async (userData) => {
    try {
        const {resetToken, password} = userData;

        const decoded = jsonwebtoken.verify(resetToken, 'artyst');
        const {email} = decoded;

        const where = {
            email
        };

        const user = await getUser(where);

        if (! lodash.isEmpty(user)) {
            const salt = await bcrypt.genSalt(10);
            // now we set user password to hashed password
            const hash = await bcrypt.hash(password, salt);

            const updatedUser = await User.update({
                password: hash
            }, {where: {
                    email
                }});

            const payload = {
                id: user.id,
                name: user.name,
                email
            };

            logger.info('resetUserPassword:success', updatedUser);
            return({
                accessToken: jsonwebtoken.sign(payload, 'artyst'),
                success: true,
                message: 'Successfully reset password!'
            });
        }
        logger.info('failure');
        return({success: false, message: 'Failed to reset password'});
    } catch (error) {
        logger.error(error);
    }
}

const userService = {
    getUsers,
    getUser,
    createUserSession,
    createUser,
    singleSignOn,
    verifyUserEmail,
    forgotPassword,
    resetPassword
}

module.exports = userService
