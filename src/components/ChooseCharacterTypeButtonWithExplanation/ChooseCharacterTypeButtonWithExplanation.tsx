import React from 'react';
import styles from './ChooseCharacterTypeButtonWithExplanation.module.css';

interface Props {
    buttonColor: string;
    buttonText: string; 
    explanation: string;
    callback: (arg0: {screenName: string, playerOneCharacterType: string,
    computerCharacterType: string}) => void;
}

const ChooseCharacterTypeButtonWithExplanation: React.FC<Props> = (props: Props) => {

    const computerCharacterTypeNumber = Math.floor(Math.random() * 3);
    let computerCharacterType = "None Yet";

    if (computerCharacterTypeNumber === 0)
    {
      computerCharacterType = "Bodyguard";
    }
    else if (computerCharacterTypeNumber === 1)
    {
      computerCharacterType = "Mage";
    }
    else if (computerCharacterTypeNumber === 2)
    {
      computerCharacterType = "Assassin";
    }

    const buttonText = props.buttonText;

    const characterTypeButtonPressed = () => {
        props.callback({screenName: "Element Selection Screen", playerOneCharacterType: buttonText,
        computerCharacterType: computerCharacterType}); 
     }

    return(
        <div className={styles.buttonWithExplanationDiv}>
            <div className="centeredDivPerfectButtonSize">
                <button style={{background: props.buttonColor}} 
                    onClick={() => {characterTypeButtonPressed()}}>
                    {props.buttonText}
                </button>
            </div>
            <p>
                {props.explanation}
            </p>
        </div>
    );
};

export default ChooseCharacterTypeButtonWithExplanation;