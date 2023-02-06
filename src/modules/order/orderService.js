const Order = require("../../models/order");

const listOrdersByUserId = async (userId = '') => {
  try {
    const orders = await Order.findAll({where: {userId}, order: [['id', 'DESC']]} );
    return orders;
  } catch (error) {
    throw error;
  }
}

module.exports = {listOrdersByUserId};
