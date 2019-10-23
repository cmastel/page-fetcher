const request = require('request');
const fs = require('fs');
const readline = require('readline');
const args = process.argv.slice(2);

//stores createInterface as a variable
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const url = args[0];
const fileName = args[1];

request(url, (error, response, body) => {
  if (error) {
    console.log('error', error); // print the error if one occured
    process.exit();
  }
  
  if (response && response.statusCode) {
    console.log('statusCode:', response && response.statusCode); // print the repsonse status if a response was received
    if (response.statusCode !== 200) {
      console.log('Bad status code, exiting app.');
      process.exit();
    }
  }
  
  fs.access(fileName, fs.constants.F_OK, (err) => {
    console.log(`${fileName} ${err ? 'does not exist' : 'exists'}`);
    if (!err) {
      console.log('option to overwrite');
      rl.question('That file exists. Would you like to overwrite (y/n)? ', (answer) => {
        if (answer === 'n') {
          console.log('Not overwriting. Exiting.');
          process.exit();
        } else {

          fs.access(fileName, fs.constants.W_OK, (err) => {
            if (err) {
              console.log('Not able to write. Exiting.');
              process.exit();
            } else {

              fs.writeFile(fileName, body, (err) => {
                if (err) {
                  console.log('There was an error saving the file.');
                  throw err;
                }
                const stats = fs.statSync(fileName);
                console.log(`Downloaded and saved ${stats.size} bytes to ${fileName}`);
              });

            };
          });

  
        }
        rl.close();
      })
    } else {
      
      fs.writeFile(fileName, body, (err) => {
        if (err) {
          console.log('There was an error saving the file.');
          throw err;
        }
        const stats = fs.statSync(fileName);
        console.log(`Downloaded and saved ${stats.size} bytes to ${fileName}`);
        process.exit();
      });

    }
  })
  


});
