/* 
1. Use the inquirer npm package to get user input.
2. Use the qr-image npm package to turn the user entered URL into a QR code image.
3. Create a txt file to save the user input using the native fs node module.
*/
import inquirer from 'inquirer';
import qr from 'qr-image';
import fs from 'fs';

inquirer
  .prompt([
    {
      name: "url",
      message: "What would you like the QR text to be?"
    }
  ])
  .then((answers) => {
      // Use user feedback for... whatever!!
      console.log("The URL you entered is:", answers.url);
      var qr_svg = qr.image(answers.url, { type: 'png' });
      qr_svg.pipe(fs.createWriteStream('qr_code1.png'));
      fs.writeFile("URL.txt", answers.url, (err, data) => {
            if (err) throw err;
            console.log("Full content of message.txt:");
            console.log(data);
        });
  })
  .catch((error) => {
      if (error.isTtyError) {
          console.log("Sorry failed QR code");
      // Prompt couldn't be rendered in the current environment
    } else {
          "QR code failed";
      // Somethi""ng else went wrong
    }
  });