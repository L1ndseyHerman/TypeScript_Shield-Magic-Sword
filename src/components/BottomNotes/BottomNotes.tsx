import React from 'react';

const BottomNotes: React.FC = () => {
    return(
        //  This is a "fragment", for if you don't want yet another div around a component.
        <>
            <p>
                Done with Version 4.2, which is adding TypeScript. I&apos;m going to take a break from this 
                for awhile to watch the longest React JS course yet
                on <a href="https://www.udemy.com/course/react-the-complete-guide-incl-redux/">Udemy.com</a>.
                So far, I&apos;ve been coding along with their Expense Tracker App, current
                progress <a href="https://github.com/L1ndseyHerman/Udemy-Expense-Tracker-App">Here</a>.
            </p>
            <p>
                If you are a software developer who wants to look at 
                previous versions of this website, you can go to
                my <a href="https://github.com/L1ndseyHerman/TypeScript_Shield-Magic-Sword">
                GitHub</a>, change the branch from &quot;master&quot; to the version 
                you are looking for, then pull the code and run it in VS Code.
            </p>
            <p>    
                I&apos;d like to shout out Tech With Tim&apos;s series of twelve
                React For Beginners videos on YouTube, the first of which
                is <a href="https://www.youtube.com/watch?v=Ma6DRDIedVE&t=1s">Here</a>,  
                for being a great ReactJS learning resource.
            </p>
            <p>
                This 7-Hour React JS 
                YouTube <a href="https://www.youtube.com/watch?v=nTeuhbP7wdE">Video</a> by
                freeCodeCamp.org was helpful as well. 
            </p>
            <p>And check out <a href="https://l1ndseyherman.github.io/">My Other Website</a>.</p>
            <footer>This is a React JS Progressive Web App. Updated 08/28/21</footer>
        </>
    );
};

export default BottomNotes;