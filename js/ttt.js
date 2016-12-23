document.addEventListener("DOMContentLoaded", function() {
  playRecord = [[], [], [], [],
                [], [], [], []];
  console.log(playRecord);
  userChoice = 3;
  var elem = document.querySelector('.grid');
  
  var msnry = new Masonry(elem, {
    itemSelector: '.grid-item',
    columnWidth: 80,
    gutter: 1.5
  });

  var xchoice = document.getElementById("x-button");
  var ochoice = document.getElementById("o-button");

  // listens for user choosing 'X', sets global
  // variable to reflect that
  xchoice.addEventListener("click", function() {
    removePrompt();
    userChoice = 2; 
    console.log("User chose: ");
    console.log(userChoice); 
  });

  // listens for user choosing 'O', sets global
  // variable to reflect that
  ochoice.addEventListener("click", function() {
    removePrompt();
    userChoice = 1;
    console.log("User chose: ");
    console.log(userChoice); 
  });
 
});

function removePrompt()
{
  var prompt = document.getElementById('choose1');
  prompt.style.display = 'none';  
}

function displayMove(selection, usrChce)
{
  // may have to check if display is block already
  // by computer player
  var  play = selection.target;
  if (play.children.length == 0)
  {
    return;
  }
  else if (usrChce == 1)
  {
    // may have to check if display is block already
    // by computer player, although may not have to
    /* if (play.children[1].style.display.length != 0)
       {
         continue to alter display css; 
       }
       else
       {
         return;
       }*/
    recordMove(play.children[1].id);
    console.log("id");
    console.log(play.children[1].id)
    console.log("before display css->");
    console.log(play.children[1].style.display.length); 
    play.children[1].style.display = "block";
    console.log("after display css->");
    console.log(play.children[1].style.display); 
    console.log(play.children[1].style.display.length); 
  }
  else if (usrChce == 2)
  {
    play.children[0].style.display = "block";
  }
  else
  {
    return;
  }

  checkWinningCondition();
  playComputerTurn();
}

function recordMove(playLocation)
{
  var loc = playLocation.slice(1);  
  console.log("inside recordMove()");
  console.log(loc);
  
  switch (loc)
  {
    case "1":
      playRecord[0].push(userChoice);    
      playRecord[3].push(userChoice);
      playRecord[7].push(userChoice);
      break;
    case "2":
      playRecord[1].push(userChoice);    
      playRecord[3].push(userChoice);
      break;
    case "3":
      playRecord[3].push(userChoice);    
      playRecord[2].push(userChoice);
      playRecord[6].push(userChoice);
      break;
    case "4":
      playRecord[0].push(userChoice);    
      playRecord[4].push(userChoice);
      break;
    case "5":
      playRecord[1].push(userChoice);    
      playRecord[4].push(userChoice);    
      playRecord[6].push(userChoice);
      playRecord[7].push(userChoice);
      break;
    case "6":
      playRecord[2].push(userChoice);    
      playRecord[4].push(userChoice);
      break;
    case "7":
      playRecord[0].push(userChoice);    
      playRecord[5].push(userChoice);
      playRecord[6].push(userChoice);
      break;
    case "8":
      playRecord[1].push(userChoice);    
      playRecord[5].push(userChoice);
      break;
    case "9":
      playRecord[2].push(userChoice);    
      playRecord[5].push(userChoice);
      playRecord[7].push(userChoice);
      break;
  }
  console.log("playRecord");
  console.log(playRecord);
}

function checkWinningCondition()
{
  //TODO
}

function playComputerTurn()
{
  //TODO
}

function triggerEndGame()
{
  //TODO
  displayNewGameOption();
}

function displayNewGameOption()
{
  //TODO
}
