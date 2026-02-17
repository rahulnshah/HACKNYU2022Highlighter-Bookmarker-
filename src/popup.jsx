// popup.jsx

import React, { useEffect, useState } from 'react';
import { render } from 'react-dom';
import './styles/stylesheet.css';

function HighlightCard({highlight, index, refreshHighlights}) {

  const [note, setNote] = useState("");

  async function handleEditNote(highlightedText, note) {
      try{
            // save note to backend
            const response = await chrome.runtime.sendMessage({
              type: "SAVE_NOTE",
              highlightedText,
              note
            });
            refreshHighlights();
          }
        catch(error){
          console.error('Error occurred while saving note:', error);
        }
    }

  async function handleDelete(highlightedText) {
    try {  
      const response = await chrome.runtime.sendMessage({
        type: "DELETE_HIGHLIGHT",
        highlightedText
      });
      refreshHighlights();
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

  useEffect(() => {
    setNote(highlight.note);
  }, [highlight.note]);

  return (
    <div id={`note-card-${index}`} className={`note-card`} key={index}>
            <p className="scrollable">"{highlight.highlightedText}"</p>
            <p className="date">Created on: {highlight.dateCreated}</p>
            <textarea className="note-input" placeholder="Add a note to this highlight..." value={note} onChange={(e) => setNote(e.target.value)}></textarea>
            <div className="buttons-container">
              <button className="delete-button" onClick={() => {
                handleDelete(highlight.highlightedText);
              }}>Delete</button>
              <button className={`copy-button`} onClick={() => {
                copyHighlight(index);
              }}>Copy</button>
              <button className="save-note-button" onClick={() => {
            handleEditNote(highlight.highlightedText, note);
              }}>Save Note</button>
          </div>
          </div>
  );
}

function Popup() {
  const [highlights, setHighlights] = useState([]);
  const [showFallbackMessage, setShowFallbackMessage] = useState(false);

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
  // run fetchHighlights() once during the initial rendering of the component
  useEffect(() => {
    fetchHighlights();
  }, []);


  return (
      <>
      {showFallbackMessage && <h1 className="fallback-message">You have no highlights for this page. Start highlighting to see them here!</h1>}
        {highlights.map((highlight, index) => (
          <HighlightCard highlight={highlight} index={index} key={index} refreshHighlights={fetchHighlights}/>
        ))}
      </>
  );
}

render(<Popup />, document.getElementById('highlightContainer'));

