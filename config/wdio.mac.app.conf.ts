const fsp = require("fs").promises;

import config from "./wdio.shared.mac.appium.conf";
import { join } from "path";

// ============
// Specs
// ============
config.specs = [join(process.cwd(), "./tests/suites/*.ts")];

// ============
// Capabilities
// ============
// For all capabilities please check
// http://appium.io/docs/en/writing-running-appium/caps/#general-capabilities
config.capabilities = [
  {
    // The defaults you need to have in your config
    platformName: "mac",
    // For W3C the appium capabilities need to have an extension prefix
    // http://appium.io/docs/en/writing-running-appium/caps/
    // This is `appium:` for all Appium Capabilities which can be found here
    "appium:automationName": "mac2",
    // @ts-ignore
    "appium:bundleId": "im.satellite.uplink",
    "appium:serverStartupTimeout": 240000,
  },
];

config.afterTest = async function (test, describe, { error }) {
  if (error) {
    let imageFile = await driver.takeScreenshot();
    let imageFolder = join(process.cwd(), "./test-results/macos", test.parent);
    await fsp.mkdir(imageFolder, {recursive: true});
    await fsp.writeFile(
      imageFolder + "/" + test.title + " - Failed.png",
      imageFile,
      "base64"
    );
  }
};

exports.config = config;
