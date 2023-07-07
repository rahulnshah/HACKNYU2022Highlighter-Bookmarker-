// popup.jsx

import React, { useEffect, useState } from 'react';
import { getCurrentTab } from './utils.js';
import { render } from 'react-dom';

function Popup() {
  const [highlights, setHighlights] = useState([]);

  // run fetchHighlights() once during the initial rendering of the component
  useEffect(() => {
    fetchHighlights();
  }, []);

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
      },function(){
        fetchHighlights();
      });

    } catch (error) {
      console.error('Error occurred while deleting highlight:', error);
    }
  }

  function renderDeleteButton(highlight) {
    if (highlight !== 'You have no highlights') {
      return (
        <button className="delete-btn" onClick={() => handleDelete(highlight)}>
          Delete
        </button>
      );
    }
  }
  return (
    <div>
      <h1>Highlights</h1>
      <ul id="highlightContainer">
        {highlights.map((highlight, index) => (
          <li key={index}>
            {highlight}
            {renderDeleteButton(highlight)}
          </li>
        ))}
      </ul>
    </div>
  );
}

render(<Popup />, document.getElementById('highlightContainer'));

