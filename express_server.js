

var express = require("express")
var app = express()
var PORT = 8080; // default port is 8080
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

//sets app up with view engine and ejs
app.set("view engine", "ejs")

var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};
// req = request sent by client
// res = response sent by us (the server)

// each of these "app.get" functions are called root handlers! :D

app.get("/urls", (req, res) => {
  let templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
  })
//the above knows to checks inside "views" folder for "urls_index", automatically looks for ejs file too!

///Important: When sending variables to an EJS template, you need to send them inside
//an object, even if you are only sending one variable. This is so you can use the key
//of that variable (in the above case the key is urls) to access the data within your
//template.

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});
//the above renders out the urls_new ejs file with the forum



app.get("/urls/:id", (req, res) => {
  let templateVars = { shorturl: req.params.id, urls: urlDatabase };
  res.render("urls_show", templateVars);
})
//above :id value in the quotations allows us to input the id in the
//browser and pull up the corrisponding website to that shortened url.

app.post("/urls", (req, res) => {
  console.log(req.body);  // debug statement to see POST parameters
  res.send("helloooooooo");         // Respond with 'Ok' (we will replace this)
});

app.get("/", (req, res) => {
  res.send("Hello!");
})

app.get("/cars", (req, res) => {
  res.send("Hello! CARS!");
})


app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
})


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
})
