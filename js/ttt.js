document.addEventListener("DOMContentLoaded", function() {
  // all numbering of tic tac toe grid is done ascending beginning
  // in upper left corner and continuing clockwise.
  // arrays are zero indexed of course, but the ids in the 
  // html are NOT, so id grid starts at one! 

  // this is a record of plays made during the game
  playRecord = [[], [], [],
                [], [], [],
                [], [], []];

  // global array holds all the winning sequences that can be
  // made/guarded against
  // note that there is a local version of this in 
  // checkWinningCondition() used for its own purposes
  // THIS is for purposes in checkForMandatoryPlay()
  // and checkSequence() 
  winningSequences = [[0, 3, 6], [1, 4, 7], [2, 5, 8],
                          [0, 1, 2], [3, 4, 5], [6, 7, 8],
                          [2, 4, 6], [0, 4, 8]];

  // global variables to store who is X, who is Y
  userChoice = '';
  cpuChoice = '';

  // global flag to indicate if cpu MUST make a play
  // in order to win or avoid loss
  mandatoryPlay = 0;

  // global flag to trigger a corner play
  insideReaction = 0;

  // selects grid class for masonry grid layout library
  var elem = document.querySelector('.grid');
  
  // sets up masonry grid
  var msnry = new Masonry(elem, {
    itemSelector: '.grid-item',
    columnWidth: 80,
    gutter: 1.5
  });

  // grabs button ids for selecting player letter
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

// removes player selection prompt
// and clears previous game 
function removePrompt()
{
  var prompt = document.getElementById('choose1');
  prompt.style.display = 'none';  

  // gets rid of winning/losing/tie message
  var winningElems = document.getElementsByClassName("winner");
  
  for (var i = 0; i < 3; i++)
  {
    winningElems[i].style.display = "none";
  }

  // sets display of all tic tac toe boxes to blank again
  var boxes = document.getElementsByClassName("boxes");
  var size = boxes.length;
 
  for (var i = 0; i < size; i++)
  {
    boxes[i].style.display = "none";
  } 

  for (var i = 0; i < 9; i++)
  {
    playRecord[i] = [];
  } 

}

// gets the prompt back to start new game
function restorePrompt()
{
  var prompt = document.getElementById('choose1');
  prompt.style.display = 'block';
}

// displays and records the user's move
function displayMove(selection, usrChce)
{
  // puts selection user clicked on into variable
  var  userSelection = selection.currentTarget;
  var locationNum = userSelection.children[0].id.slice(-1);
  var divId = userSelection.children[0].id.slice(0,1);
  // mutin the log below
  //console.log("divId: " + divId);
  if (checkLocationStatus(locationNum) != 0)
  {
    return;
  }
  /*else
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
    // muting the below logs
    //console.log("user played this->" + locationNum);
    //console.log("location status SHOULD be 1!->" + checkLocationStatus(locationNum));
  }*/

  recordMove(locationNum, "user");
  var locationId = userChoice + locationNum;
  var locationToDisplay = document.getElementById(locationId)
  locationToDisplay.style.display = "block";
  checkWinningCondition();
  checkForTie();
  playComputerTurn(locationNum);
}

function recordMove(playLocation, whichPlayer)
{
  playRecord[playLocation - 1][0] = whichPlayer == 'user' ? userChoice : cpuChoice;  

  // muting the below log
  /*for (var item in playRecord)
  {
    console.log("playRecord: "  + item + playRecord[item]);
  }*/
}

// checks to see if a location on the board is occupied
// returns 0 if empty, 1 if occupied by user, 2 if 
// occupied by cpu
function checkLocationStatus(playLocation)
{
  // muting the below test
  //console.log("inside checkLocationStatus, playLocation->" + playLocation);
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

function checkWinningCondition()
{
  var winning = [[0, 3, 6], [1, 4, 7], [2, 5, 8],
                 [0, 1, 2], [3, 4, 5], [6, 7, 8],
                 [2, 4, 6], [0, 4, 8]];

  for (var sequence in winning)
  {
    var cpuCtr = 0;
    var userCtr = 0;
    // must fix this loop to not throw mandatoryPlay flag
    // if ONLY two opposing plays are in a row...
    // condition MUST be if two opposing plays are in a row
    // AND the third box is EMPTY AF!!!
    for (var i = 0; i < 3; i++)
    {
      var tempTest = winning[sequence][i];
      if (playRecord[tempTest][0] == userChoice) 
      {
        userCtr++;
      }
      else if (playRecord[tempTest][0] == cpuChoice)
      {
        cpuCtr++;
      }
    }

    if (userCtr == 3)
    {
      triggerEndGame(userChoice);
    }
    else if (cpuCtr == 3)
    {
      triggerEndGame(cpuChoice);
    }
  }
}

function checkForTie()
{
  var ctr = 0;
  for (var i = 1; i < 10; i++)
  {
    if (checkLocationStatus(i) != 0)
    {
      ctr++;
    }
  }

  if (ctr == 9)
  {
    triggerEndGame('tie');
  }
  else
  {
    return;
  }
}

function playComputerTurn(userLocNum)
{
  console.log("Inside playComputerTurn()");
  checkForMandatoryPlay(); 
  console.log("mandatoryPlay: " + mandatoryPlay);
  if (mandatoryPlay)
  {
    for (var loc in mandatoryPlay)
    {
      var tempLoc = mandatoryPlay[loc];
      var cssId = tempLoc + 1;
      // muting this->console.log("tempLoc: " + mandatoryPlay[loc]);
      if (!checkLocationStatus(cssId))
      {
        var mustPlay = document.getElementById(cpuChoice + cssId);
        mustPlay.style.display = "block";
        mandatoryPlay = 0;
        recordMove(cssId, "cpu");
        checkWinningCondition();
        break;
      }
    }
    return;
  } 
 
  var ctr = 0;
  var openingCornerPlay = false;
  for (var item in playRecord)
  {
    if (playRecord[item].length != 0)
    {
      ctr++;
    }
  }

  if (ctr == 1 &&
      (checkLocationStatus(1) == 1 ||
       checkLocationStatus(3) == 1 ||
       checkLocationStatus(7) == 1 ||
       checkLocationStatus(9) == 1))
  {
    openingCorner();  
    return;
  }

    
  if (checkLocationStatus(5) == 0)
  {
    var cpuFiveId = cpuChoice + 5; 
    var fiveCenter = document.getElementById(cpuFiveId);
    fiveCenter.style.display = "block";
    recordMove(5, "cpu");
    checkWinningCondition();
    return;
  }
  var cornerPlayMade = cornerPlay();
 
  if (!cornerPlayMade)
  { 
    findFirstEmpty();
  }
}

function triggerEndGame(str)
{
  // muting this log->console.log("RESULT IS:   " + str);
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
  
  for (var i = 0; i < 9; i++)
  {
    playRecord[i] = [];
  }

  winningSequences = [[0, 3, 6], [1, 4, 7], [2, 5, 8],
                          [0, 1, 2], [3, 4, 5], [6, 7, 8],
                          [2, 4, 6], [0, 4, 8]];
  
  restorePrompt();
}

function findFirstEmpty()
{
  console.log("Inside findFirstEmpty()");
  for (var i = 1; i < 10; i++)
  {
    if (checkLocationStatus(i) == 0)
    {
      var cpuId = cpuChoice + i;
      var firstPlay = document.getElementById(cpuId);  
      firstPlay.style.display = "block";
      recordMove(i, "cpu");
      checkWinningCondition();
      break;
    } 
  }
}

function cornerPlay()
{
  var cornerPlayMade = false;
  console.log("INSIDE cornerPlay()");
  console.log("corner: " + corner);
  var cornerArray = [1, 3, 7, 9]; 
  var sideArray = [2, 4, 6, 8];

  var oneStatus = checkLocationStatus(1);
  var threeStatus = checkLocationStatus(3);
  var sevenStatus = checkLocationStatus(7);
  var nineStatus = checkLocationStatus(9);


  var toPlay = 0;
  for (var i = 0; i < 4; i++)
  {
    if (checkLocationStatus(cornerArray[i]) == 0)
    {
        toPlay = cornerArray[i];
    }
  }

  if (checkLocationStatus(2) == 1)
  {
    if (oneStatus == 0)
    {
      toPlay = 1;
    }
    else if (threeStatus == 0)
    {
      toPlay = 3;
    }
  }
  else if (checkLocationStatus(6) == 1)
  {
    if (threeStatus == 0)
    {
      toPlay = 3;
    }
    else if (nineStatus == 0)
    {
      toPlay = 9;
    }
  }
  else if (checkLocationStatus(8) == 1)
  {
    if (nineStatus == 0)
    {
      toPlay = 9;
    }
    else if (sevenStatus == 0)
    {
      toPlay = 7;
    }
  }
  else if (checkLocationStatus(4) == 1)
  {
    if (sevenStatus == 0)
    {
      toPlay = 7;
    }
    else if (oneStatus == 0)
    {
      toPlay = 1;
    }
  }
  // this if/else business
  // simply REACTS to corner plays, it doesn't
  // MAKE corner plays if corners are empty?!!
  if (toPlay)
  {
    var crnrId = cpuChoice + toPlay;
    var crnrPlay = document.getElementById(crnrId); 
    crnrPlay.style.display = "block";
    recordMove(toPlay, "cpu");
    checkWinningCondition();
    cornerPlayMade = true;
  } 
  else if (checkLocationStatus(1) == 1 &&
           (checkLocationStatus(2) == 0 ||
            checkLocationStatus(4) == 0))
  {
    console.log("inside reaction corner plays");
    insideReaction = 1;
    if (checkLocationStatus(2) == 0)
    {
      var cpuTwoId = cpuChoice + 2;
      var twoPlay = document.getElementById(cpuTwoId); 
      twoPlay.style.display = "block";
      recordMove(2, "cpu");
      checkWinningCondition();
      cornerPlayMade = true;
    }
    else
    {
      var cpuFourId = cpuChoice + 4;
      var fourPlay = document.getElementById(cpuFourId);
      fourPlay.style.display = "block";
      recordMove(4, "cpu");
      checkWinningCondition();
      cornerPlayMade = true;
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
      checkWinningCondition();
      cornerPlayMade = true;
    }
    else
    {
      var cpuSixId = cpuChoice + 6;
      var sixPlay = document.getElementById(cpuSixId);
      sixPlay.style.display = "block";
      recordMove(6, "cpu");
      checkWinningCondition();
      cornerPlayMade = true;
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
      checkWinningCondition();
      cornerPlayMade = true;
    } 
    else
    {
      var cpuEightId = cpuChoice + 8;
      var eightPlay = document.getElementById(cpuEightId);
      eightPlay.style.display = "block";
      recordMove(8, "cpu");
      checkWinningCondition();
      cornerPlayMade = true;
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
      checkWinningCondition();
      cornerPlayMade = true;
    }
    else
    {
      var cpuEightId = cpuChoice + 8;
      var eightPlay = document.getElementById(cpuEightId);
      eightPlay.style.display = "block";
      recordMove(8, "cpu");
      checkWinningCondition();
      cornerPlayMade = true;
    }
  }

  return cornerPlayMade;
}

// okay, obviously what we need to do here
// is check for XX mandatory play FIRST
// play the third X man!!
// If no two XX, then play OO man!!!
function checkForMandatoryPlay()
{
  for (var sequence in winningSequences)
  {
    /*console.log("sequence");
    console.log(winningSequences[sequence]);*/
    var cpuCtr = 0;
    //var userCtr = 0;
    // must fix this loop to not throw mandatoryPlay flag
    // if ONLY two opposing plays are in a row...
    // condition MUST be if two opposing plays are in a row
    // AND the third box is EMPTY AF!!!
    for (var i = 0; i < 3; i++)
    {
      // muting the below logs
      /*console.log("inside check for cpu threes");
      console.log("sequence");
      console.log(winningSequences[sequence]); 
      console.log(winningSequences[sequence][i]);*/ 
      var cpuTest = winningSequences[sequence][i];
      if (playRecord[cpuTest][0] == cpuChoice)
      {
        cpuCtr++;
        // muting this->console.log("incrementing counter to->" + cpuCtr);
        /*if (cpuCtr == 2 && i == 2)
        {
          console.log("checking :" + winningSequences[sequence]);
          checkSequence(winningSequences[sequence]);
          winningSequences.splice(sequence, 1); 
          return;
        }*/
      }
      if (cpuCtr == 2 && i == 2)
      {
        // muting->console.log("checking :" + winningSequences[sequence]);
        checkSequence(winningSequences[sequence], sequence);
        // muting below logs
        /*console.log("MANDATORY in IF: " + mandatoryPlay);
        console.log("SEQUENCE: " + sequence);*/
        //winningSequences.splice(sequence, 1); 
        if (mandatoryPlay)
        {
          return;
        }
      }
    }
    /*for (var i = 0; i < 3; i++)
    {
      console.log("inside check for user threes");
      console.log("sequence");
      console.log(winningSequences[sequence]); 
      var userTest = winningSequences[sequence][i];
      if (playRecord[userTest][0] == userChoice) 
      {
        userCtr++;
        if (userCtr == 2 && i == 2)
        {
          checkSequence(winningSequences[sequence]);
          winningSequences.splice(sequence, 1); 
          return;
        }
      }

    }*/
  }
  for (var sequence in winningSequences)
  {
    var userCtr = 0;
    for (var i = 0; i < 3; i++)
    {
      // muting below logs
      /*console.log("inside check for user threes");
      console.log("sequence");
      console.log(winningSequences[sequence]); 
      console.log(winningSequences[sequence][i]);*/ 
      var userTest = winningSequences[sequence][i];
      if (playRecord[userTest][0] == userChoice) 
      {
        userCtr++;
        // muting->console.log("incrementing counter to->" + userCtr);
        /*console.log("i equals->" + i);
        if (userCtr == 2 && i == 2)
        {
          console.log("about to go into checkSequence()!");
          checkSequence(winningSequences[sequence]);
          winningSequences.splice(sequence, 1); 
          return;
        }*/
      }
      if (userCtr == 2 && i == 2)
      {
        // muting->console.log("about to go into checkSequence()!");
        checkSequence(winningSequences[sequence], sequence);
        // muting below logs
        /*console.log("MANDATORY in IF: " + mandatoryPlay);
        console.log("SEQUENCE: " + sequence);*/
        //winningSequences.splice(sequence, 1); 
        //return;
      }
    }
  }
}

function checkSequence(seq, index)
{
  var toCheckOne = seq[0] + 1;
  var toCheckTwo = seq[1] + 1;
  var toCheckThree = seq[2] + 1;
  // muting below logs
  /*console.log("check location first: " + checkLocationStatus(toCheckOne));
  console.log("check location second: " + checkLocationStatus(toCheckTwo)); 
  console.log("check location third: " + checkLocationStatus(toCheckThree));*/
        
  // muting->console.log("seq: " + seq);
 
  if (checkLocationStatus(toCheckOne) == 0 ||
      checkLocationStatus(toCheckTwo) == 0 ||
      checkLocationStatus(toCheckThree) == 0)
  {
    console.log("mandatoryPlay triggered!->" + seq);
    //console.log("sequence is: " + sequence);
    mandatoryPlay = seq;
    console.log("deleting: " + seq);
    winningSequences.splice(index, 1); 
  }

  if (checkLocationStatus(toCheckOne) != 0 &&
      checkLocationStatus(toCheckTwo) != 0 &&
      checkLocationStatus(toCheckThree) != 0)
  {
    console.log("deleting: " + seq + " inside second if");
    winningSequences.splice(index, 1); 
  } 

}

// if the user opens with a corner,
// cpu will play opposite corner
function openingCorner()
{
  cornerRange = {'1': 9, '3': 7, '9': 1, '7': 3};

  for (var key in cornerRange)
  {
    if (checkLocationStatus(key) == 1)
    {
      var cpuId = cpuChoice + cornerRange[key];
      var oppositeCorner = document.getElementById(cpuId);
      oppositeCorner.style.display = "block";
      recordMove(cornerRange[key], "cpu");
      checkWinningCondition();
    }
  }

}
