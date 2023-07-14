// popup.jsx

import React, { useEffect, useState } from 'react';
import { getCurrentTab } from './utils.js';
import { render } from 'react-dom';

function Popup() {
  const [highlights, setHighlights] = useState([]);
  const [currentUrl, setCurrentUrl] = useState("");

  // run fetchHighlights() once during the initial rendering of the component
  useEffect(() => {
    fetchHighlights();
  }, []);

  useEffect(() => {
    fetchCurrentUrl();
  }, []);

  async function fetchCurrentUrl()
  {
    try {
      const activeTab = await getCurrentTab();
      setCurrentUrl(activeTab.url);
    }
    catch(error)
    {
      console.error('Error occurred while fetching the current page url:', error);
    }
  }

  async function fetchHighlights() {
    try {
      const activeTab = await getCurrentTab();
      const currentUrl = activeTab.url;
      chrome.storage.sync.get([currentUrl], (result) => {
        if (chrome.runtime.lastError) {
          alert('Please Try Again. Error occurred while fetching all highlights:', chrome.runtime.lastError);
        } else {
          const allHighlights = result[currentUrl]?.length > 0 ? result[currentUrl] : ['You have no highlights'];
          setHighlights(allHighlights);
        }
      });
    } catch (error) {
      console.error('Error occurred while fetching highlights:', error);
    }
  }

  async function handleDelete(highlight) {
    try {
      const activeTab = await getCurrentTab();
      const currentUrl = activeTab.url;

      chrome.tabs.sendMessage(activeTab.id, {
        type: 'DELETE',
        myUrl: currentUrl,
        myHighlightedText: highlight,
      }, function () {
        fetchHighlights();
      });

    } catch (error) {
      console.error('Error occurred while deleting highlight:', error);
    }
  }

  function copyHighlight(highlight)
  {
    let linkElement = document.getElementById(highlight);
    const linkText = linkElement.innerText;
    navigator.clipboard.writeText(linkText)
    .then(() => {
      let copyBtn = linkElement.nextElementSibling.nextElementSibling;
      copyBtn.innerText = "Copied!";
      setTimeout(() => copyBtn.innerText = "Copy", 3000);
    })
    .catch((error) => {
      console.error('Failed to copy text to clipboard:', error);
    });
  }
  function renderDeleteAndCopyBtns(highlight) {
    if (highlight !== 'You have no highlights') {
      return (
        <><button onClick={() => {
          handleDelete(highlight);
        } }>
          Delete
        </button><button onClick={() => {
          copyHighlight(highlight);
        }}>Copy</button></>
      );
    }
  }

  function renderHighlight(highlight)
  {
    if(highlight !== 'You have no highlights')
    {
      return (<a id={highlight} href={currentUrl}>{highlight}</a>);
    }
    return highlight;
  }
  return (
    <div>
      <h1>Highlights</h1>
      <ul id="highlightContainer">
        {highlights.map((highlight) => (
          <li>
            {renderHighlight(highlight)}
            {renderDeleteAndCopyBtns(highlight)}
          </li>
        ))}
      </ul>
    </div>
  );
}

render(<Popup />, document.getElementById('highlightContainer'));

