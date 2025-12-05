const { ResetPinSchema } = require("./RestPin.schema");

const { randomPinNumber } = require("../../utils/randomGenerator");

const setPasswordRestPin = async (email) => {
  try {
    // Generate 6 digit pin
    const pinLength = 6;
    const randPin = randomPinNumber(pinLength);

    const restObj = {
      email: email.toLowerCase(),
      pin: randPin,    
    };

    // Use new to create a new document instance
    const savedPin = await new ResetPinSchema(restObj).save();
    return savedPin;
  } catch (error) {
    console.error("Error setting password reset pin:", error);
    throw error;
  }
};

const getPinByEmailPin = async (email, pin) => {
  try {
    const data = await ResetPinSchema.findOne({ email, pin });
    return data;
  } catch (error) {
    console.error("Error finding pin:", error);
    return null;
  }
};

const deletePin = async (email, pin) => {
  try {
    const result = await ResetPinSchema.findOneAndDelete({ email, pin });
    return result;
  } catch (error) {
    console.error("Error deleting pin:", error);
    throw error;
  }
};

module.exports = {
  setPasswordRestPin,
  getPinByEmailPin,
  deletePin,
};