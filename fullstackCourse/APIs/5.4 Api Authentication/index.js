import express from "express";
import axios from "axios";

const app = express();
const port = 3000;
const API_URL = "https://secrets-api.appbrewery.com";

//TODO 1: Fill in your values for the 3 types of auth.
const yourUsername = "pfinley";
const yourPassword = "test123";
const yourAPIKey = "5f2964b0-7e23-4d73-8738-6c0d7c221fc2";
const yourBearerToken = "292d1f23-c753-4537-bbd6-d1c300827e2d";

app.get("/", (req, res) => {
  res.render("index.ejs", { content: "API Response." });
});

app.get("/noAuth", async (req, res) => {
  try {
    const response = await axios.get(API_URL + "/random");
    
    console.log(response);
    res.render("index.ejs", {content: JSON.stringify(response.data)});
  }
  catch (error) {
    console.log("Error");
      res.status(404).send(error.message);
  }
  //TODO 2: Use axios to hit up the /random endpoint

  //The data you get back should be sent to the ejs file as "content"
  //Hint: make sure you use JSON.stringify to turn the JS object from axios into a string.
});

app.get("/basicAuth", async (req, res) => {
  const page = 2;
  //TODO 3: Write your code here to hit up the /all endpoint
  //Specify that you only want the secrets from page 2
  //HINT: This is how you can use axios to do basic auth:
  // https://stackoverflow.com/a/74632908
  /*
   axios.get(URL, {
      auth: {
        username: "abc",
        password: "123",
      },
    });
  */
    try {
      const response = await axios.get((API_URL + "/all?page="+2),
        {
          auth: {
            username: yourUsername,
            password: yourPassword
          }
        }
      );
        
        
    
    console.log(response.data);
    res.render("index.ejs", {content: JSON.stringify(response.data)});
  }
  catch (error) {
    console.log("Error");
      res.status(404).send(error.message);
  }
});

app.get("/apiKey", async (req, res) => {
  //TODO 4: Write your code here to hit up the /filter endpoint
  //Filter for all secrets with an embarassment score of 5 or greater
  //HINT: You need to provide a query parameter of apiKey in the request.
  const score = 7;
  

     try {
      const response = await axios.get((API_URL + "/filter?score="+score+"&apiKey="+yourAPIKey),
     
      );
        
        
    
    console.log(response.data);
    res.render("index.ejs", {content: JSON.stringify(response.data)});
  }
  catch (error) {
    console.log("Error");
      res.status(404).send(error.message);
  }
});

app.get("/bearerToken", async (req, res) => {
  //TODO 5: Write your code here to hit up the /secrets/{id} endpoint
  //and get the secret with id of 42
  //HINT: This is how you can use axios to do bearer token auth:
  // https://stackoverflow.com/a/52645402
  /*
  axios.get(URL, {
    headers: { 
      Authorization: `Bearer <YOUR TOKEN HERE>` 
    },
  });
  */
  
     try {
      const response = await axios.get((API_URL + "/secrets/42"),
        {
          headers: {
            Authorization: `Bearer ${yourBearerToken}`
          }
        }
      );
        
        
    
    console.log(response.data);
    res.render("index.ejs", {content: JSON.stringify(response.data)});
  }
  catch (error) {
    console.log("Error");
      res.status(404).send(error.message);
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
