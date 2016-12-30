document.addEventListener("DOMContentLoaded", function() {
  playRecord = [[], [], [],
                [], [], [],
                [], [], []];
  userChoice = '';
  cpuChoice = '';
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
    userChoice = 'x'; 
    cpuChoice = 'o';
  });

  // listens for user choosing 'O', sets global
  // variable to reflect that
  ochoice.addEventListener("click", function() {
    removePrompt();
    userChoice = 'o';
    cpuChoice = 'x';
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
  var  userSelection = selection.target;
  var locationNum = userSelection.children[0].id.slice(-1);
  if (userSelection.children.length == 0)
  {
    return;
  }
  else
  {
    recordMove(locationNum, "user");
    var locationId = userChoice + locationNum;
    var locationToDisplay = document.getElementById(locationId)
    locationToDisplay.style.display = "block";
  }

  checkWinningCondition(userChoice);
  checkForTie();
  playComputerTurn(locationNum);
}

function recordMove(playLocation, whichPlayer)
{
  playRecord[playLocation - 1][0] = whichPlayer == 'user' ? userChoice : cpuChoice;  

  for (var item in playRecord)
  {
    console.log("playRecord: " + playRecord[item]);
  }
}

// checks to see if a location on the board is occupied
function checkLocationStatus(playLocation)
{
  console.log("inside checkLocationStatus, playLocation->" + playLocation);
  var userLoc = document.getElementById(userChoice + playLocation);
  var cpuLoc = document.getElementById(cpuChoice + playLocation);

  var locationStatus = 0;

  if (userLoc.style.display == "block")
  {
    locationStatus = 1;
  } 
  else if (cpuLoc.style.display == "block")
  {
    locationStatus = 2;
  }

  return locationStatus;
}
function checkWinningCondition(whichPlayer)
{
  // Need to implement loop with counter so 
  // that counter increments every time an 
  // array contains 3 elements AND the sum
  // of those elements is not a winning sum.
  // if counter gets to 8 with NO winning sum,
  // then a tie is declared
  var winningSequences = [[0, 3, 6], [1, 4, 7], [2, 5, 8],
                          [0, 1, 2], [3, 4, 6], [6, 7, 8],
                          [2, 4, 6], [0, 4, 8]];

  for (var sequence in winningSequences)
  {
    console.log("sequence");
    console.log(winningSequences[sequence]); 
    var ctr = 0;
    for (var i = 0; i < 3; i++)
    {
      var tempTest = winningSequences[sequence][i];
      if (playRecord[tempTest][0] == whichPlayer) 
      {
        ctr++;
      }
    }

    if (ctr == 3)
    {
      triggerEndGame(whichPlayer);
    }
  }
  // insert mandatoryPlay for blocking threes!!
}

function checkForTie()
{
  var ctr = 0;
  for (var item in playRecord)
  {
    if (playRecord[item].length == 1)
    {
      ctr++;
    }
  }

  if (ctr == 8)
  {
    triggerEndGame('tie');
  }
}

function playComputerTurn(userLocNum)
{
  var center = document.getElementById(userChar + 5);

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
  }
  else if (center.style.display == "none")
  {
    var playCenter = document.getElementById(cpuChar + 5);
    playCenter.style.display = "block";
    recordMove(5, "cpu");
    threesBlocked.push(7, 8, 2, 5);
    return;
  }
  else if (center.style.display == "block")
  {
    findFirstEmpty();
  }
  else
  {
    reactToCorner();
  }
}

function triggerEndGame(str)
{
  console.log("RESULT IS:   " + str);
  var winningElem = document.getElementById(str); 
  winningElem.style.display = "block";
  resetGame();
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
  console.log("INSIDE reactToCorner()");
  var cpuTwoId = cpuChar + 2;
  var twoAdjacent = document.getElementById(cpuTwoId);
 
  var cpuFourId = cpuChar + 4;
  var fourAdjacent = document.getElementById(cpuFourId);

  var cpuSixId = cpuChar + 6;
  var sixAdjacent = document.getElementById(cpuSixId);

  var cpuEightId = cpuChar + 8;
  var eightAdjacent = document.getElementById(cpuEightId);

  var oneId = userChar + 1;
  var cornerOne = document.getElementById(oneId);
  
  if (cornerOne.style.display == "block")
  {
    console.log("INSIDE corner one");
    if (twoAdjacent.style.display == "none")
    {
      twoAdjacent.style.display = "block";
      recordMove(2, "cpu");
      return;
    }
    else if (fourAdjacent.style.display == "none")
    {
      fourAdjacent.style.display = "block";
      recordMove(4, "cpu");
      return;
    }
  }

  var threeId = userChar + 3;
  var cornerThree = document.getElementById(threeId);

  if (cornerThree.style.display == "block")
  {
    console.log("INSIDE corner three");
    if (twoAdjacent.style.display == "none")
    {
      twoAdjacent.style.display = "block";
      recordMove(2, "cpu");
      return;
    }
    else if (sixAdjacent.style.display == "none")
    {
      sixAdjacent.style.display = "block";
      recordMove(6, "cpu");
      return;
    }
  }

  var sevenId = userChar + 7;
  var cornerSeven = document.getElementById(sevenId);

  if (cornerSeven.style.display == "block")
  {
    console.log("INSIDE corner seven");
    if (fourAdjacent.style.display == "none")
    {
      fourAdjacent.style.display = "block";
      recordMove(4, "cpu");
      return;
    }
    else if (eightAdjacent.style.display == "none")
    {
      eightAdjacent.style.display = "block";
      recordMove(8, "cpu");
      return;
    }
  }

  var nineId = userChar + 9;
  var cornerNine = document.getElementById(nineId);

  if (cornerNine.style.display == "block")
  {
    console.log("INSIDE corner nine");
    if (sixAdjacent.style.display == "none")
    {
      sixAdjacent.style.display = "block";
      recordMove(6, "cpu");
      return;
    }
    else if (eightAdjacent.style.display == "none")
    {
      eightAdjacent.style.display = "block";
      recordMove(8, "cpu");
      return;
    }
  }
}


// remember to add to winning condition
// method to see of all boxes are occupied
// by Xs and Os

// also cpuPlayRecord is not recording cpu plays

/*function recordMove(playLocation, whichPlayer)
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
}*/
