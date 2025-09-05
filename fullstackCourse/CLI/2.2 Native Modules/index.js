const fs = require("fs");

// First, write the initial content
fs.writeFile("message.txt", "Hello From NodeJS!", (err) => {
    if (err) throw err;
    console.log("The File has been saved!");
    
    // Then append additional content
    fs.appendFile("message.txt", "\nHello from Pat!", (err) => {
        if (err) throw err;
        console.log("The File has been updated");
        
        // Finally, read and display the full content
        fs.readFile("message.txt", 'utf8', (err, data) => {
            if (err) throw err;
            console.log("Full content of message.txt:");
            console.log(data);
        });
    });
}); 