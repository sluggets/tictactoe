document.addEventListener("DOMContentLoaded", function() {
  humanPlayRecord =    [[], [], [], [],
                   [], [], [], []];
  cpuPlayRecord = [[], [], [], [],
                   [], [], [], []];

  threesBlocked = [];
  console.log(humanPlayRecord);
  userChoice = 3;
  cpuChoice = 4;
  mandatoryPlay = 0;
  var elem = document.querySelector('.grid');
  
  var msnry = new Masonry(elem, {
    itemSelector: '.grid-item',
    columnWidth: 80,
    gutter: 1.5
  });

  var xchoice = document.getElementById("x-button");
  var ochoice = document.getElementById("o-button");

  // listens for user choosing 'X', sets global
  // variable to reflect that, also sets cpuChoice
  xchoice.addEventListener("click", function() {
    removePrompt();
    userChoice = 2; 
    cpuChoice = 1;
    userChar = 'x';
    cpuChar = 'o';
    console.log("User chose: ");
    console.log(userChoice); 
  });

  // listens for user choosing 'O', sets global
  // variable to reflect that, also sets cpuChoice
  ochoice.addEventListener("click", function() {
    removePrompt();
    userChoice = 1;
    cpuChoice = 2;
    userChar = 'o';
    cpuChar = 'x';
    console.log("User chose: ");
    console.log(userChoice); 
  });
 
});

function removePrompt()
{
  var prompt = document.getElementById('choose1');
  prompt.style.display = 'none';  

  var winningElems = document.getElementsByClassName("winner");
  
  for (var i = 0; i < 3; i++)
  {
    winningElems[i].style.display = "none";
  }

  var boxes = document.getElementsByClassName("boxes");
  var size = boxes.length;
 
  for (var i = 0; i < size; i++)
  {
    boxes[i].style.display = "none";
  } 
}

function restorePrompt()
{
  var prompt = document.getElementById('choose1');
  prompt.style.display = 'block';
}

function displayMove(selection, usrChce)
{
  // may have to check if display is block already
  // by computer player
  var  play = selection.target;
  var loc;
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
    loc = play.children[1].id;
    recordMove(loc, "human");
    console.log("loc->id");
    console.log(loc)
    console.log("before display css->");
    console.log(play.children[1].style.display.length); 
    play.children[1].style.display = "block";
    console.log("after display css->");
    console.log(play.children[1].style.display); 
    console.log(play.children[1].style.display.length); 
  }
  else if (usrChce == 2)
  {
    loc = play.children[0].id;
    recordMove(loc, "human");
    play.children[0].style.display = "block";
  }
  else
  {
    return;
  }

  checkWinningCondition("human");
  playComputerTurn(loc);
}

function recordMove(playLocation, whichPlayer)
{
  var loc = '';
  var playType = '';
  var playRecord;
  if (playLocation.length == 2)
  {
    loc = playLocation.slice(1);  
  }
  else
  {
    loc = playLocation.toString();
  }


  if (whichPlayer == "human")
  {
    playType = userChoice;
    playRecord = humanPlayRecord;
  }
  else
  {
    console.log("recording move for cpu!");
    playType = cpuChoice;
    playRecord = cpuPlayRecord;
    console.log("INSIDE recordMove()->loc: " + loc);
    console.log("PLAYTYPE: " + playType);
    console.log("userChoice: " + userChoice);
  }
  console.log("inside recordMove()");
  console.log(loc);
  
  switch (loc)
  {
    case "1":
      playRecord[0].push(playType);    
      playRecord[3].push(playType);
      playRecord[7].push(playType);
      break;
    case "2":
      playRecord[1].push(playType);    
      playRecord[3].push(playType);
      break;
    case "3":
      playRecord[3].push(playType);    
      playRecord[2].push(playType);
      playRecord[6].push(playType);
      break;
    case "4":
      playRecord[0].push(playType);    
      playRecord[4].push(playType);
      break;
    case "5":
      playRecord[1].push(playType);    
      playRecord[4].push(playType);    
      playRecord[6].push(playType);
      playRecord[7].push(playType);
      break;
    case "6":
      playRecord[2].push(playType);    
      playRecord[4].push(playType);
      break;
    case "7":
      playRecord[0].push(playType);    
      playRecord[5].push(playType);
      playRecord[6].push(playType);
      break;
    case "8":
      playRecord[1].push(playType);    
      playRecord[5].push(playType);
      break;
    case "9":
      playRecord[2].push(playType);    
      playRecord[5].push(playType);
      playRecord[7].push(playType);
      break;
  }
  console.log("playRecord");
  for (var item in playRecord)
  {
    console.log(playRecord[item]);
    console.log("length");
    console.log(playRecord[item].length);
  }
}

function checkWinningCondition(whichPlayer)
{
  // Need to implement loop with counter so 
  // that counter increments every time an 
  // array contains 3 elements AND the sum
  // of those elements is not a winning sum.
  // if counter gets to 8 with NO winning sum,
  // then a tie is declared
  var playRecord;
  if (whichPlayer == "human")
  {
    playRecord = humanPlayRecord;
  }
  else
  {
    playRecord = cpuPlayRecord;
  }

  var ctr = 0;
  for (var item in playRecord)
  {
    var winningSum = 0;
    if (playRecord[item].length == 2)
    {
      winningSum = playRecord[item][0] + playRecord[item][1];
      if ((userChoice == 2 &&
           winningSum == 4) ||
          (userChoice == 1 &&
           winningSum == 2))
      {
        var indexNum = playRecord.indexOf(playRecord[item]) + 1;
        if (threesBlocked.indexOf(indexNum) == -1)
        {
          mandatoryPlay = indexNum;
          console.log("TRIGGERED!!" + indexNum);
        }
        //threesBlocked.push(4);
        //console.log("threesBlocked: " + threesBlocked);
      }
    }

    if (playRecord[item].length == 3)
    {
      ctr++;
      winningSum = playRecord[item][0] + playRecord[item][1] + playRecord[item][2];
      console.log("sum of three is...");
      console.log(winningSum);
      if (winningSum == 3 ||
          winningSum == 6)
      {
        // for the win!
        var winner = winningSum == 3 ? 'o-wins' : 'x-wins';
        triggerEndGame(winner);
      }
    }
  }

  if (ctr == 8)
  {
    // for the tie
    triggerEndGame('tie');
  }
}

function playComputerTurn(humanLocId)
{

  if (mandatoryPlay > 0)
  {
    console.log("proceeding to block: " + mandatoryPlay);
    switch (mandatoryPlay)
    {
      case 1:
        blockTheThree([1,4,7]); 
        break;
      case 2:
        blockTheThree([2,5,8]); 
        break;
      case 3:
        blockTheThree([3,6,9]); 
        break;
      case 4:
        blockTheThree([1,2,3]); 
        break;
      case 5:
        blockTheThree([4,5,6]); 
        break;
      case 6:
        blockTheThree([7,8,9]); 
        break;
      case 7:
        blockTheThree([3,5,7]); 
        break;
      case 8:
        blockTheThree([1,5,9]); 
        break;
    } 
    threesBlocked.push(mandatoryPlay);
    mandatoryPlay = 0;    
    console.log("threesBlocked: " + threesBlocked);
    return;
  }

  // humLoc is just the number, humanLocId is full id
  var humLoc =  humanLocId.slice(-1);
  console.log("inside playCompTurn()-> humLoc");
  console.log(humanLocId);
  
  var center = document.getElementById(userChar + 5);
  if (center.style.display == "none")
  {
    var playCenter = document.getElementById(cpuChar + 5);
    playCenter.style.display = "block";
    recordMove(5, "cpu");
    threesBlocked.push(7, 8, 2, 5);
  }
  else
  {
    //reactToCorner();
    findFirstEmpty();
  }
  /*switch (humLoc)
  {
    cas
  }*/ 
}

function triggerEndGame(str)
{
  console.log("RESULT IS:   " + str);
  var winningElem = document.getElementById(str); 
  winningElem.style.display = "block";
  resetGame();
  //TODO
  //displayNewGameOption();
}

function resetGame()
{
  /*var boxes = document.getElementsByClassName("boxes");
  var size = boxes.length;
 
  for (var i = 0; i < size; i++)
  {
    boxes[i].style.display = "none";
  }*/ 
  
  for (var i = 0; i < 8; i++)
  {
    humanPlayRecord[i] = [];
    cpuPlayRecord[i] = [];
  } 

  restorePrompt();
}

function blockTheThree(idArr)
{
  for (var id in idArr)
  {
    console.log("ID-> " + idArr[id]);
    var divBox = document.getElementById(userChar + idArr[id]);
    console.log("divBox style-> " + divBox.style.display);
    if (divBox.style.display == "none")
    {
      console.log("cpuChar is: " + cpuChar + idArr[id]);
      var playLoc = document.getElementById(cpuChar + idArr[id]);
      console.log("display for CPU is: " + playLoc.style.display);
      console.log("CPU" + cpuChar + idArr[id]);
      if (playLoc.style.dislay !== "block")
      {
        playLoc.style.display = "block";
        recordMove(idArr[id]);
        return;
      }
    }
  }  
}

function findFirstEmpty()
{
  for (var i = 1; i < 9; i++)
  {
    var boxId = userChar + i; 
    console.log("boxId: " + boxId);
    var boxLoc = document.getElementById(boxId);

    var cpuId = cpuChar + i;
    var cpuLoc = document.getElementById(cpuId);
    if (boxLoc.style.display == "none" &&
        cpuLoc.style.display == "none")
    {
      cpuLoc.style.display = "block";
      recordMove(i, "cpu");
      return;
    }
    
  }
}

function reactToCorner()
{
  var oneId = userChar + 1;
  var cornerOne = document.getElementById(oneId);

  var threeId = userChar + 3;
  var cornerThree = document.getElementById(threeId);

  var sevenId = userChar + 7;
  var cornerThree = document.getElementById(sevenId);

  var nineId = userChar + 9;
  var cornerNine = document.getElementById(nineId);
}


// remember to add to winning condition
// method to see of all boxes are occupied
// by Xs and Os

// also cpuPlayRecord is not recording cpu plays
