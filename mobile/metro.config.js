const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Wrap the config with withNativeWind and point it to your CSS file
module.exports = withNativeWind(config, { input: "./global.css" });