const Order = require("../../models/order");
const { literal } = require('sequelize');
const User = require("../../models/user");

const createOrder = async (data) => {
  console.log("order data==============", data);
  try {
    if (data.discount > 0) {
      let toDeduct = data.discount / 100
      let update = await User.update({
        wallet: literal(`wallet - ${toDeduct}`)
      }, {
        where: {
          id: data.userId
        }
      });
      console.log("=======>>>>",update,'*****',toDeduct,"<<<<<<<<<==== update")
    }
    await Order.create(data);
    console.log('!!!!!!!!!!!! ORDER CREATED !!!!!!!!!!!!')
    return ({
      message: 'order successfully saved to collection!'
    });
  } catch (error) {
    throw error;
  }
}

module.exports = { createOrder };
