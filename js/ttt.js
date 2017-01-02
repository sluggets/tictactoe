document.addEventListener("DOMContentLoaded", function() {
  playRecord = [[], [], [],
                [], [], [],
                [], [], []];
  userChoice = '';
  cpuChoice = '';

  mandatoryPlay = 0;
  corner = 0;
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

// maybe build fillSquare() function?
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
    if (locationNum == 1 ||
        locationNum == 3 ||
        locationNum == 7 ||
        locationNum == 9)
    {
      corner = locationNum;
    }

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
    console.log("playRecord: " +  + item + playRecord[item]);
  }
}

// checks to see if a location on the board is occupied
// returns 0 if empty, 1 if occupied by user, 2 if 
// occupied by cpu
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
  console.log("whichPlayer" + whichPlayer);
  var winningSequences = [[0, 3, 6], [1, 4, 7], [2, 5, 8],
                          [0, 1, 2], [3, 4, 6], [6, 7, 8],
                          [2, 4, 6], [0, 4, 8]];

  for (var sequence in winningSequences)
  {
    console.log("sequence");
    console.log(winningSequences[sequence]); 
    var ctr = 0;
    // must fix this loop to not throw mandatoryPlay flag
    // if ONLY two opposing plays are in a row...
    // condition MUST be if two opposing plays are in a row
    // AND the third box is EMPTY AF!!!
    for (var i = 0; i < 3; i++)
    {
      var tempTest = winningSequences[sequence][i];
      if (playRecord[tempTest][0] == whichPlayer) 
      {
        ctr++;
      }

      if (ctr == 2 &&
          i == 2)
      {
        console.log("mandatoryPlay triggered!->" + winningSequences[sequence]);
        mandatoryPlay = winningSequences[sequence];
      }
    }

   

    if (ctr == 3)
    {
      triggerEndGame(whichPlayer);
    }
  }
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
  console.log("Inside playComputerTurn()");
  console.log("mandatoryPlay: " + mandatoryPlay);
  if (mandatoryPlay)
  {
    for (var loc in mandatoryPlay)
    {
      var tempLoc = mandatoryPlay[loc];
      console.log("tempLoc: " + mandatoryPlay[loc]);
      if (!checkLocationStatus(tempLoc + 1))
      {
        var trueId = tempLoc + 1;
        var mustPlay = document.getElementById(cpuChoice + trueId);
        mustPlay.style.display = "block";
        mandatoryPlay = 0;
        recordMove(tempLoc + 1, "cpu");
        checkWinningCondition(cpuChoice);
        break;
      }    
    }
  } 
  else if (checkLocationStatus(5) == 0)
  {
    var cpuFiveId = cpuChoice + 5; 
    var fiveCenter = document.getElementById(cpuFiveId);
    fiveCenter.style.display = "block";
    recordMove(5, "cpu");
    checkWinningCondition(cpuChoice);
  }
  else if (corner)
  {
    cornerPlay(corner);
    corner = 0;
  }
  else
  {
    findFirstEmpty();
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
    playRecord[i] = [];
  } 

  restorePrompt();
}

function findFirstEmpty()
{
  for (var i = 1; i < 10; i++)
  {
    if (checkLocationStatus(i) == 0)
    {
      var cpuId = cpuChoice + i;
      var firstPlay = document.getElementById(cpuId);  
      firstPlay.style.display = "block";
      recordMove(i, "cpu");
      checkWinningCondition(cpuChoice);
      break;
    } 
  }
}

function cornerPlay(locNum)
{
  console.log("INSIDE cornerPlay()");
  

  // this if/else business
  // simply REACTS to corner plays, it doesn't
  // MAKE corner plays if corners are empty?!!
  if (checkLocationStatus(1) == 1 &&
           (checkLocationStatus(2) == 0 ||
            checkLocationStatus(4) == 0))
  {
    if (checkLocationStatus(2) == 0)
    {
      var cpuTwoId = cpuChoice + 2;
      var twoPlay = document.getElementById(cpuTwoId); 
      twoPlay.style.display = "block";
      recordMove(2, "cpu");
      checkWinningCondition(cpuChoice);
    }
    else
    {
      var cpuFourId = cpuChoice + 4;
      var fourPlay = document.getElementById(cpuFourId);
      fourPlay.style.display = "block";
      recordMove(4, "cpu");
      checkWinningCondition(cpuChoice);
    }
  }
  else if (checkLocationStatus(3) == 1 &&
           (checkLocationStatus(2) == 0 ||
            checkLocationStatus(6) == 0))
  {
    if (checkLocationStatus(2) == 0)
    {
      var cpuTwoId = cpuChoice + 2;
      var twoPlay = document.getElementById(cpuTwoId);
      twoPlay.style.display = "block";
      recordMove(2, "cpu");
      checkWinningCondition(cpuChoice);
    }
    else
    {
      var cpuSixId = cpuChoice + 6;
      var sixPlay = document.getElementById(cpuSixId);
      sixPlay.style.display = "block";
      recordMove(6, "cpu");
      checkWinningCondition(cpuChoice);
    }
  }
  else if (checkLocationStatus(7) == 1 &&
           (checkLocationStatus(4) == 0 ||
            checkLocationStatus(8) == 0))
  {
    if (checkLocationStatus(4) == 0)
    {
      var cpuFourId = cpuChoice + 4;
      var fourPlay = document.getElementById(cpuFourId);
      fourPlay.style.display = "block";
      recordMove(4, "cpu");
      checkWinningCondition(cpuChoice);
    } 
    else
    {
      var cpuEightId = cpuChoice + 8;
      var eightPlay = document.getElementById(cpuEightId);
      eightPlay.style.display = "block";
      recordMove(8, "cpu");
      checkWinningCondition(cpuChoice);
    }
  }
  else if (checkLocationStatus(9) == 1 &&
           (checkLocationStatus(6) == 0 ||
            checkLocationStatus(8) == 0))
  {
    if (checkLocationStatus(6) == 0)
    {
      var cpuSixId = cpuChoice + 6;
      var sixPlay = document.getElementById(cpuSixId);
      sixPlay.style.display = "block";
      recordMove(6, "cpu");
      checkWinningCondition(cpuChoice);
    }
    else
    {
      var cpuEightId = cpuChoice + 8;
      var eightPlay = document.getElementById(cpuEightId);
      eightPlay.style.display = "block";
      recordMove(8, "cpu");
      checkWinningCondition(cpuChoice);
    }
  }
  
}
/*function blockTheThree(idArr)
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
}*/



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
