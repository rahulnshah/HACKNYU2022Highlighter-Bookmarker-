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
  let noButton = document.createElement("button");
  noButton.setAttribute('id','noBtn');
  noButton.addEventListener("click", function(){
    this.parentNode.parentNode.removeChild(this.parentNode);
  });
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
