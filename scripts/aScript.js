
function myFunction_2()
{
    //change the back ground color of the selected text 
    var selObj = window.getSelection();
    
    if(selObj.toString().length > 0)
    {
      console.log(selObj.toString());
    }
}
document.body.addEventListener("mouseup", myFunction_2);
