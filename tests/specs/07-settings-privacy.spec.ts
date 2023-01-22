import UplinkMainScreen from "../screenobjects/UplinkMainScreen";
import SettingsMainScreen from "../screenobjects/SettingsMainScreen";
import { loginWithRandomUser } from "../helpers/commands";

describe("Settings - Privacy - Tests", async () => {
  before(async () => {
    await loginWithRandomUser();
    await UplinkMainScreen.goToSettings();
    await SettingsMainScreen.waitForIsShown(true);
    await SettingsMainScreen.goToPrivacySettings();
  });

  xit("Settings Privacy - Assert screen texts", async () => {});
});
