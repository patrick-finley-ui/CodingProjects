//Create a react app from scratch.
//It should display a h1 heading.
//It should display an unordered list (bullet points).
//It should contain 3 list elements.

// If you're running this locally in VS Code use the commands:
// npm install
// to install the node modules and
// npm run dev
// to launch your react project in your browser
import { createRoot } from 'react-dom/client';
import React from 'react';
import './styles.css'
const firstName = "Patrick";
const lastName = "Finley"


const root = createRoot(document.getElementById('root'));
root.render(
<React.StrictMode>
<div>
            <h1 className="heading" contentEditable={true} spellCheck={false}>Hello my name is {firstName} {lastName}</h1>
            <img src="https://images.unsplash.com/photo-1519125323398-675f0ddb6308" alt="mountain mist" />
            <img src="https://images.unsplash.com/photo-1506744038136-46273834b3fb" alt="forest lake" />
            <img src="https://images.unsplash.com/photo-1465101046530-73398c7f28ca" alt="desert dunes" />

</div>
</React.StrictMode>
);
