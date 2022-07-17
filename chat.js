
var fs = require ('fs');
var express = require ('express');
var { extractValueFromCookie, setCookieIfNotFound } = require ('./utils');

var app = express();
app.use (express.json());

const cookieInitialValue = 1000;
const cookieName = 'sessionId';
let currentUserId = cookieInitialValue;
let messages = [];

app.get ('/', (req, res) => {
   let cookies = req.get ('Cookie');
   let cookieValue = "";

   // if cookie is empty, set a new one
   if (cookies) {
      cookieValue = extractValueFromCookie (cookies, cookieName);
   } else {
      let options = { expires: new Date(Date.now() + 999999) };
      res.cookie (cookieName, currentUserId.toString());
      currentUserId++;
   }

   let file = fs.readFileSync('./index_chat.htm', 'utf-8');
   // fs.readFile('./index_chat.htm', 'utf-8', (error, data) => {
   //    file = data;
   //    console.log (data);
   // });

   let str = `cookie value : ${cookieValue} === cookies : ${cookies}`;
   res.status(200);
   res.send (file);
});

app.get ('/api/messages', (req, res) => {
   res.status(200).send(messages);
});

app.post ('/api/messages', (req, res) => {
   let body = req.body;
   let cookieValue = extractValueFromCookie (req.get('cookie'), cookieName);
   cookieValue = setCookieIfNotFound (cookieValue, res);
   console.log (`Value of the cookie sent => req.cookies : ${req.cookies}`);

   console.log ('req.body : ', body);
   if (!!body && body.message) {
      messages.push ({ 'userId': cookieValue, 'message': body.message });
   }
   
   res.status(200).send(messages);
});

const port = process.env.PORT || 2200;
app.listen (port, () => {
   console.log ('listening to port ', port);
});

