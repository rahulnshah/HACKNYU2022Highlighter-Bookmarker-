import { getCurrentTab } from "./utils.js";

const handleFetchHighlights = async (sendResponse) => {
  const currentTab = await getCurrentTab();
  const myUrl = currentTab.url;
  const data = await chrome.storage.sync.get(myUrl);
  console.log("Data retrieved from storage in background.js:", data);
  if (data[myUrl] === undefined || data[myUrl].length === 0) {
    sendResponse({ highlights: [] });
  } else {
    sendResponse({ highlights: [...data[myUrl]] });
  }
};

const handleSaveHighlight = async (
  highlightedText,
  dateCreated,
  note,
  sendResponse,
) => {
  console.log("Entered save highlight block in background.js");
  if (highlightedText.length > 0) {
    const currentTab = await getCurrentTab();
    const myUrl = currentTab.url;
    const data = await chrome.storage.sync.get(myUrl);
    if (data[myUrl] === undefined) {
      await chrome.storage.sync.set({
        [myUrl]: [{ highlightedText, dateCreated, note }],
      });
      console.log(
        "No highlights found for this URL. Creating new entry in storage.",
      );
    } else {
      const newHighlights = [
        ...data[myUrl],
        { highlightedText, dateCreated, note },
      ];
      await chrome.storage.sync.set({ [myUrl]: newHighlights });
      console.log(
        "Existing highlights found for this URL. Appending new highlight to storage.",
        newHighlights,
      );
    }
    sendResponse({
      success: true,
      message: "Highlight saved successfully!",
    });
  }
};

const handleDeleteHighlight = async (highlightedText, sendResponse) => {
  // get the existing highlights and remove the highlighted text that u passed
  const currentTab = await getCurrentTab();
  const myUrl = currentTab.url;
  const data = await chrome.storage.sync.get(myUrl);
  if (data[myUrl] === undefined) {
    // if thiere is not url form in the storage then send response that there is no highlights to delete
    sendResponse({
      success: false,
      message: "No highlights to delete for this URL!",
    });
  } else {
    const copyOfHighlights = [...data[myUrl]];
    const newHighlights = copyOfHighlights.filter(
      (highlight) => highlight.highlightedText !== highlightedText,
    );
    await chrome.storage.sync.set({ [myUrl]: newHighlights });
    console.log(
      "Existing highlights found for this URL. Deleting the highlight from storage.",
      newHighlights,
    );
  }
  sendResponse({
    success: true,
    message: "Highlight deleted successfully!",
  });
};

const handleSaveNote = async (highlightedText, note, sendResponse) => {
  const currentTab = await getCurrentTab();
  const myUrl = currentTab.url;
  const data = await chrome.storage.sync.get(myUrl);
  if (data[myUrl] === undefined) {
    sendResponse({
      success: false,
      message: "No highlights found for this URL!",
    });
  } else {
    const copyOfHighlights = [...data[myUrl]];
    const newHighlights = copyOfHighlights.map((highlight) => {
      if (highlight.highlightedText === highlightedText) {
        return { ...highlight, note: note };
      } else {
        return highlight;
      }
    });
    await chrome.storage.sync.set({ [myUrl]: newHighlights });
    console.log(
      "Existing highlights found for this URL. Saving note to storage.",
      newHighlights,
    );
    sendResponse({
      success: true,
      message: "Note saved successfully!",
    });
  }
};

function handleMessages(message, sender, sendResponse) {
  try {
    const { type, highlightedText } = message;
    if (type === "FETCH_HIGHLIGHTS") {
      console.log("Entered fetch highlights block in background.js");
      handleFetchHighlights(sendResponse);
    } else if (type === "SAVE_HIGHLIGHT") {
      const { dateCreated } = message;
      const { note } = message;
      handleSaveHighlight(highlightedText, dateCreated, note, sendResponse);
    } else if (type === "DELETE_HIGHLIGHT") {
      handleDeleteHighlight(highlightedText, sendResponse);
    } else if (type === "SAVE_NOTE") {
      const { note } = message;
      handleSaveNote(highlightedText, note, sendResponse);
    }
  } catch (error) {
    console.error("Error in handling messages in background.js:", error);
    sendResponse({
      success: false,
      message: "An error occurred while processing the request.",
    });
  }
  return true;
}
chrome.runtime.onMessage.addListener(handleMessages);
