"use strict";
var toast = document.createElement('div');
toast.id = 'fwcsnackbar';
document.body.appendChild(toast);






function myFunction(widget) {
  // Get the snackbar DIV
  var toast = document.getElementById("fwcsnackbar");
  toast.innerHTML="Copied "  +widget+"()" ;
  // Add the "show" class to DIV
  toast.className = "show";

  // After 3 seconds, remove the show class from DIV
  setTimeout(function(){ toast.className = toast.className.replace("show", ""); }, 1500);
}

 function  snapSelectionToWord() {
  var stack = [];
  let selection = window.getSelection();
  selection.modify("extend", "forward", "character");
  if (selection.toString().charAt(selection.toString().length - 1) == "("){
    stack.push("(");
  }
    while (stack.length > 0) {
      selection.modify("extend", "forward", "character");
      var last = selection.toString().charAt(selection.toString().length - 1);
      switch (last) {
        case "(":
          stack.push(last);
          break;
        case ")":
          stack.at(-1) == "(" ? stack.pop() : stack.push(last);
          break;
        case "{":
          stack.push(last);
          break;
        case "}":
          stack.at(-1) == "{" ? stack.pop() : stack.push(last);
          break;
        case "[":
          stack.push(last);
          break;
        case "]":
          stack.at(-1) == "[" ? stack.pop() : stack.push(last);
          break;
        default:
          break;
        // code block
      }
    }
    navigator.clipboard.writeText(selection.toString());
}

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.command === "CATCH"){
      snapSelectionToWord()
      sendResponse({status:"DONE"})
      myFunction(request.widget)
    }
  }
);