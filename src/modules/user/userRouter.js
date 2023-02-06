'use strict';

const express = require('express');
const lodash = require('lodash');
const {Op} = require('sequelize');


const userService = require("./userService");
// const mailchimp = require("@mailchimp/mailchimp_transactional")("c9aefa6d3b35e93cf66907c4cfa74675-us1");
const mailchimp = require("@mailchimp/mailchimp_transactional")("LaIttCW45DipLzCyeGLZoA");
const Mailchimp = require("@mailchimp/mailchimp_marketing")

const Mailchimp1 = require('../../helpers/mailchimp')
const User = require("../../models/user");
const Image = require("../../models/image");

const config = require('../../config/config');

const stripe = require('stripe')(config.STRIPE_SECRET_KEY);
const {mailSendContactPage} = require("../../../src/helpers/mailchimp")


const router = express.Router();

router.get('/', async function (req, res) {
    try {
        const response = await userService.getUsers();
        res.send(response);
    } catch (error) {
        res.status(error.status || 500).send(error);
    }
});

router.get('/:email', async function (req, res) {
    try {
        const {email} = req.params;
        // eslint-disable-next-line no-unused-vars
        const {
            password,
            ...user
        } = await userService.getUser({email});
        res.send(user);
    } catch (error) {
        res.status(error.status || 500).send(error);
    }
});

/* GET max no: of strings. */
router.post('/sign-in', async function (req, res) {
    try {
        const {email, googleId, name, password} = req.body;

        const userData = {
            email,
            googleId,
            name,
            password
        };
        let response;
        if (! lodash.isEmpty(googleId)) {
            response = await userService.singleSignOn(userData);
        } else {
            response = await userService.createUserSession(userData);
        }

        const code = response.accessToken ? 200 : 404;

        res.status(code).send(response);
    } catch (error) {
        res.status(error.status || 500).send(error);
    }
});

/* GET max no: of strings. */
router.post('/sign-up', async function (req, res) {
    try {
        const {
            email,
            googleId,
            name,
            password,
            referralCode,
            user_session
        } = req.body;

        const userData = {
            email,
            googleId,
            name,
            password,
            referralCode,
            user_session
        };

        let response;
        if (!lodash.isEmpty(googleId)) {
            response = await userService.singleSignOn(userData);
        } else {
            response = await userService.createUser(userData);
        }

        const code = response.accessToken ? 200 : 404;

        res.status(code).send(response);
    } catch (error) {
        console.log(error, "@@@@");
        res.status(error.status || 500).send(error);
    }
});

/* GET max no: of strings. */
router.post('/verify', async function (req, res) {
    try {
        const {verificationCode} = req.body;

        const userData = {
            verificationCode
        };

        const response = await userService.verifyUserEmail(userData);

        const code = response.success ? 200 : 400;

        res.status(code).send(response);
    } catch (error) {
        res.status(error.status || 500).send(error);
    }
});

router.post('/forgot-password', async function (req, res) {
    try {
        const {email} = req.body;

        const response = await userService.forgotPassword(email);
        const code = response.success ? 200 : 400;

        res.status(code).send(response);
    } catch (error) {
        res.status(error.status || 500).send(error);
    }
});

router.post('/reset-password', async function (req, res) {
    try {
        const {resetToken, password} = req.body;

        const userData = {
            resetToken,
            password
        };

        const response = await userService.resetPassword(userData);
        const code = response.success ? 200 : 400;

        res.status(code).send(response);
    } catch (error) {
        res.status(error.status || 500).send(error);
    }
});

router.post('/test', async function (req, res) {
    try {
        // let userObj = await Image.update({ reminderAt : null },{ where : { userId : req.body.id }});
        // let userObj2 = await Image.findAll({ where: { userId: req.body.id }, raw: true })
        // let userData = await User.findOne({ where: { id: req.body.id }, raw: true })
        //    // const response = await Mailchimp1.getMember({ mailchimpId: '975368d9d866e7094be86d4cd541a69b' });
        // // if (response.status == 'subscribed') {
        // //   console.log(response, "response......")
        // // }
        // let payload = {
        //     templateName: 'Reminder of Art Sitting in My Collection',
        //     email: userData.email,
        //     variables: [
        //         { name: 'link', content: 'https://artyst-web.lc3ftt08g7e16.ap-southeast-2.cs.amazonlightsail.com/create-art' },
        //         { name: 'link1', content: 'https://artyst-web.lc3ftt08g7e16.ap-southeast-2.cs.amazonlightsail.com/create-art' },
        //         { name: 'art1', content: userObj2[0].imgUrl },
        //         // { name: 'art2', content: 'https://artyst-web.lc3ftt08g7e16.ap-southeast-2.cs.amazonlightsail.com/create-art' },
        //         // { name: 'art3', content: 'https://artyst-web.lc3ftt08g7e16.ap-southeast-2.cs.amazonlightsail.com/create-art' },
        //         // { name: 'art4', content: 'https://artyst-web.lc3ftt08g7e16.ap-southeast-2.cs.amazonlightsail.com/create-art' },

        //     ]
        // }
        // Mailchimp1.sendTemplate(payload);

        let data = await Image.findAll({
            where: {
                userId: req.body.id,
                reminderAt: {
                    [Op.ne]: null
                }
            },
            raw: true
        });
        res.send({data: data})
    } catch (error) {
        console.log("------ERROR---------", error, '---------ERROR-------------');
        res.status(error.status || 500).send(error);
    }
});

router.post('/user_session', async function (req, res) {
    try {
        let user_session = req.body
   
        let data = await User.findOne({where: user_session});

        if (data === null) {

            return res.status(200).send({status: false})
        }
        if (data.user_session) {
            return res.status(200).send({status: true})
        }


    } catch (error) {
        console.log("------ERROR---------", error, '---------ERROR-------------');
        res.status(error.status || 500).send(error);
    }
});
router.post("/contact", async function (req, res) {
    try {
        const {email, name, description} = req.body;

        const userData = {
            email,
            name,
            description

        };


        let response;
        if (! lodash.isEmpty(userData)) {
            response = await mailSendContactPage(userData);

        }
        let sendObj = {
            templateName: 'Welcome Email',
            email: userData.email,
            name: userData.name,
            description: userData.description,
            variables: [
                {
                    email: userData.email,
                    name: userData.name,
                    description: userData.description
                }
            ]
        }
        const sendMail = Mailchimp1.sendTemplateContact(sendObj);

        const code = sendMail ? 200 : 404;

        res.status(code).send(sendMail);
    } catch (error) {
        res.status(error.status || 500).send(error);
    }
})


module.exports = router;
