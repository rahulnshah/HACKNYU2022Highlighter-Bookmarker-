function myFunction_2()
{
    //change the back ground color of the selected text 
    var selObj = window.getSelection();
    
    if(selObj.toString().length > 0)
    {
      console.log(selObj.toString());
    }
}
document.getElementById("demo").addEventListener("mouseup", myFunction_2);
document.getElementById("demo").addEventListener("mouseup", function(){      
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
    let noButton = document.createElement("button");
    let lineBr = document.createElement("br");
    noButton.innerHTML = "No";
    flash.style.backgroundColor = "lightgreen";
    flash.style.border = "5px outset red";
    flash.appendChild(saveButton);
    flash.appendChild(lineBr);
    flash.appendChild(noButton);
});
