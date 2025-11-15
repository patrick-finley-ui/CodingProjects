import { createRoot } from 'react-dom/client';
import React from 'react';
import './styles.css'

const currentTime = new Date().getHours();

let portionOfDay;
let color;
if (currentTime < 12) {
    portionOfDay = "morning";
    color = "red";
} else if (currentTime < 18) {
    portionOfDay = "afternoon";
    color = "green";
} else {
    color = "blue";
    portionOfDay = "evening";
}


const root = createRoot(document.getElementById('root'));

root.render(
    <React.StrictMode>
        <h1 style={{ color: color }}>Good {portionOfDay}!</h1>
    </React.StrictMode>
)