const { createClient } = require("redis");

const client = createClient({
  url: process.env.REDIS_URL, // or just undefined for default localhost
});

client.on("error", function (error) {
  console.error("Redis Client Error:", error);
});

// Ensure the client is connected before any command
(async () => {
  if (!client.isOpen) {
    await client.connect();
    console.log("Connected to Redis");
  }
})();

const setJWT = async (key, value) => {
  try {
    return await client.set(key, value);
  } catch (error) {
    throw error;
  }
};

const getJWT = async (key) => {
  try {
    return await client.get(key);
  } catch (error) {
    throw error;
  }
};

const deleteJWT = async (key) => {
  try {
    return await client.del(key);
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  setJWT,
  getJWT,
  deleteJWT,
};
