require('dotenv').config()

const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");

app.use(express.json());

let refreshToken = []

app.post('/token', (req, res) => {
  const refreshToken = req.body.token
  if (refreshToken == null) return res.sendStatus(401)
  if(!refreshToken.includes(refreshToken)) return res.sendStatus(403)
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if(err) return res.sendStatus(403)
    const accessToken = generateAccessToken({ name: user.name})
    res.json({accessToken: accessToken})
  })
})

app.delete('/logout', (req, res) => {
  refreshToken = refreshToken.filter(token => token !== req.body.token)
  res.sendStatus(204)
})

app.post("/login", (req, res) => {
  //Auth user => User Authentication Video Link

  const username = req.body.username;
  const user = { name: username };

  const accessToken = generateAccessToken(user);
  const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET)
  refreshToken.push(refreshToken)
  res.json({ accessToken: accessToken, refreshToken: refreshToken });
})

function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15s'})
}

//Middleware
// function authenticateToken(req, res, next){
//  //verify user and get request
//  const authHeader = req.headers['authorization']
//  const token = authHeader && authHeader.split(' ')[1] 
//  if (token == null) return res.sendStatus(401)

//  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
//      if (err) return res.sendStatus(403)
//      req.user = user
//      next()
//  })
// }

app.listen(4000);
