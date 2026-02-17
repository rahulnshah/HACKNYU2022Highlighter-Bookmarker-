(async () => {
  // Create a style element (but don't attach selection rule yet)
  const style = document.createElement("style");
  document.head.appendChild(style);

  // When mouse is pressed → change selection color
  document.addEventListener("mousedown", () => {
    style.textContent = `
    ::selection {
      background: yellow;
      color: black;
    }
  `;
  });

  // When mouse is released → remove custom selection color
  document.addEventListener("mouseup", async () => {
    const selectedText = window.getSelection().toString().trim();
    if (selectedText) {
      // show user a confirmation dialog with the selected text
      const userConfirmed = confirm(
        `You selected: "${selectedText}". Do you want to send this to the background script?`,
      );
      if (userConfirmed) {
        // Send the selected text to the background script
        const payload = {
          type: "SAVE_HIGHLIGHT",
          highlightedText: selectedText,
          // Get the current date in YYYY-MM-DD format anf time in HH:MM pm am format
          dateCreated: new Date().toLocaleString("en-US", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          }),
          note: "", // default note value when creating a new highlight, can be updated later by user
        };
        const response = await chrome.runtime.sendMessage(payload);
        console.log(payload);
        console.log("Response from background:", response);
      }
    }
    style.textContent = "";
  });
})();
