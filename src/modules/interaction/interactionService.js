'use strict';

const Interaction = require("../../models/interaction");
const {logger} = require("../../helpers/logger");


const listInteractions = async (userId) => {
  try {
    const interactions = await Interaction.findAll({where: {userId}});
    logger.info("listInteractions:success", interactions);
    return interactions;
  } catch (error) {
    logger.error("listInteractions:failure", error);
    throw error;
  }
};

const createInteraction = async (interactionData) => {
  try {
    await Interaction.create(interactionData);
    logger.info("createInteraction:success");
    return ({
      message: 'Interaction successfully saved!'
    });
  } catch (error) {
    logger.error(error);
    throw error;
  }
}

module.exports = {listInteractions, createInteraction};
