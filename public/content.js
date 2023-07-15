
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  try
  {
    const {type, myUrl} = message;
    // console.log("url", myUrl);
    if(type === "NEW")
    {
      document.addEventListener("mouseup", function highlightIt() {
        const selection = window.getSelection();
        // Get the selected text
        let highlightedText = selection.toString();
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
            if (chrome.runtime.lastError) 
            {
              alert("Please Try Again. Error occurred:", chrome.runtime.lastError);
            } 
            else 
            {
              // url is in array so push the highlisghted text inside it and reset the value of the url
              let existingHighlights = result[myUrl] || [];
              let existingHighlight = existingHighlights.find(val => val === highlightedText);
              if(existingHighlight)
              {
                alert(`The hightlight ${highlightedText} has been highlighted!`);
              }
              else
              {
                existingHighlights.push(highlightedText);
                const storageObject = {};
                storageObject[myUrl] = existingHighlights;
                chrome.storage.sync.set(storageObject).then(() => {
                  if (chrome.runtime.lastError) 
                  {
                    alert("Please Try Again. Error occurred:", chrome.runtime.lastError);
                  }
                  else
                  {
                    alert(`The highlight \'${highlightedText}\' has been saved!`);
                  }
                });
              }
            }
          });
        }
        else
        {
          alert("Please highlight something first!");
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
        if (chrome.runtime.lastError) 
        {
          alert("Please Try Again. Error occurred:", chrome.runtime.lastError);
        }
        else
        {
          let existingHighlights = result[myUrl];
          existingHighlights = existingHighlights.filter(val => val !== myHighlightedText);
          // push the modified array into chrome.storage.sync
          const storageObject = {};
          storageObject[myUrl] = existingHighlights;
          chrome.storage.sync.set(storageObject).then(() => {
            if (chrome.runtime.lastError) 
            {
              alert("Please Try Again. Error occurred:", chrome.runtime.lastError);
            }
            else{
              alert(`The highlight ${myHighlightedText} has been deleted!`);
              sendResponse(existingHighlights);
            }
          });
        }
      });    
    }
    return true;
  }
  catch(error)
  {
    console.error('Error occurred while fetching highlights:', error);
    return false;
  }
}
);
