

var express = require("express")
var app = express()
var PORT = 8080; // default port is 8080
const bodyParser = require("body-parser");

var cookieParser = require('cookie-parser');
//sets app up with view engine and ejs
app.use(cookieParser())
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs")

var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};
// root handlers/endpoints
app.get("/urls", (req, res) => {
  let templateVars = {urls: urlDatabase, username: req.cookies['username']};
  res.render("urls_index", templateVars);
  })

app.get("/urls/new", (req, res) => {
  let templateVars = {username: req.cookies['username']}
  res.render("urls_new", templateVars);
});

app.get("/urls/:id", (req, res) => {
  let templateVars = { shorturl: req.params.id, longurl: urlDatabase[req.params.id], username: req.cookies['username']};
  res.render("urls_show", templateVars);
});

app.post("/urls/:id", (req, res) => {
  let templateVars = { shorturl: req.params.id, longurl: urlDatabase[req.params.id], username: req.cookies['username']};
  res.render("urls_show", templateVars);
});
//above :id value in the quotations allows us to input the id in the
//browser and pull up the corrisponding website to that shortened url.
//NOTE: shorturl and urls are variables that can be referenced in the urls_shows ejs file.
app.post("/urls", (req, res) => {
  RandomNumber = generateRandomString()
  urlDatabase[RandomNumber] = req.body.longURL
  res.redirect(`http://localhost:8080/urls/${RandomNumber}`);
});
//above uses values longURL from the urls_new EJS file.
//calls RandomNumber function and then creates "Random Number" key inside
//Daatbase. Then assigns req.body.longURL to that key value.
app.post("/urls/:id/edit", (req, res) => {
  urlDatabase[req.params.id] = req.body.editURL
  res.redirect(`http://localhost:8080/urls/`)
});
//redirects website
app.get("/u/:shortURL", (req, res) => {
  var tinyURL = req.params.shortURL
  var longURL = urlDatabase[tinyURL]
  res.redirect(`http://${longURL}`);
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});
//Delete
app.post("/urls/:id/delete", (req, res) => {
  let tinyURL = req.params.id
  console.log(tinyURL)
  delete urlDatabase[tinyURL];
  res.redirect("/urls");
});
// cookie inputs
app.post("/login", (req, res) => {
  console.log(req.body.username)
  res.cookie('username', req.body.username);
  res.redirect("/urls");
});
//
app.post("/logout", (req, res) => {
  res.clearCookie('username', req.body.username);
  res.redirect("/urls");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});

function generateRandomString() {
  var text = "";
  var charset = "abcdefghijklmnopqrstuvwxyz";

  for (var i = 0; i < 6; i++)
  text += charset.charAt(Math.floor(Math.random() * charset.length));
  return text;
}

