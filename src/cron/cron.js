const moment = require('moment');
const CronJob = require('cron').CronJob;
const {literal, Op} = require('sequelize');

const {FRONT_END_URL} = require('../config/config');
const Referral = require('../models/referral')
const User = require('../models/user');
const Credit = require('../models/credit');
const Image = require('../models/image');
const Cart = require('../models/cart');
const Mailchimp = require('../helpers/mailchimp');
const {sendMail} = require('../helpers/mailer');

const updateReferredCount = async (referral) => {
  const start = new Date();
  const end = moment(referral.expiresAt);
  if (end.diff(start, 's') < 0) {
    await User.update({
      referrlCount: literal('referrlCount + 1')
    }, {
      where: {
        id: referral.referedBy
      }
    });
    await Referral.destroy({
      where: {
        id: referral.id
      }
    });
  }
};

//CronJob for notification
const checkInviteValidity = new CronJob('*/5 * * * *', async function () {
  try {
    const referralList = await Referral.findAll({
      raw: true
    });
    for (const referral of referralList) {
      await updateReferredCount(referral);
    }
  } catch (err) {
    console.log(err);
  }
});


const sendMyCollectionReminder = async (today, image) => {
  const reminderStart = moment(image.reminderAt);
  let sendEmail = false;
  let imageUpdate = {};

  if (
    image.reminderAt &&
    image.secondReminder === null &&
    image.thirdReminder === null &&
    Math.abs(reminderStart.diff(today, 'days')) > 1
  ) {
    sendEmail = true;
    imageUpdate = {
      secondReminder: Date.now()
    };
  } else if (
    image.secondReminder &&
    image.thirdReminder === null &&
    Math.abs(reminderStart.diff(today, 'days')) > 3
  ) {
    sendEmail = true;
    imageUpdate = {
      thirdReminder: Date.now()
    };
  } else if (
    image.thirdReminder &&
    Math.abs(reminderStart.diff(today, 'days')) > 7
  ) {
    sendEmail = true;
    imageUpdate = {
      reminderAt: null,
      secondReminder: null,
      thirdReminder: null,
    };
  }

  if (sendEmail) {
    await Image.update(imageUpdate, {
      where: {
        id: image.id
      }
    });
    const userData = await User.findOne({
      where: {
        id: image.userId
      },
      raw: true
    });

    if (userData && userData.mailchimpId) {
      const payload = {
        templateName: 'Reminder of Art Sitting in My Collection',
        email: userData.email,
        variables: [
          {
            name: 'link',
            content: `${FRONT_END_URL}/create-art`,
          },
          {
            name: 'link1',
            content: `${FRONT_END_URL}/create-art`,
          },
          {
            name: 'art1',
            content: image.imgUrl,
          },
        ]
      };
      const subscriberCheck = await Mailchimp.getMember({
        mailchimpId: userData.mailchimpId
      });
      if (subscriberCheck.status === 'subscribed') {
        await Mailchimp.sendTemplate(payload);
        await Mailchimp.editMember({
          id: userData.mailchimpId,
          tags: ['My_Collection_Reminder'],
        });
      }
    }
  }
}

const myCollectionReminder = new CronJob('*/2 * * * *', async function () {
  try {
    let imageList = await Image.findAll({
      where: {
        reminderAt: {
          [Op.ne]: null,
        },
      },
      raw: true
    });   //my collection reminder

    const today = new Date();
    for (const image of imageList) {
      await sendMyCollectionReminder(today, image);
    }

  } catch (err) {
    console.log(err);
  }
});

const sendUnusedCreditReminder = async (today, user) => {
  const reminderStart = moment(user.creditReminder);
  let sendEmail = false;
  let creditUpdate = {};

  let credit = await Credit.findOne({
    where: {
      userId: user.id
    },
    raw: true
  });

  if (
    user.creditReminder
    && credit.firstReminder === null
    && Math.abs(reminderStart.diff(today, 'days')) > 1
  ) {
    sendEmail = true;
    creditUpdate = {
      firstReminder: Date.now(),
    };
  } else if (
    credit.firstReminder
    && credit.secondReminder === null
    && Math.abs(reminderStart.diff(today, 'days')) > 3
  ) {
    sendEmail = true;
    creditUpdate = {
      secondReminder: Date.now(),
    };
  }

  if (sendEmail && user.wallet > 0 && user.mailchimpId) {
    await Credit.update(creditUpdate, {
      where: {
        id: credit.id
      }
    });

    const payload = {
      templateName: 'Registered RCG',
      email: user.email,
      variables: [
        {
          name: 'link',
          content: `${FRONT_END_URL}/create-art`,
        }
      ]
    }

    const subscriberCheck = await Mailchimp.getMember({
      mailchimpId: user.mailchimpId
    });
    if (subscriberCheck.status === 'subscribed') {
      await Mailchimp.sendTemplate(payload);
      await Mailchimp.editMember({
        id: user.mailchimpId,
        tags: ['Reminder_Unused_Credits'],
      });
    }
  }
}

const unusedCreditReminder = new CronJob('*/4 * * * *', async function () {
  try {
    const userList = await User.findAll({
      where: {
        creditReminder: {
          [Op.ne]: null,
        },
      },
      raw: true
    });

    const today = new Date();
    for (const user of userList) {
      await sendUnusedCreditReminder(today, user);
    }
  } catch (err) {
    console.log(err);
  }
});

const sendAbandonedCartReminder = async (today, cart) => {
  const reminderStart = moment(cart.firstReminder);
  let sendEmail = false;
  let cartUpdate = {};

  if (
    cart.firstReminder &&
    cart.secondReminder === null &&
    cart.thirdReminder === null &&
    Math.abs(reminderStart.diff(today, 'hours')) > 1
  ) {
    sendEmail = true;
    cartUpdate = {
      secondReminder: Date.now()
    };
  } else if (
    cart.secondReminder &&
    cart.thirdReminder === null &&
    Math.abs(reminderStart.diff(today, 'days')) > 1
  ) {
    sendEmail = true;
    cartUpdate = {
      thirdReminder: Date.now()
    };
  } else if (
    cart.thirdReminder &&
    Math.abs(reminderStart.diff(today, 'days')) > 3
  ) {
    sendEmail = true;
    cartUpdate = {
      firstReminder: null,
      secondReminder: null,
      thirdReminder: null,
    };
  }

  if (sendEmail) {
    await Cart.update(cartUpdate, {
      where: {
        id: cart.id
      }
    });
    const userData = await User.findOne({
      where: {
        id: cart.userId
      },
      raw: true
    });

    if (userData && userData.mailchimpId) {
      let payload = {
        templateName: 'Abandoned Cart',
        email: userData.email,
        variables: [
          {
            name: 'link',
            content: `${FRONT_END_URL}/my-cart`,
          }
        ]
      };
      const subscriberCheck = await Mailchimp.getMember({
        mailchimpId: userData.mailchimpId
      });
      if (subscriberCheck.status === 'subscribed') {
        await Mailchimp.sendTemplate(payload);
        await Mailchimp.editMember({
          id: userData.mailchimpId,
          tags: ['Abandoned_Cart'],
        });
      }
    }
  }
}

const abandonedCartReminder = new CronJob('*/6 * * * *', async function () {
  try {
    let cartList = await Cart.findAll({
      where: {
        itemList: {
          [Op.ne]: '[]',
        },
        firstReminder: {
          [Op.ne]: null,
        },
      },
      raw: true
    });

    const today = new Date();
    for (const cart of cartList) {
      await sendAbandonedCartReminder(today, cart);
    }
  } catch (err) {
    console.log(err);
  }
});


module.exports = {
  checkInviteValidity,
  myCollectionReminder,
  unusedCreditReminder,
  abandonedCartReminder
}
