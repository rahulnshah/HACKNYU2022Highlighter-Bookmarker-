// popup.jsx

import React, { useEffect, useState } from 'react';
import { getCurrentTab } from './utils.js';
import { render } from 'react-dom';
import './styles/stylesheet.css';

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
    let paragraph = document.getElementById(highlight);
    const paragraphText = paragraph.innerText;
    navigator.clipboard.writeText(paragraphText)
    .then(() => {
      let copyBtn = document.querySelector(".copy-button");
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
          <div class="buttons-container">
            <button class="delete-button" onClick={() => {
              handleDelete(highlight);
            }}>Delete</button>
            <button class="copy-button" onClick={() => {
              copyHighlight(highlight);
            }}>Copy</button>
          </div>
      );
    }
  }

  function renderHighlight(highlight)
  {
    if(highlight !== 'You have no highlights')
    {
      return (<p class="scrollable" id={highlight}>"{highlight}"</p>);
    }
    return (<p>{highlight}</p>);
  }
  return (
      <>
        {highlights.map((highlight) => (
          <div class="note-card">
            {renderHighlight(highlight)}
            {renderDeleteAndCopyBtns(highlight)}
          </div>
        ))}
      </>
  );
}

render(<Popup />, document.getElementById('highlightContainer'));

