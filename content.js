
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  const {type, myUrl} = message;
  // console.log("url", myUrl);
  if(type === "NEW")
  {
    document.addEventListener("mouseup", function highlightIt() {
      const selection = window.getSelection();
      let highlightedText = selection.toString(); // Get the selected text
      // Print the highlighted text in the console
      console.log("Highlighted Text:", highlightedText);
      /*
      const range = selection.getRangeAt(0);
      const span = document.createElement("span");
      span.style.backgroundColor = "yellow";
      range.surroundContents(span);
      */
    
      // add the highlighted text to the value (which is an array of unique elements) for that url
      if(highlightedText.length > 0)
      {
        // run the get query 
        chrome.storage.sync.get([myUrl]).then((result) => {
          if(result[myUrl])
          {
            // url is in array so push the highlisghted text inside it and reset the value of the url
            let existingHighlights = result[myUrl];
            let existingHighlight = existingHighlights.find(val => val === highlightedText);
            if(existingHighlight)
            {
              console.log(`The hightlight ${highlightedText} has been highlighted!`);
            }
            else
            {
              existingHighlights.push(highlightedText);
              const storageObject = {};
              storageObject[myUrl] = existingHighlights;
              chrome.storage.sync.set(storageObject).then(() => {
                console.log(`The highlight ${highlightedText} has been saved!`);
                chrome.storage.sync.get([myUrl]).then((result) => {
                  console.log("existingHighlights", result);
                });
              });
            }
          }
          else
          {
            const storageObject = {};
            storageObject[myUrl] = [highlightedText];
            chrome.storage.sync.set(storageObject).then(() => {
              console.log(`The highlight ${highlightedText} has been saved!`);
              chrome.storage.sync.get([myUrl]).then((result) => {
                console.log("existingHighlights", result);
              });
            });
          }
        });
      }
      else
      {
        console.log("Please highlight something first!");
      }
    });

    document.addEventListener("mousedown", function() {
      console.log("mouse down!");
    });

    
  }
  else if(type === "DELETE")
  {
    let { myHighlightedText } = message;
    // get the existing highlights and remove the highlighted text that u passed
    chrome.storage.sync.get([myUrl]).then((result) => {
      let existingHighlights = result[myUrl];
      existingHighlights = existingHighlights.filter(val => val !== myHighlightedText);
      // push the modified array into chrome.storage.sync
      const storageObject = {};
      storageObject[myUrl] = existingHighlights;
      chrome.storage.sync.set(storageObject).then(() => {
        console.log(`The highlight ${myHighlightedText} has been deleted!`);
        chrome.storage.sync.get([myUrl]).then((result) => {
          console.log("existingHighlights", result);
        });
        sendResponse(existingHighlights);
      });
    });    
  }
}
);
