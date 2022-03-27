"use strict";
// Add a listener to create the initial context menu items,
// context menu items only need to be created at runtime.onInstalled
chrome.runtime.onInstalled.addListener(function () {
  chrome.contextMenus.create({
    id: "key",
    title: "Catch Widget",
    type: "normal",
    contexts: ["selection"],
  });
});

chrome.contextMenus.onClicked.addListener(function (item, tab) {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {command: "CATCH",widget:item.selectionText}, function(response) {
    });
  });
});
