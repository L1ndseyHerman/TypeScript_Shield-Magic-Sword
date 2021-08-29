import React, { useState, useEffect } from 'react';

import HomeScreen from './components/HomeScreen/HomeScreen';

import CharacterTypeSelectionScreen from './components/CharacterTypeSelectionScreen/CharacterTypeSelectionScreen';

import ElementSelectionScreen from './components/ElementSelectionScreen/ElementSelectionScreen';

import ConstantPlayerInfo from './components/ConstantPlayerInfo/ConstantPlayerInfo';
import GameButtonWithExplanation from './components/GameButtonWithExplanation/GameButtonWithExplanation';
import ThisTurnsPlayerInfo from './components/ThisTurnsPlayerInfo/ThisTurnsPlayerInfo';
import TurnResultsText from './components/TurnResultsText/TurnResultsText';
import NewGameButton from './components/NewGameButton/NewGameButton';
 
const makeComputerChoice = () => {
  let computerNumber = Math.floor(Math.random() * 2); 
  const lastComputerChoice = String(sessionStorage.getItem("lastComputerChoice") || "An Error");

  if ((lastComputerChoice === "Shield") && (computerNumber === 0))
  {
    return "Magic";
  }
  else if ((lastComputerChoice === "Shield") && (computerNumber === 1))
  {
    return "Sword";
  }
  else if ((lastComputerChoice === "Magic") && (computerNumber === 0))
  {
    return "Shield";
  }
  else if ((lastComputerChoice === "Magic") && (computerNumber === 1))
  {
    return "Sword";
  }
  else if ((lastComputerChoice === "Sword") && (computerNumber === 0))
  {
    return "Shield";
  }
  else if ((lastComputerChoice === "Sword") && (computerNumber === 1))
  {
    return "Magic";
  }
  //  Means this is the first turn, so choose whatever: 
  else 
  {
    computerNumber = Math.floor(Math.random() * 3); 
  
    if (computerNumber === 0)
    {
      return "Shield";
    }
    else if (computerNumber === 1)
    {
      return "Magic";
    }
    else 
    {
      return "Sword";
    }
  }
}

const checkThisPlayersHealthLost = (thisPlayersChoice: string, theOtherPlayersChoice: string) => {
  if (thisPlayersChoice === "Shield" && theOtherPlayersChoice === "Shield")
  {
    return 0;
  }
  else if (thisPlayersChoice === "Shield" && theOtherPlayersChoice === "Magic")
  {
    return 1;
  }
  else if (thisPlayersChoice === "Shield" && theOtherPlayersChoice === "Sword")
  {
    return 0;
  }

  else if (thisPlayersChoice === "Magic" && theOtherPlayersChoice === "Shield")
  {
    return 0;
  }
  else if (thisPlayersChoice === "Magic" && theOtherPlayersChoice === "Magic")
  {
    return 1;
  }
  else if (thisPlayersChoice === "Magic" && theOtherPlayersChoice === "Sword")
  {
    return 2;
  }

  else if (thisPlayersChoice === "Sword" && theOtherPlayersChoice === "Shield")
  {
    return 0;
  }
  else if (thisPlayersChoice === "Sword" && theOtherPlayersChoice === "Magic")
  {
    return 1;
  }
  else if (thisPlayersChoice === "Sword" && theOtherPlayersChoice === "Sword")
  {
    return 2;
  }

  return 0;
}

const checkBonusElementDamage = (thisPlayersElement: string, theOtherPlayersElement: string) => {
  if ((thisPlayersElement === "Fire") && (theOtherPlayersElement === "Earth"))
  {
    return 1;
  }
  else if ((thisPlayersElement === "Earth") && (theOtherPlayersElement === "Air"))
  {
    return 1;
  }
  else if ((thisPlayersElement === "Air") && (theOtherPlayersElement === "Water"))
  {
    return 1;
  }
  else if ((thisPlayersElement === "Water") && (theOtherPlayersElement === "Fire"))
  {
    return 1;
  }
  else if ((thisPlayersElement === "Light") && (theOtherPlayersElement === "Dark"))
  {
    return 1;
  }
  else if ((thisPlayersElement === "Dark") && (theOtherPlayersElement === "Light"))
  {
    return 1;
  }
  else 
  {
    return 0;
  }
}

const checkWinLooseTie = (playerOneHealth: number, computerHealth: number) => {
  if ((playerOneHealth <= 0) && (computerHealth <= 0))
  {
    return "Tie.";
  }
  else if (playerOneHealth <= 0)
  {
    return "Computer wins.";
  }
  else if (computerHealth <= 0)
  {
    return "Player1 wins!";
  }
  //  Make it nothing if no Game Over yet:
  else 
  {
    return "";
  }
}

const App: React.FC = () => {
  //  I would like to condense these useStates into a playerOne class useState and a 
  //  computer class useState, but I have some useEffects that only change when 
  //  three states change, and I think they would update anytime anything in the object 
  //  does, right? Like I want a useState to get called when playerOneHealth changes, but 
  //  not when playerOneCharaterType changes, but I think if they were in the same object,
  //  the useEffect would get called when either one changes?

  //  Reordered these const/variables a little to be kind of in order of the screens they happen on? 
  const [screenName, setScreenName] = useState("Shield-Magic-Sword");

  const [playerOneCharacterType, setPlayerOneCharacterType] = useState("None Yet");
  const [computerCharacterType, setComputerCharacterType] = useState("None Yet");

  const [playerOneElement, setPlayerOneElement] = useState("None Yet");
  const [computerElement, setComputerElement] = useState("None Yet");

  //  Wheat is the default button color in index.css, so I'm using it as the default color here too.
  const [playerOneElementColor, setPlayerOneElementColor] = useState("wheat");
  const [computerElementColor, setComputerElementColor] = useState("wheat");

  const [playerOneChoice, setPlayerOneChoice] = useState("First Turn");
  let computerChoice = "First Turn";
  const [disabledButtons, setDisabledButtons] = useState([false, false, false]);
  let playerOneHealth = 20;
  let computerHealth = 20;
  let playerOneCharacterTypeText = "";
  let playerOneElementalBonusText = "";
  let computerCharacterTypeText = "";
  let computerElementalBonusText = "";
  let winLooseTieText = "";

  const [isNotNewGame, setIsNotNewGame] = useState(true);
  let buttonsAndExplanationsDivDisplay = "block";
  let newGameButtonDisplay = "none";

  //  Already reset to 20 if it is :)
  if (isNotNewGame)
  {
    playerOneHealth = Number(sessionStorage.getItem("playerOneHealth") || 20);
    computerHealth = Number(sessionStorage.getItem("computerHealth") || 20);
  }

  if (playerOneChoice !== "First Turn") 
  {
    computerChoice = makeComputerChoice();

    const playerOneHealthLost = checkThisPlayersHealthLost(playerOneChoice, computerChoice);
  
    let playerOneLoosesThisMuchHealthDueToComputerCharacterType = 0;

    if (playerOneChoice === "Shield" && playerOneCharacterType === "Bodyguard"
      && computerChoice === "Magic")
    {
      playerOneLoosesThisMuchHealthDueToComputerCharacterType = 
        playerOneLoosesThisMuchHealthDueToComputerCharacterType - 1;
      computerCharacterTypeText = computerCharacterTypeText +
        "(-1 Magic Damage because Player1 is a Bodyguard.) ";
    }
    if (computerChoice === "Magic" && computerCharacterType === "Mage")
    {
      playerOneLoosesThisMuchHealthDueToComputerCharacterType = 
        playerOneLoosesThisMuchHealthDueToComputerCharacterType + 1;
      computerCharacterTypeText = computerCharacterTypeText +
        "(+1 Magic Damage because Computer is a Mage.) ";
    }
    if (computerChoice === "Sword" && computerCharacterType === "Assassin")
    {
      playerOneLoosesThisMuchHealthDueToComputerCharacterType = 
        playerOneLoosesThisMuchHealthDueToComputerCharacterType + 1;
      computerCharacterTypeText = computerCharacterTypeText +
        "(+1 Physical Damage because Computer is an Assassin.) ";
    }

    let computerElementalBonusDamage = 0;
    if (computerChoice === "Magic")
    {
      computerElementalBonusDamage = checkBonusElementDamage(computerElement, playerOneElement);
    }

    playerOneHealth = playerOneHealth - playerOneHealthLost - computerElementalBonusDamage
      - playerOneLoosesThisMuchHealthDueToComputerCharacterType;

    if (computerElementalBonusDamage > 0)
    {
      computerElementalBonusText = "(+1 bonus elemental damage)";
    }

    const computerHealthLost = checkThisPlayersHealthLost(computerChoice, playerOneChoice);

    let computerLoosesThisMuchHealthDueToPlayerOneCharacterType = 0;

    if (computerChoice === "Shield" && computerCharacterType === "Bodyguard"
      && playerOneChoice === "Magic")
    {
      computerLoosesThisMuchHealthDueToPlayerOneCharacterType = 
        computerLoosesThisMuchHealthDueToPlayerOneCharacterType - 1;
      playerOneCharacterTypeText = playerOneCharacterTypeText +
        "(-1 Magic Damage because Computer is a Bodyguard.) ";
    }
    if (playerOneChoice === "Magic" && playerOneCharacterType === "Mage")
    {
      computerLoosesThisMuchHealthDueToPlayerOneCharacterType = 
        computerLoosesThisMuchHealthDueToPlayerOneCharacterType + 1;
      playerOneCharacterTypeText = playerOneCharacterTypeText +
        "(+1 Magic Damage because Player1 is a Mage.) ";
    }
    if (playerOneChoice === "Sword" && playerOneCharacterType === "Assassin")
    {
      computerLoosesThisMuchHealthDueToPlayerOneCharacterType = 
        computerLoosesThisMuchHealthDueToPlayerOneCharacterType + 1;
      playerOneCharacterTypeText = playerOneCharacterTypeText +
        "(+1 Physical Damage because Player1 is an Assassin.) ";
    }

    let playerOneElementalBonusDamage = 0;
    if (playerOneChoice === "Magic")
    {
      playerOneElementalBonusDamage = checkBonusElementDamage(playerOneElement, computerElement);
    }
    computerHealth = computerHealth - computerHealthLost - playerOneElementalBonusDamage -
    computerLoosesThisMuchHealthDueToPlayerOneCharacterType;

    if (playerOneElementalBonusDamage > 0)
    {
      playerOneElementalBonusText = "(+1 bonus elemental damage)";
    }

    winLooseTieText = checkWinLooseTie(playerOneHealth, computerHealth);
  }

  if ((playerOneHealth <= 0) || (computerHealth <= 0))
  {   
    buttonsAndExplanationsDivDisplay = "none";
    newGameButtonDisplay = "block";
  }

  //  This is so you can't refresh the page in the middle of a game to get a more favorable element.
  //  No cheating, lol. If you go back to the elementSelectScreen, the score resets.
  useEffect(() => {
    sessionStorage.setItem("playerOneHealth", "20");
    sessionStorage.setItem("computerHealth", "20");
    sessionStorage.setItem("lastComputerChoice", "First Turn");
  }, [screenName])

  useEffect(() => {
      //  Since there didn't use to be a choice, client may have previous localStorage data
      //  that needs to be cleared.
      localStorage.removeItem("playerOneHealth");
      localStorage.removeItem("computerHealth");
      localStorage.removeItem("lastComputerChoice");

      sessionStorage.setItem("playerOneHealth", String(playerOneHealth));
      sessionStorage.setItem("computerHealth", String(computerHealth));
      sessionStorage.setItem("lastComputerChoice", computerChoice);

      //  New! TechWithTim said this makes the useEffect() only run when the variables 
      //  you put in this array change, instead of all the variables.
}, [computerChoice, computerHealth, playerOneHealth])

  const beginGameButtonPressed = (beginGameButtonSettings: {screenName: string}) => {
    setScreenName(beginGameButtonSettings.screenName);
  }

  const chooseCharacterTypeButtonPressed = (characterTypeButtonSettings: 
    {screenName: string, 
    playerOneCharacterType: string,
    computerCharacterType: string}) => {
    setScreenName(characterTypeButtonSettings.screenName);
    setPlayerOneCharacterType(characterTypeButtonSettings.playerOneCharacterType);
    setComputerCharacterType(characterTypeButtonSettings.computerCharacterType);
  }

  const chooseElementButtonPressed = (chooseElementButtonSettings: 
    {screenName: string, 
    playerOneElement: string, 
    playerOneElementColor: string, 
    computerElement: string,
    computerElementColor: string}) => {
    setScreenName(chooseElementButtonSettings.screenName);
    setPlayerOneElement(chooseElementButtonSettings.playerOneElement);
    setPlayerOneElementColor(chooseElementButtonSettings.playerOneElementColor);
    setComputerElement(chooseElementButtonSettings.computerElement);
    setComputerElementColor(chooseElementButtonSettings.computerElementColor);
  }

  //  This could come from a GameButtonWithExplanation or a NewGameButton.
  const gameButtonOrNewGameButtonPressed = (currentGameOrNewGameSettings: 
    {isNotNewGame: boolean, 
    playerOneChoice: string, 
    disabledButtons: boolean[],
    screenName: string}) => {
    setIsNotNewGame(currentGameOrNewGameSettings.isNotNewGame);
    setPlayerOneChoice(currentGameOrNewGameSettings.playerOneChoice);
    setDisabledButtons(currentGameOrNewGameSettings.disabledButtons); 
    setScreenName(currentGameOrNewGameSettings.screenName);
  }

  //  I'm just doing these statements in order, so the "if" is the first screen when 
  //  the website loads/the browser refreshes, then the "else if" is the next "page", then the 
  //  next "else if" is the next one, etc. 
  if (screenName === "Shield-Magic-Sword")
  {
    return (
      <HomeScreen callback={beginGameButtonPressed} />
    );
  }

  else if (screenName === "Character Type Selection Screen")
  {
    return (
      <CharacterTypeSelectionScreen callback={chooseCharacterTypeButtonPressed} />
    );
  }

  else if (screenName === "Element Selection Screen")
  {
    return (
      <ElementSelectionScreen callback={chooseElementButtonPressed} />
    );
  }

  else if (screenName === "Game Screen")
  {
    return (
      <main>   
        <div id="outermostDiv">
          <h1>{screenName}</h1>
          <p>
            The rules of this game are that you can&apos;t make the same choice twice in a row,
            and neither can the computer. Use that to your advantage....
          </p>
          <div id="playerInfoDivs">
            <ConstantPlayerInfo 
              floatDirection="left"
              constantElementText="Player1 element: "
              element={playerOneElement} 
              elementColor={playerOneElementColor}
              characterType={playerOneCharacterType} />
            <ConstantPlayerInfo 
              floatDirection="right"
              constantElementText="Computer element: "
              element={computerElement} 
              elementColor={computerElementColor}
              characterType={computerCharacterType} />
          </div>
          <div id="buttonsAndExplanationsDiv" style={{display: buttonsAndExplanationsDivDisplay}}>
            <GameButtonWithExplanation 
              buttonColor="darkolivegreen"
              buttonText="Shield" 
              explanation="Blocks two physical damage."
              buttonNumber="0" 
              isDisabled={disabledButtons[0]} 
              disabledButtonArray={disabledButtons} 
              callback={gameButtonOrNewGameButtonPressed} />
            <GameButtonWithExplanation 
              buttonColor="royalblue"
              buttonText="Magic" 
              explanation="Deals one magic damage."
              buttonNumber="1" 
              isDisabled={disabledButtons[1]} 
              disabledButtonArray={disabledButtons} 
              callback={gameButtonOrNewGameButtonPressed} />
            <GameButtonWithExplanation 
              buttonColor="firebrick"
              buttonText="Sword" 
              explanation="Deals two physical damage."
              buttonNumber="2" 
              isDisabled={disabledButtons[2]} 
              disabledButtonArray={disabledButtons}  
              callback={gameButtonOrNewGameButtonPressed} />
          </div>
          <div id="playerInfoDivs">
            <ThisTurnsPlayerInfo 
              floatDirection="left"
              constantHealthText="Player1 health: " 
              changingNumber={playerOneHealth} 
              element={playerOneElement} 
              choice={playerOneChoice} />
            <ThisTurnsPlayerInfo
              floatDirection="right"
              constantHealthText="Computer health: " 
              changingNumber={computerHealth}  
              element={computerElement} 
              choice={computerChoice} />
          </div>
          <TurnResultsText 
            playerOneElementColor={playerOneElementColor}
            playerOneChoice={playerOneChoice} 
            playerOneCharacterTypeText={playerOneCharacterTypeText}
            playerOneElementalBonusText={playerOneElementalBonusText}
            computerElementColor={computerElementColor}
            computerChoice={computerChoice}
            computerCharacterTypeText={computerCharacterTypeText}
            computerElementalBonusText={computerElementalBonusText}
            winLooseTieText={winLooseTieText} />
          <NewGameButton 
            newGameButtonDisplay={newGameButtonDisplay}
            callback={gameButtonOrNewGameButtonPressed} />
        </div>
      </main>
    );
  }

  //  Whoops, I was missing this and TypeScript caught it. Good job TS!
  return (
    <main>   
      <div id="outermostDiv">
      </div>
    </main>
  );

};

export default App;
