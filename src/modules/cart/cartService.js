const lodash = require('lodash');

const Cart = require('../../models/cart');
const { logger } = require('../../helpers/logger');

const getCarts = async (userId) => {
  try {
    const carts = await Cart.findAll({ where: { userId } });
    logger.info('listCarts:success', carts);
    return carts;
  } catch (error) {
    logger.error('listCarts:failure', error);
    throw error;
  }
}

const saveCart = async (cartData) => {
  const { userId, itemList, totalPrice, firstReminder } = cartData;
  try {
    const cart = await Cart.findOne({ where: { userId } });
    if (lodash.isEmpty(cart)) {
      await Cart.create(cartData);
    } else {
      Cart.update({
        itemList,
        totalPrice,
        firstReminder,
      }, {
        where: {
          userId,
        },
      });
    }
    logger.info('saveCart:success');
    return ({
      message: 'Cart successfully saved!'
    });
  } catch (error) {
    logger.error(error);
    throw error;
  }
}

module.exports = { getCarts, saveCart };
