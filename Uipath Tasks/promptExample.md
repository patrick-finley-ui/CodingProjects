Prompt to Teach UiPath Custom HTML App Development with an AI IDE
Core Task: You are a senior software developer specializing in front-end components for business process automation. Your goal is to create a complete, self-contained HTML component for a UiPath App/Action Center Task. This component will serve as a teaching example for others on how to use an AI IDE (like yourself) to build robust UiPath custom HTML apps.

Scenario for the App: The application is for a <Your_Use_Case_Name>. A user will receive a task with details about a <Your_Task_Object>. They must review the information, potentially add comments, and then make a decision to either <Your_Action_1> or <Your_Action_2>.

Technical and Pedagogical Requirements:

Strict Adherence to Documentation: You must use the provided UiPath_Compatibility_Analysis.md document as your single source of truth. Your code must demonstrate an expert-level understanding of all key rules and patterns, including:

No use of blocked browser APIs (window.alert, etc.).

Implementing a custom showMessage function for alerts and confirmations.

A robust, multi-fallback initialization pattern.

Safe DOM element access and event listener setup (always check for existence).

Use the provided setVariable and getVariable communication functions.

Bidirectional Variable Communication: The app must demonstrate seamless data flow between the UiPath environment and the HTML component.

Receive from UiPath: The component should load initial values from the following UiPath variables:

<List_of_Input_Variables_and_their_Data_Types>

Send to UiPath: The component must push updated values to the following UiPath variables:

<List_of_Output_Variables_and_their_Data_Types>

UI/UX Design: The design should be a clean, modern, and professional dark-mode theme suitable for a business application. Use a minimal, utility-first CSS approach, but embed all styles directly within the HTML to ensure the component is self-contained. The layout should be easy to read and intuitive to navigate. Use clear labels and a hierarchical structure.

Application Logic:

The component should display the received <Task_Object> details in a clear, read-only format.

Include a text area for the user to enter their <Comments_Variable>. This text area should update the UiPath variable only when the user's focus leaves the field (on blur), demonstrating an efficient approach for long-form input.

Two prominent action buttons, <Your_Action_1> and <Your_Action_2>, must be present.

Clicking either button must trigger a custom confirmation modal before setting the <Your_Decision_Variable>.

<A_Specific_Conditional_Logic_to_Implement> (e.g., "The <A_Specific_Input_Variable> variable received from UiPath should influence the UI. If the <A_Specific_Input_Variable> is <A_Specific_Value>, display a clear visual warning to the user, like a red or orange highlight.")

Output Format (Pedagogical):

Provide the complete, production-ready HTML, CSS, and JavaScript in a single, well-commented code block.

The comments should not only explain what the code does, but why it's written that way, explicitly referencing the rules from the UiPath_Compatibility_Analysis.md document (e.g., "Using if (element) check to follow the safe DOM access rule.").

Conclude with a brief summary of the key learning points demonstrated in the code.