To Use this documentation, pull this repo or simply download and open in an AI IDE tool like Cursor or Claude Code. 






Transferring the Code to UiPath Action Center
Once the AI IDE has provided the complete HTML, CSS, and JavaScript code in separate blocks, follow these steps to deploy it within UiPath.

Step 1: Open the UiPath App
Navigate to the UiPath App in which you want to host the custom component.

Go to the page or form where the component will be placed.

Step 2: Add the Custom HTML Component
From the left-hand panel in the App designer, drag and drop a Custom HTML component onto your page.

Position the component where you want your application to appear.

Step 3: Add CSS and JavaScript
Add CSS:

With the Custom HTML component selected, go to the right-hand Properties panel.

Find the CSS section and paste the entire CSS code block.

Add JavaScript:

Still in the Properties panel, find the JS section.

Paste the entire JavaScript code block.

Step 4: Paste the HTML Body Content
Find the Source field in the Properties panel.

Copy the content inside the <body> tag from the AI IDE's output and paste it here.

Step 5: Link External Resources
In the Properties panel, use the External Scripts and External Stylesheets sections to add URLs for any external libraries.

Step 6: Configure App Variables
This is a crucial step to link the HTML component to your UiPath workflow.

In the UiPath Apps designer, go to the Variables section.

Create a new App variable for each variable specified in the AI's prompt.

Select the Custom HTML component.

In the Properties panel, find the Input Properties and Output Properties sections.

Add the necessary variables to these sections to establish the data flow.

Step 7: Configure for Action Center (if applicable)
If this component is part of an Action Center task, you must create an Action Schema and use a UiPath button to submit the data. The Custom HTML component's App.setVariable calls will populate the action schema variable.

Create an Action Schema:

In your UiPath process, define a data structure that mirrors the variables you want to pass out. For our example, you would create an object with fields for finalDecision and reviewerComments. This structure is your Action Schema.

Use a UiPath Button:

Place a standard UiPath Button outside of your Custom HTML component. This button will be your submit button.

In the button's Events panel, configure the Click event.

Add an Set Value rule to the button's click event. For each variable you want to pass out, set an action schema variable equal to the corresponding App variable (e.g., ActionSchema.finalDecision = App.finalDecision).

This approach ensures that your data is correctly packaged and submitted back to the Orchestrator flow for processing once the user completes the action.