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

  //var gridClick = document.getElementsByClassName("grid-item");
  /*console.log(gridClick);
  gridClick.addEventListener("click", function() {
    console.log("grid-item was clikked");
    console.log(gridClick);
  });*/

  xchoice.addEventListener("click", function() {
    removePrompt();
    userChoice = 2; 
    console.log("User chose: ");
    console.log(userChoice); 
  });

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
    play.children[1].style.display = "block";
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
