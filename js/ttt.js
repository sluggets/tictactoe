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

  // global to store location of the FIRST corner 
  // made by the cpu, in case of user playing the
  // center square FIRST
  firstCorner = 0;

  // global to store location if user's second play
  // is a corner 
  secondCorner = 0;

  // global to indicate end of game
  endOfGame = 0;

  // global counter to store count of all plays
  globalCounter = 0;

  // globals that store the user's first and second 
  // and third plays
  firstUser = 0;
  secondUser = 0;
  thirdUser = 0;

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

  // clears a bunch of globals used for
  // cpu play 
  endOfGame = 0;
  globalCounter = 0;
  firstUser = 0;
  secondUser = 0;
  thirdUser = 0;
  firstCorner = 0;
  secondCorner = 0;
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

  // if the user clicks on already played square
  if (checkLocationStatus(locationNum) != 0)
  {
    return;
  }

  // makes the user's play, and records the move to playRecord
  recordMove(locationNum, "user");
  var locationId = userChoice + locationNum;
  var locationToDisplay = document.getElementById(locationId)
  locationToDisplay.style.display = "block";

  // increments a global counter to better track total
  // number of plays for  strategic functions
  globalCounter++;

  // if user plays a corner as a
  // second move(3rd total play including
  // cpu) then this move is stored
  if (globalCounter == 3)
  {
    if (locationNum == 1 ||
        locationNum == 3 ||
        locationNum == 7 ||
        locationNum == 9)
    {
      secondCorner = locationNum;
    }
  }

  // stores what plays the user made for
  // their first, second, and third plays
  // to detect correct strategy
  if (globalCounter == 1)
  {
    firstUser = locationNum;  
  }
  
  if (globalCounter == 3)
  {
    secondUser = locationNum;
  }

  if (globalCounter == 5)
  {
    thirdUser = locationNum;
  }

  checkWinningCondition();
  checkForTie();
  playComputerTurn(locationNum);
}

// records move that was played to global playRecord
function recordMove(playLocation, whichPlayer)
{
  // conditional statement to assign proper play to playRecord
  playRecord[playLocation - 1][0] = whichPlayer == 'user' ? userChoice : cpuChoice;  

}

// checks to see if a location on the board is occupied
// returns 0 if empty, 1 if occupied by user, 2 if 
// occupied by cpu
function checkLocationStatus(playLocation)
{
  // collects status on specific location for both user and cpu
  var userLoc = document.getElementById(userChoice + playLocation);
  var cpuLoc = document.getElementById(cpuChoice + playLocation);

  var locationStatus = 0;

  // checks if the css display rule is block or none
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

// checks to see if someone has won!
function checkWinningCondition()
{
  // checks against a local version of the global
  // variable winningSequences, since the global
  // version gets altered as winning sequences
  // get eliminated through play
  var winning = [[0, 3, 6], [1, 4, 7], [2, 5, 8],
                 [0, 1, 2], [3, 4, 5], [6, 7, 8],
                 [2, 4, 6], [0, 4, 8]];

  // loop counts up if either player has all three of
  // any specific winning sequence in the arrays
  for (var sequence in winning)
  {
    var cpuCtr = 0;
    var userCtr = 0;

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

    // if one or the other player has those three 
    // then triggerEndGame is called
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

// checks to see if a tie is the result
// note that this is only called after the
// user plays, because they would play last
// in a tie situation
function checkForTie()
{
  var ctr = 0;

  // count up squares whose status is not undecided
  for (var i = 1; i < 10; i++)
  {
    if (checkLocationStatus(i) != 0)
    {
      ctr++;
    }
  }

  // if all squares have been played and the checkWinningCondition()
  // has not been called, it MUST be a tie
  if (ctr == 9)
  {
    endOfGame = 1;
    triggerEndGame('tie');
  }
  else
  {
    return;
  }
}

// handles the algorithm the cpu will use
// to respond to specific correct plays,
// or specific incorrect plays by the user
function playComputerTurn(userLocNum)
{
  // went ahead and added an endOfGame flag
  // in case play gets handed to the computer
  // when the game is in fact done
  if (endOfGame)
  {
    return;
  }

  // increments global counter to track total
  // number plays made of cpu AND user
  globalCounter++;

  // checks to see if any two-in-rows are there
  // that the cpu needs to block
  checkForMandatoryPlay(); 

  // if there are, then block them
  if (mandatoryPlay)
  {
    for (var loc in mandatoryPlay)
    {
      var tempLoc = mandatoryPlay[loc];
      var cssId = tempLoc + 1;
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

  // checks for a specific course of play
  // after six plays and uses custom function for it
  if (globalCounter == 6 && 
      firstUser == 8 &&
      secondUser == 3 &&
      thirdUser == 4)
  {
    var treeRes = treePlay();
  } 

  // if treePlay was made, hand off play to user
  if (treeRes)
  {
    return;
  }

  // if six plays have been made, checks
  // to see if forkPlay response needs to
  // be made
  if (globalCounter == 6)
  {
    var forkResult = forkPlay();
  }

  // if the forkPlay was made, hand
  // off play to the user
  if (forkResult)
  {
    return;
  }
 
  // checks for specific course of play
  // on the fourth turn
  if (globalCounter == 4 &&
      firstUser == 1 &&
      secondUser == 9)
  {
    var diagonalResult = diagonalPlay();
  }

  // if the diagonalPlay was made, hand off
  // play to the user
  if (diagonalResult)
  {
    return;
  }

  // checks for specific course of play
  // if this is the fourth turn
  if (globalCounter == 4 &&
      firstUser == 8 &&
      secondUser == 3)
  {
    var horseResult = horsePlay();
  }

  // if the horsePlay was made, hands off
  // play to the user
  if (horseResult)
  {
    return;
  }

  // if there have been four plays made,
  // better check to see if snakePlay 
  // strategy needs to be played
  if (globalCounter == 4)
  {
    var snakeResult = snakePlay();
  }

  // if the snakePlay was made, return 
  // play to the user
  if (snakeResult)
  {
    return;
  }

  // if it IS the THIRD play, AND user has
  // played a second corner, then calcAdjacent
  // is called which will handle that play
  // depending upon whether or not user has
  // the center square
  if (globalCounter == 4 && secondCorner != 0)
  {
    var calcResult = calcAdjacent();
  }
    
  // if the calcAdjacent play was made,
  // returns play to the user
  if (calcResult)
  {
    return;
  }

  // if middle square hasn't been played, this will
  // play it
  if (checkLocationStatus(5) == 0)
  {
    var cpuFiveId = cpuChoice + 5; 
    var fiveCenter = document.getElementById(cpuFiveId);
    fiveCenter.style.display = "block";
    recordMove(5, "cpu");
    checkWinningCondition();
    return;
  }
  
  // variable stores boolean of whether cornerPlay 
  // was made or not
  var cornerPlayMade = cornerPlay();
}

// triggers winner header to appear and calls 
// resetGame()
function triggerEndGame(str)
{
  console.log("str: " + str);
  var winningElem = document.getElementById(str); 
  winningElem.style.display = "flex";
  resetGame();
}

// resets game by clearing the playRecord global and
// restoring the global winningSequendes array
function resetGame()
{
  for (var i = 0; i < 9; i++)
  {
    playRecord[i] = [];
  }

  winningSequences = [[0, 3, 6], [1, 4, 7], [2, 5, 8],
                          [0, 1, 2], [3, 4, 5], [6, 7, 8],
                          [2, 4, 6], [0, 4, 8]];
  
  // puts player selection prompt back up to start new game
  restorePrompt();
}

// does two things, in this order, of which I'm unsure the value of
// just yet. 1) It will play an available corner that is
// adjacent to a sideplay made by the user...
// and 2) It will REACT to a corner play made by the
// user with playing a side play
// returns boolean whether or not play was made
// inside this function
function cornerPlay()
{
  
  // variable that gets returned to 
  // trigger the next computer play of
  // first empty square or not triggered
  var cornerPlayMade = false;

  // arrays to loop through of corner slots
  // and side slots
  var cornerArray = [1, 3, 7, 9]; 
  var sideArray = [2, 4, 6, 8];

  // stores status of corner squares in some variables
  // for easier comparison later
  var oneStatus = checkLocationStatus(1);
  var threeStatus = checkLocationStatus(3);
  var sevenStatus = checkLocationStatus(7);
  var nineStatus = checkLocationStatus(9);
  var sixStatus = checkLocationStatus(6);
  var eightStatus = checkLocationStatus(8);
  var twoStatus = checkLocationStatus(2);
  

  // variable to store what corner to play in.
  // if toPlay does not get reassigned an
  // available corner to play, it stays at 
  // zero and triggers the next stage of 
  // corner plays
  var toPlay = 0;

  
  // initially sets toPlay to store the location of the 
  // first available empty corner square
  for (var i = 0; i < 4; i++)
  {
    if (checkLocationStatus(cornerArray[i]) == 0)
    {
        toPlay = cornerArray[i];
    }
  }

  // this series of if/else statements changes toPlay
  // based off of whether or not there are user side plays
  // to play corners off of 
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

  // the following two if statements handle two 
  // variations on this situation:
  //    [ ][u][ ]
  //    [c][c][u]
  //    [u][ ][ ]
  // two of the permutations above out of four, the cpu
  // would play 1 slot instead of 3 or 9
  // the other two permutations seem to be handled by
  // normal algorithm
  if(oneStatus == 1 &&
          sixStatus == 1 &&
          eightStatus == 1)
  {
    if (sevenStatus == 0)
    {
      toPlay = 7;
    }
  }

  if (sevenStatus == 1 &&
           twoStatus == 1 &&
           sixStatus == 1)
  {
    if (nineStatus == 0)
    {
      toPlay = 9;
    }
  }

  // if toPlay was successfully assigned something 
  // other than zero in the previous code, then that
  // toPlay corner will be made here
  // otherwise, the function launches into the business
  // of REACTING with sideplays to the user's corner plays.
  // especially NOT sure of value of this last block of
  // handling
  if (toPlay)
  {
    var crnrId = cpuChoice + toPlay;
    var crnrPlay = document.getElementById(crnrId); 
    crnrPlay.style.display = "block";
    recordMove(toPlay, "cpu");
    checkWinningCondition();
    cornerPlayMade = true;
    // global variable gets assigned first corner
    // played by cpu
    firstCorner = toPlay;
  } 
  else if (checkLocationStatus(1) == 1 &&
           (checkLocationStatus(2) == 0 ||
            checkLocationStatus(4) == 0))
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

  // returns whether or not we made a move inside
  // this function
  return cornerPlayMade;
}

// this checks to see if there are any plays
// that must be made in order to either
// block the user from winning OR clinch the
// win of the cpu
function checkForMandatoryPlay()
{
  // this loop checks for plays needed to clinch the
  // win for the cpu
  for (var sequence in winningSequences)
  {
    // of the three squares needed to win tic tac toe, 
    // holds count of how many of those squares of the
    // eight possible winning combinations have been
    // made by the cpu
    var cpuCtr = 0;

    // loops through and tests each element of
    // each winningSequences array
    for (var i = 0; i < 3; i++)
    {
      var cpuTest = winningSequences[sequence][i];
      if (playRecord[cpuTest][0] == cpuChoice)
      {
        cpuCtr++;
      }

      // if out of three winning moves, at least two in 
      // the three have been won, calls checkSequence to
      // see if the third is available to play, and if
      // so triggers mandatoryPlay flag to true
      if (cpuCtr == 2 && i == 2)
      {
        checkSequence(winningSequences[sequence], sequence);

        if (mandatoryPlay)
        {
          return;
        }
      }
    }
  }
  
  // this loop checks for plays needed to BLOCK a 
  // win by the user
  for (var sequence in winningSequences)
  {
    // holds count of user squares, to see if 
    // at least two out of a winning sequence
    // are occupied
    var userCtr = 0;

    // loops through and tests each element of
    // each winningSequences array
    for (var i = 0; i < 3; i++)
    {
      var userTest = winningSequences[sequence][i];
      if (playRecord[userTest][0] == userChoice) 
      {
        userCtr++;
      }

      // if out of three winning moves, at least two in 
      // the three have been won, calls checkSequence to
      // see if the third is available to play, and if
      // so triggers mandatoryPlay flag to true
      if (userCtr == 2 && i == 2)
      {
        checkSequence(winningSequences[sequence], sequence);
      }
    }
  }
}

// checks to see if any sequence of two can
// be blocked to prevent user win, or made
// to seal cpu win.
// also eliminates potential winning sequences
// from winningSequences global array that have
// been nullified
function checkSequence(seq, index)
{
  // variables to hold the square to check,
  // adds one to have accurate element id
  // instead of zero-based index of array
  var toCheckOne = seq[0] + 1;
  var toCheckTwo = seq[1] + 1;
  var toCheckThree = seq[2] + 1;
 
  // if two of any winning sequences are met,
  // AND the third is available to play, the
  // mandatoryPlay global flag is triggered
  // and set to that threatening sequence
  if (checkLocationStatus(toCheckOne) == 0 ||
      checkLocationStatus(toCheckTwo) == 0 ||
      checkLocationStatus(toCheckThree) == 0)
  {
    mandatoryPlay = seq;
    winningSequences.splice(index, 1); 
  }

  // if the threatening sequence has already 
  // been blocked, just removes it from the global
  // winningSequences array
  if (checkLocationStatus(toCheckOne) != 0 &&
      checkLocationStatus(toCheckTwo) != 0 &&
      checkLocationStatus(toCheckThree) != 0)
  {
    winningSequences.splice(index, 1); 
  } 

}

/* ---The next six functions handle responses to specific
sequences of play. If they make a play, they return a boolean
to the calling function (playComputerTurn) to indicate a play
was made to let that function know to either return play to
the user, or keep looking for an adequate play. --- */

// either plays adjacent to a user's SECOND corner play
// OR if center square is taken by user, will play an
// appropriate corner
function calcAdjacent()
{
  var adjacentPlay = false;
  // object whose keys are possible user plays, values are
  // arrays that hold acceptable cpu plays to that corner
  var adjacentRange = {'1': [2, 4], '3': [2, 6], '9': [8, 6], '7': [4, 8]};
 
  // check which if either player has the center square
  var fiveStatus = checkLocationStatus(5);

  // plays the adjacent square if center is unoccupied
  if (fiveStatus != 1)
  {
    for (var key in adjacentRange) 
    {
      if (key == secondCorner && 
          checkLocationStatus(adjacentRange[key][0]) == 0)
      {
        adjacentPlay = true;
        var cpuId = cpuChoice + adjacentRange[key][0];
        var squareToPlay = document.getElementById(cpuId);
        squareToPlay.style.display = "block";
        recordMove(adjacentRange[key][0], "cpu");
        checkWinningCondition();
        break;
      }
    } 
  }
  else if (fiveStatus == 1)
  {
    // uses cornerTri to triangulate the correct
    // corner response to user having the center
    // and a corner
    var toPlay = 0;
    var cornerTri = firstCorner + secondCorner;
    if ((cornerTri == "91" || cornerTri == "19") &&
        checkLocationStatus(3) == 0)
    {
      adjacentPlay = true;
      toPlay = 3; 
    }
    else if ((cornerTri == "37" || cornerTri == "73") &&
             checkLocationStatus(9) == 0)
    {
      adjacentPlay = true;
      toPlay = 9;
    }

    var cpuId = cpuChoice + toPlay;
    var squareToPlay = document.getElementById(cpuId);
    squareToPlay.style.display = "block";
    recordMove(toPlay, "cpu");
    checkWinningCondition();
  }

  return adjacentPlay;
}

// responds to snake pattern
function snakePlay()
{
  // boolean if play made
  var snakePlayed = 0;

  // checks user's first and second plays to 
  // respond appropriately
  if (firstUser == 8 &&
      secondUser == 1)
  {
    if (checkLocationStatus(4) == 0)
    {
      snakePlayed = 4;
    }
  }    
  else if (firstUser == 2 &&
           secondUser == 9)
  {
    if (checkLocationStatus(6) == 0)
    {
      snakePlayed = 6;
    }
  }
  else if (firstUser == 6 &&
           secondUser == 7)
  {
    if (checkLocationStatus(8) == 0)
    {
      snakePlayed = 8;
    }
  }

  // makes the play
  if (snakePlayed)
  {
    var cpuId = cpuChoice + snakePlayed;
    var snakeMove = document.getElementById(cpuId);
    snakeMove.style.display = "block";
    recordMove(snakePlayed, "cpu");
    checkWinningCondition();
  }

  // tells calling function if play was made here
  return snakePlayed;
}

// responds to fork pattern
function forkPlay()
{
  // boolean if play made 
  var forkPlayed = 0;

  // checks user's first, second, and third plays
  // to accurately respond to them
  if (firstUser == 8 &&
      secondUser == 1 &&
      thirdUser == 6)
  {
    if (checkLocationStatus(3) == 0)
    {
      forkPlayed = 3;
    }
  }   

  if (firstUser == 6 &&
      secondUser == 7 &&
      thirdUser == 2)
  {
    if (checkLocationStatus(1) == 0)
    {
      forkPlayed = 1;
    }
  }

  // makes the play
  if (forkPlayed)
  {
    var cpuId = cpuChoice + forkPlayed;
    var forkMove = document.getElementById(cpuId);
    forkMove.style.display = "block";
    recordMove(forkPlayed, "cpu");
    checkWinningCondition();
  }

  // tells calling function if play was made here
  return forkPlayed;
}

// responds to horse pattern
function horsePlay()
{
  // boolean if play made
  var horseRes = 0;

  // checks location of empty square
  if (checkLocationStatus(6) == 0)
  {
    var horseRes = 6; 
  }
  else if (checkLocationStatus(9) == 0)
  {
    var horseRes = 9;
  }

  // makes play
  if (horseRes)
  {
    var cpuId = cpuChoice + horseRes;
    var horseMove = document.getElementById(cpuId);
    horseMove.style.display = "block";
    recordMove(horseRes, "cpu");
    checkWinningCondition();
  }

  // tells calling function if play was made here
  return horseRes;
}

// responds to diagonal pattern
function diagonalPlay()
{
  // boolean if play made
  var diagPlay = 0;
  
  // checks for empty squares to play
  if (checkLocationStatus(6) == 0)
  {
    diagPlay = 6;
  }
  else if (checkLocationStatus(4) == 0)
  {
    diagPlay = 4;
  }

  // makes play
  if (diagPlay)
  {
    var cpuId = cpuChoice + diagPlay;
    var diagPlayed = document.getElementById(cpuId);
    diagPlayed.style.display = "block";
    recordMove(diagPlay, "cpu");
    checkWinningCondition();
  }

  // tells calling function if play was made here
  return diagPlay;
}

// responds to tree pattern
function treePlay()
{
  // boolean whether play is made
  var treePlayed = 0;

  // checks for empty square to play
  if (checkLocationStatus(1) == 0)
  {
    treePlayed = 1;
  }
  else if (checkLocationStatus(7) == 0)
  {
    treePlayed = 7;
  }

  // makes the play
  if (treePlayed)
  {
    var cpuId = cpuChoice + treePlayed;
    var treeMove = document.getElementById(cpuId);
    treeMove.style.display = "block";
    recordMove(treePlayed, "cpu");
  }

  // tells calling function if play was made here
  return treePlayed;
}
