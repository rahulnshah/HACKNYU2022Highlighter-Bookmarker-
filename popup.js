import { getCurrentTab } from "./utils.js";

function fetchHighlights(currentUrl)
{
  chrome.storage.sync.get([currentUrl]).then((result) => {
    if(result[currentUrl])
    {
      let allHighlights = result[currentUrl];
      viewHiglights(allHighlights);
    }
    else
    {
      flash("You Have No Highlights");
    }
  });
}

function flash(highlight) {
  let highlightsElement = document.getElementById("highlightContainer");
  //create a div (or whatever wrapper we want)
  let li = document.createElement("LI");

  //set the content
  li.innerText = `"${highlight}"`;
  li.setAttribute("id", highlight);
  //add the element to the DOM (if we don't it merely exists in memory)
  highlightsElement.appendChild(li);

  //add the Delete btn for each highlight
  if(highlight !== "You Have No Highlights")
  {
    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("delete-btn");
    deleteBtn.textContent = "Delete";
    li.appendChild(deleteBtn);
    deleteBtn.addEventListener("click", async function(){
      const activeTab = await getCurrentTab();
      let currentUrl = activeTab.url;
      let highlightedText = this.parentNode.getAttribute("id"); 
      let highlightElementToDelete = this.parentNode;
      highlightElementToDelete.parentNode.removeChild(highlightElementToDelete);

      chrome.tabs.sendMessage(activeTab.id, {
        type: "DELETE",
        myUrl: currentUrl,
        myHighlightedText : highlightedText
      }, function(){
        fetchHighlights(activeTab.url);
      });

    });
  }

}

function viewHiglights(highlights)
{
  if(highlights.length > 0)
  {
    const highlightsElement = document.getElementById("highlightContainer");
    highlightsElement.innerHTML = "";

    for(let highlight of highlights)
    {
      flash(highlight);
    }
  }
  else
  {
    flash("You Have No Highlights");
  }
}

document.addEventListener("DOMContentLoaded", async () => {
    const activeTab = await getCurrentTab();
    let pageUrl = activeTab.url;
    fetchHighlights(pageUrl);
  });