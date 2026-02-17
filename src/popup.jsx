// popup.jsx

import React, { useEffect, useState } from 'react';
import { render } from 'react-dom';
import './styles/stylesheet.css';

function Popup() {
  const [highlights, setHighlights] = useState([]);
  const [showFallbackMessage, setShowFallbackMessage] = useState(false);
  // run fetchHighlights() once during the initial rendering of the component
  useEffect(() => {
    fetchHighlights();
  }, []);

  

  async function fetchHighlights() {
    try {
      const response = await chrome.runtime.sendMessage({ type: "FETCH_HIGHLIGHTS" });
      console.log("Response received in popup.jsx after fetching highlights:", response);
      setHighlights(response.highlights);
      if(response.highlights.length === 0){
        setShowFallbackMessage(true);
      }
    } catch (error) {
      console.error('Error occurred while fetching highlights:', error);
    }
  }

  async function handleDelete(highlightedText) {
    try {  
      const response = await chrome.runtime.sendMessage({
        type: "DELETE_HIGHLIGHT",
        highlightedText
      });
      fetchHighlights();
    } catch (error) {
      console.error('Error occurred while deleting highlight:', error);
    }
  }

  function copyHighlight(index)
  {
    let paragraph = document.querySelector(`#note-card-${index}`).getElementsByClassName("scrollable")[0];
    const paragraphText = paragraph.innerText;
    console.log(`Copying text: ${paragraphText}`);
    navigator.clipboard.writeText(paragraphText)
    .then(() => {
      let cardElelment = document.getElementById(`note-card-${index}`);
      let copyBtn = cardElelment.querySelector('.copy-button');
      copyBtn.innerText = "Copied!";
      setTimeout(() => copyBtn.innerText = "Copy", 3000);
    })
    .catch((error) => {
      console.error('Failed to copy text to clipboard:', error);
    });
  }
  return (
      <>
      {showFallbackMessage && <h1 class="fallback-message">You have no highlights for this page. Start highlighting to see them here!</h1>}
        {highlights.map((highlight, index) => (
          <div id={`note-card-${index}`} class={`note-card`} key={index}>
            <p class="scrollable">"{highlight.highlightedText}"</p>
            <p class="date">Created on: {highlight.dateCreated}</p>
            <div class="buttons-container">
              <button class="delete-button" onClick={() => {
                handleDelete(highlight.highlightedText);
              }}>Delete</button>
              <button class={`copy-button`} onClick={() => {
                copyHighlight(index);
              }}>Copy</button>
          </div>
          </div>
        ))}
      </>
  );
}

render(<Popup />, document.getElementById('highlightContainer'));

