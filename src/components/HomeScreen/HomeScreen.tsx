import React from 'react';

import BeginGameButton from '../BeginGameButton/BeginGameButton';
import BottomNotes from '..//BottomNotes/BottomNotes';

interface Props {
        callback: (arg0: { screenName: string; }) => void;
}

const HomeScreen: React.FC<Props> = (props: Props) => {
    return(
        <main>   
        <div id="outermostDiv">
          <h1>Shield-Magic-Sword</h1>
          <BeginGameButton callback={props.callback} />
          <BottomNotes />
        </div>
      </main>
    );
};
    
export default HomeScreen;