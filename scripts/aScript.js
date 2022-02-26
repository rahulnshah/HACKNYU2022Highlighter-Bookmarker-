const element = document.getElementById("myBtn");
element.addEventListener("click", myFunction);
function myFunction() {
    const inputtx = document.getElementById("textboxid");
    if(inputtx.value.length == 0)
    {
        alert("Input Box is empty");
    }
    else{
        document.getElementById("demo").innerHTML = inputtx.value;
    }
}
// function onCreated(node) {
//   console.log(node);
// }
function showPopup(){      
  let flash = document.getElementById("myDiv");
//let flashDiv = document.createElement("div");
  let outerDiv = document.createElement("div");
  //outerDiv.className = "row justify-content-center";
  let innerDiv = document.createElement("div");
  innerDiv.innerText = "Would you like to save this highlight?\n" + window.getSelection().toString();
  outerDiv.appendChild(innerDiv);
  flash.appendChild(outerDiv);
  let saveButton = document.createElement("button");
  saveButton.innerHTML = "Save";
  saveButton.setAttribute('id','saveBtn');

  //save button feature 
  saveButton.addEventListener("click", function(){
    //if url is not prvided, 
      let urlStr = document.getElementById("urlbox");
      if(urlStr.value.length > 0)
      {
        //create a bookmark, set the title as the highlighted text, and the url properties in a javascript object,
        //using the bookmarks api
        let i = this.previousSibling.innerText.indexOf('\n') + 1;
        let highlightedText = this.previousSibling.innerText.substring(i);
        console.log("hihlight", highlightedText);
        console.log("url", urlStr.value);
        //assumng highlighted text is < 60 chars getting error here
        
      }
      else{
        alert("provide url");
      }
  });




  let noButton = document.createElement("button");
  noButton.setAttribute('id','noBtn');
  noButton.addEventListener("click", function(){
    this.parentNode.parentNode.removeChild(this.parentNode);
  });
  //comment 
  let lineBr = document.createElement("br");
  noButton.innerHTML = "No";
  flash.style.backgroundColor = "lightgreen";
  flash.style.border = "5px outset red";
  outerDiv.appendChild(saveButton);
  outerDiv.appendChild(lineBr);
  outerDiv.appendChild(noButton);
}
function myFunction_2()
{
    //change the back ground color of the selected text 
    var selObj = window.getSelection();
    
    if(selObj.toString().length > 0)
    {
      showPopup();
    }
    else{
      alert("need to select text first.");
    }
}
document.getElementById("demo").addEventListener("mouseup", myFunction_2);
