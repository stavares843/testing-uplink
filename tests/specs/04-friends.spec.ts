import { resetAndLoginWithCache } from "../helpers/commands";
import ChatScreen from "../screenobjects/ChatScreen";
import FriendsScreen from "../screenobjects/FriendsScreen";
import WelcomeScreen from "../screenobjects/WelcomeScreen";

export default async function friends() {
  it("Validate Pre Release Indicator is displayed and has correct text", async () => {
    // Go to Friends Screen
    await resetAndLoginWithCache("FriendsTestUser");
    await WelcomeScreen.goToFriends();
    await FriendsScreen.waitForIsShown(true);

    // Validate Pre Release Indicator is displayed
    await expect(await FriendsScreen.prereleaseIndicator).toBeDisplayed();
    await expect(
      await FriendsScreen.prereleaseIndicatorText
    ).toHaveTextContaining("Pre-release");
  });

  it("Validate Nav Bar and buttons are displayed", async () => {
    await expect(await FriendsScreen.buttonNav).toBeDisplayed();
    await expect(await FriendsScreen.chatsButton).toBeDisplayed();
    await expect(await FriendsScreen.filesButton).toBeDisplayed();
    await expect(await FriendsScreen.friendsButton).toBeDisplayed();
    await expect(await FriendsScreen.settingsButton).toBeDisplayed();
  });

  it("Validate Sidebar is displayed in screen", async () => {
    await expect(await FriendsScreen.chatSearchInput).toBeDisplayed();
    await expect(await FriendsScreen.sidebar).toBeDisplayed();
    await expect(await FriendsScreen.sidebarChildren).toBeDisplayed();
    await expect(await FriendsScreen.sidebarSearch).toBeDisplayed();
  });

  it("Go to Friends Screen and validate elements displayed", async () => {
    await expect(await FriendsScreen.friendsLayout).toBeDisplayed();
    await expect(await FriendsScreen.settingsButton).toBeDisplayed();
  });

  it("User can type on user search input bar", async () => {
    await FriendsScreen.enterFriendDidKey("Hello");
    await expect(await FriendsScreen.addSomeoneInput).toHaveTextContaining(
      "Hello"
    );
    await FriendsScreen.deleteAddFriendInput();
  });

  it("User can copy its own ID by clicking on button", async () => {
    // Click on Copy ID button and grab clipboard value
    await FriendsScreen.clickOnCopyID();

    // Toast Notification is automatically closed quickly before validations are completed
    // wait for toast notification to disappear
    await (
      await FriendsScreen.toastNotification
    ).waitForExist({ reverse: true });
  });

  it("Switch to Pending Friends view and validate elements displayed", async () => {
    await FriendsScreen.goToPendingFriendsList();
    await expect(await FriendsScreen.incomingRequestsList).toBeDisplayed();
    await expect(await FriendsScreen.outgoingRequestsList).toBeDisplayed();
  });

  it("Switch to Blocked Friends view and validate elements displayed", async () => {
    await FriendsScreen.goToBlockedList();
    await expect(await FriendsScreen.blockedList).toBeDisplayed();
  });

  it("Switch to All Friends view and validate elements displayed", async () => {
    await FriendsScreen.goToAllFriendsList();
    await expect(await FriendsScreen.friendsList).toBeDisplayed();
  });

  it("Go to Chat with Friend from Friends List", async () => {
    const friendName = await FriendsScreen.getUserFromAllFriendsList();
    await FriendsScreen.chatWithFriend(friendName);

    //Validate Chat Screen is displayed and go back to Friends Screen
    await ChatScreen.waitForIsShown(true);
    await ChatScreen.typeMessageOnInput("testing...");
    await ChatScreen.clearInputBar();
    await ChatScreen.goToFriends();
    await FriendsScreen.waitForIsShown(true);
  });

  it("Validate tooltips for Unfriend/Block buttons are displayed", async () => {
    // Validate Unfriend button tooltip
    const friendName = await FriendsScreen.getUserFromAllFriendsList();
    const unfriendTooltip = await FriendsScreen.getUserTooltip(friendName, 0);
    const unfriendTooltipText = await FriendsScreen.getUserTooltipText(
      friendName,
      0
    );

    await FriendsScreen.hoverOnUnfriendDenyUnblockButton(friendName);
    await expect(unfriendTooltip).toBeDisplayed();
    await expect(unfriendTooltipText).toHaveTextContaining("Unfriend");

    // Validate Block button tooltip
    const blockTooltip = await FriendsScreen.getUserTooltip(friendName, 1);
    const blockTooltipText = await FriendsScreen.getUserTooltipText(
      friendName,
      1
    );

    await FriendsScreen.hoverOnBlockButton(friendName);
    await expect(blockTooltip).toBeDisplayed();
    await expect(blockTooltipText).toHaveTextContaining("Block");
  });

  it("Unfriend someone from Friends List", async () => {
    // Get a random user from list and unfriend it
    const friendName = await FriendsScreen.getUserFromAllFriendsList();
    await FriendsScreen.removeOrCancelUser(friendName);

    // Get current list of All friends and ensure that it does not include the removed user
    const allFriendsList = await FriendsScreen.getAllFriendsList();
    await expect(allFriendsList.includes(friendName)).toEqual(false);
  });

  it("Block someone from Friends List", async () => {
    // Get a random user from list and block the user
    const friendName = await FriendsScreen.getUserFromAllFriendsList();
    await FriendsScreen.blockUser(friendName);

    // Get current list of All friends and ensure that it does not include the blocked user
    const allFriendsList = await FriendsScreen.getAllFriendsList();
    await expect(allFriendsList.includes(friendName)).toEqual(false);

    // Go to Blocked List and validate that user is there now
    await FriendsScreen.goToBlockedList();
    const blockedFriendsList = await FriendsScreen.getBlockedList();
    await expect(blockedFriendsList.includes(friendName)).toEqual(true);
  });

  it("Validate tooltip for Deny Request button is displayed", async () => {
    // Go to Pending Requests Screen
    await FriendsScreen.goToPendingFriendsList();

    // Validate Deny Request button tooltip from Incoming List
    const friendName = await FriendsScreen.getUserFromIncomingList();
    const denyTooltip = await FriendsScreen.getUserTooltip(friendName, 0);
    const denyTooltipText = await FriendsScreen.getUserTooltipText(
      friendName,
      0
    );

    await FriendsScreen.hoverOnUnfriendDenyUnblockButton(friendName);
    await expect(denyTooltip).toBeDisplayed();
    await expect(denyTooltipText).toHaveTextContaining("Deny Request");
  });

  it("Validate tooltip for Unfriend button is displayed", async () => {
    // Validate Unfriend button tooltip from Outgoing List
    const outgoingFriendName = await FriendsScreen.getUserFromOutgoingList();
    const unfriendTooltip = await FriendsScreen.getUserTooltip(
      outgoingFriendName,
      0
    );
    const unfriendTooltipText = await FriendsScreen.getUserTooltipText(
      outgoingFriendName,
      0
    );

    await FriendsScreen.hoverOnUnfriendDenyUnblockButton(outgoingFriendName);
    await expect(unfriendTooltip).toBeDisplayed();
    await expect(unfriendTooltipText).toHaveTextContaining("Unfriend");
  });

  it("Accept incoming friend request", async () => {
    // Get a random user from Incoming Pending list and accept the request
    const friendName = await FriendsScreen.getUserFromIncomingList();
    await FriendsScreen.acceptIncomingRequest(friendName);

    // Get the current list of incoming requests and validate that user does not appear there now
    const incomingRequestsList = await FriendsScreen.getIncomingList();
    await expect(incomingRequestsList.includes(friendName)).toEqual(false);

    // Go to the current list of All friends and ensure that now includes the friend accepted
    await FriendsScreen.goToAllFriendsList();
    const allFriendsList = await FriendsScreen.getAllFriendsList();
    await expect(allFriendsList.includes(friendName)).toEqual(true);
  });

  it("Deny incoming friend request", async () => {
    // Go to Pending Requests Screen
    await FriendsScreen.goToPendingFriendsList();

    // Get a random user from Incoming Pending list and accept the request
    const friendName = await FriendsScreen.getUserFromIncomingList();
    await FriendsScreen.removeOrCancelUser(friendName);

    // Get the current list of incoming requests and validate that user does not appear there now
    const incomingRequestsList = await FriendsScreen.getIncomingList();
    await expect(incomingRequestsList.includes(friendName)).toEqual(false);

    // Go to the current list of All friends and ensure that denied user is not in friends list
    await FriendsScreen.goToAllFriendsList();
    const allFriendsList = await FriendsScreen.getAllFriendsList();
    await expect(allFriendsList.includes(friendName)).toEqual(false);
  });

  it("Unfriend/Cancel outgoing friend request", async () => {
    // Go to Pending Requests Screen
    await FriendsScreen.goToPendingFriendsList();

    // Get a random user from Outgoing Requests list and accept the request
    const friendName = await FriendsScreen.getUserFromOutgoingList();
    await FriendsScreen.removeOrCancelUser(friendName);

    // Get the current list of Outgoing Requests and validate that user does not appear there now
    const outgoingRequestsList = await FriendsScreen.getOutgoingList();
    await expect(outgoingRequestsList.includes(friendName)).toEqual(false);

    // Go to the current list of All friends and ensure that removed user is not in friends list
    await FriendsScreen.goToAllFriendsList();
    const allFriendsList = await FriendsScreen.getAllFriendsList();
    await expect(allFriendsList.includes(friendName)).toEqual(false);
  });

  it("Validate tooltips for Unblock button is displayed", async () => {
    // Go to Blocked Users Screen
    await FriendsScreen.goToBlockedList();

    // Validate Deny Request button tooltip from Incoming List
    const friendName = await FriendsScreen.getUserFromBlockedList();
    const unblockTooltip = await FriendsScreen.getUserTooltip(friendName, 0);
    const unblockTooltipText = await FriendsScreen.getUserTooltipText(
      friendName,
      0
    );

    await FriendsScreen.hoverOnUnfriendDenyUnblockButton(friendName);
    await expect(unblockTooltip).toBeDisplayed();
    await expect(unblockTooltipText).toHaveTextContaining("Unblock");
  });

  it("Unblock someone from blocked friends list", async () => {
    // Go to Blocked Users Screen
    await FriendsScreen.goToBlockedList();

    // Get a random user from Blocked list and click on Unblock button
    const friendName = await FriendsScreen.getUserFromBlockedList();
    await FriendsScreen.removeOrCancelUser(friendName);

    // Get the current list of Blocked list and validate that user does not appear there now
    const blockedList = await FriendsScreen.getBlockedList();
    await expect(blockedList.includes(friendName)).toEqual(false);

    // Go to the current list of All friends and ensure that unblocked user is not on friends list as expected
    await FriendsScreen.goToAllFriendsList();
    const allFriendsList = await FriendsScreen.getAllFriendsList();
    await expect(allFriendsList.includes(friendName)).toEqual(false);
  });

  it("Context Menu - Chat with Friend", async () => {
    // Open Context Menu from first user listed in Friends List
    const friendName = await FriendsScreen.getUserFromAllFriendsList();
    await FriendsScreen.openFriendContextMenu(friendName);

    // Select first option "Chat" from Context Menu and validate Chat is displayed
    await FriendsScreen.contextMenuOption[0].click();
    await ChatScreen.waitForIsShown(true);
    await ChatScreen.typeMessageOnInput("testing...");
    await ChatScreen.clearInputBar();

    // Go back to Friends Screen
    await ChatScreen.goToFriends();
    await FriendsScreen.waitForIsShown(true);
  });

  it("Context Menu - Add Friend to Favorites", async () => {
    // Open Context Menu from first user listed in Friends List
    let friendName = await FriendsScreen.getUserFromAllFriendsList();
    await FriendsScreen.openFriendContextMenu(friendName);

    // Select second option "Favorites" from Context Menu
    await FriendsScreen.contextMenuOption[1].click();

    // Validate that username and user image bubble is now displayed on Favorites Sidebar
    await (await FriendsScreen.favorites).waitForDisplayed();
    // Favorites Sidebar should be displayed
    await expect(await ChatScreen.favoritesUserImage).toBeDisplayed();
    await expect(
      await ChatScreen.favoritesUserIndicatorOffline
    ).toBeDisplayed();
    await expect(await ChatScreen.favoritesUserName).toHaveTextContaining(
      friendName.toUpperCase()
    );
  });

  it("Context Menu - Remove Friend from Favorites", async () => {
    // Open Context Menu from first user listed in Friends List
    const friendName = await FriendsScreen.getUserFromAllFriendsList();
    await FriendsScreen.openFriendContextMenu(friendName);

    // Select second option "Remove from Favorites" from Context Menu
    await FriendsScreen.contextMenuOption[1].click();

    // Validate that favorites is hidden now
    await (await FriendsScreen.favorites).waitForExist({ reverse: true });
  });

  it("Context Menu - Remove Friend", async () => {
    // Open Context Menu from first user listed in Friends List
    const friendName = await FriendsScreen.getUserFromAllFriendsList();
    await FriendsScreen.openFriendContextMenu(friendName);

    // Select fourth option "Remove" from Context Menu
    await FriendsScreen.contextMenuOption[2].click();

    // Get current list of All friends and ensure user was removed from list
    const allFriendsList = await FriendsScreen.getAllFriendsList();
    await expect(allFriendsList.includes(friendName)).toEqual(false);
  });

  it("Context Menu - Block Friend", async () => {
    // Open Context Menu from first user listed in Friends List
    const friendName = await FriendsScreen.getUserFromAllFriendsList();
    await FriendsScreen.openFriendContextMenu(friendName);

    // Select last option "Block" from Context Menu
    await FriendsScreen.contextMenuOption[2].click();

    // Get current list of All friends and ensure that it does not include the blocked user
    const allFriendsList = await FriendsScreen.getAllFriendsList();
    await expect(allFriendsList.includes(friendName)).toEqual(false);

    // Go to Blocked List and validate that user is there now
    await FriendsScreen.goToBlockedList();
    const blockedFriendsList = await FriendsScreen.getBlockedList();
    await expect(blockedFriendsList.includes(friendName)).toEqual(true);
  });

  it("Context Menu - Accept Incoming Request", async () => {
    // Go to Pending Requests Screen
    await FriendsScreen.goToPendingFriendsList();

    // Get a random user from Incoming Pending list and right click on it to get the context menu
    const friendName = await FriendsScreen.getUserFromIncomingList();
    await FriendsScreen.openFriendContextMenu(friendName);

    // Select the only option "Accept" from Context Menu
    await FriendsScreen.contextMenuOption[0].click();

    // Get the current list of incoming requests and validate that user does not appear there now
    const incomingRequestsList = await FriendsScreen.getIncomingList();
    await expect(incomingRequestsList.includes(friendName)).toEqual(false);

    // Go to the current list of All friends and ensure that accepted user is now in friends list
    await FriendsScreen.goToAllFriendsList();
    const allFriendsList = await FriendsScreen.getAllFriendsList();
    await expect(allFriendsList.includes(friendName)).toEqual(true);
  });

  it("Context Menu - Deny Incoming Request", async () => {
    // Go to Pending Requests Screen
    await FriendsScreen.goToPendingFriendsList();

    // Get a random user from Incoming Pending list and right click on it to get the context menu
    const friendName = await FriendsScreen.getUserFromIncomingList();
    await FriendsScreen.openFriendContextMenu(friendName);

    // Select the only option "Deny Request" from Context Menu
    await FriendsScreen.contextMenuOption[1].click();

    // Get the current list of incoming requests and validate that user does not appear there now
    const incomingRequestsList = await FriendsScreen.getIncomingList();
    await expect(incomingRequestsList.includes(friendName)).toEqual(false);

    // Go to the current list of All friends and ensure that denied user is not in friends list
    await FriendsScreen.goToAllFriendsList();
    const allFriendsList = await FriendsScreen.getAllFriendsList();
    await expect(allFriendsList.includes(friendName)).toEqual(false);
  });

  it("Context Menu - Cancel Outgoing Request", async () => {
    // Go to Pending Requests Screen
    await FriendsScreen.goToPendingFriendsList();

    // Get a random user from Outgoing Requests list and right click on it to get the context menu
    const friendName = await FriendsScreen.getUserFromOutgoingList();
    await FriendsScreen.openFriendContextMenu(friendName);

    // Select the only option "Cancel Request" from Context Menu
    await FriendsScreen.contextMenuOption[0].click();

    // Get the current list of Outgoing Requests and validate that user does not appear there now
    const outgoingRequestsList = await FriendsScreen.getOutgoingList();
    await expect(outgoingRequestsList.includes(friendName)).toEqual(false);

    // Go to the current list of All friends and ensure that removed user is not in friends list
    await FriendsScreen.goToAllFriendsList();
    const allFriendsList = await FriendsScreen.getAllFriendsList();
    await expect(allFriendsList.includes(friendName)).toEqual(false);
  });

  it("Context Menu - Unblock User", async () => {
    // Go to Blocked Users Screen
    await FriendsScreen.goToBlockedList();

    // Get a random user from Blocked list and right click on it to get the context menu
    const friendName = await FriendsScreen.getUserFromBlockedList();
    await FriendsScreen.openFriendContextMenu(friendName);

    // Select the only option "Unblock" from Context Menu
    await FriendsScreen.contextMenuOption[0].click();

    // Get the current list of Blocked list and validate that user does not appear there now
    const blockedList = await FriendsScreen.getBlockedList();
    await expect(blockedList.includes(friendName)).toEqual(false);

    // Go to the current list of All friends and ensure that unblocked user is not on friends list, as expected
    await FriendsScreen.goToAllFriendsList();
    const allFriendsList = await FriendsScreen.getAllFriendsList();
    await expect(allFriendsList.includes(friendName)).toEqual(false);
  });
}
