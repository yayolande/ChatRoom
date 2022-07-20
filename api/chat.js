
var fs = require ('fs');
var path = require ('path');
var express = require ('express');
var { extractValueFromCookie, setCookieNewUser, setNewChatUser, linkNameToMessages, mapToString } = require ('./utils');

var app = express();
app.use (express.json());

// let names = ['GreatSayaMan', 'CrocoPops', 'Ben', 'Rambo', 'Mr. Beans', 'SamSam', 'Kyron'];
// let poolNames = new Set();
const cookieInitialValue = 1000;
let serverInitialConfig = {
   currentUserId: cookieInitialValue,
   cookieSessionName: 'sessionId',
   names: ['GreatSayaMan', 'CrocoPops', 'Ben', 'Rambo', 'Mr. Beans', 'SamSam', 'Kyron'],
   poolOfUsedNames: new Set(),
   userNameIdTable: new Map()
};

const cookieName = serverInitialConfig.cookieSessionName;
let currentUserId = serverInitialConfig.currentUserId;
let messages = [];

app.get ('/', (req, res) => {
   let cookies = req.get ('Cookie');

   let cookieValueSessionId = extractValueFromCookie (req.get('cookie'), serverInitialConfig.cookieName);
   if (!cookieValueSessionId)
      cookieValueSessionId = setNewChatUser (serverInitialConfig, res);

   // This little shinanigan is to make filesystem robust 
   // To "node" execution path, since "." is not relative to current file
   // But to "node" execution path in terminal, which can mess up complex
   // Configuration in "package.json"
   let relativePath = '../public/index.htm';
   let pathToHtmlFile = path.normalize (`${__dirname}/${relativePath}`);
   let file = fs.readFileSync(pathToHtmlFile, 'utf-8');

   res.status(200);
   res.send (file);
});

app.get ('/api/messages', (req, res) => {
   let mappedMessages = linkNameToMessages (messages, serverInitialConfig.userNameIdTable);

   res.status(200).send(mappedMessages);
});

app.post ('/api/messages', (req, res) => {
   console.log ('=======================================');
   let body = req.body;
   let cookieValueSessionId = extractValueFromCookie (req.get('cookie'), serverInitialConfig.cookieName);
   if (!cookieValueSessionId)
      cookieValueSessionId = setNewChatUser (serverInitialConfig, res);

   // console.log (`Value of the cookie sent => req.cookies : ${req.cookies}`);

   // console.log ('req.body : ', body);
   if (!!body && body.message) {
      messages.push ({ 'userId': cookieValueSessionId, 'message': body.message });
   }

   let mappedMessages = linkNameToMessages (messages, serverInitialConfig.userNameIdTable);
   
   console.log (`all user Id & Name : ${mapToString (serverInitialConfig.userNameIdTable)}`);
   console.log (`all the names already used (poolUsedname) : ${mapToString(serverInitialConfig.poolOfUsedNames)}`);
   console.log ('=======================================');
   res.status(200).send(mappedMessages);
});

app.get ('/api/names', (req, res) => {
   res.status(200).send (Object.fromEntries (serverInitialConfig.userNameIdTable));
});

// app.post ('/api/names', (req, res) => {
// });

app.put ('/api/names', (req, res) => {
   let sessionId = extractValueFromCookie (req.get('cookie'), serverInitialConfig.cookieName);
   let userName = req.body.message;
   let sessionIdNameTable = serverInitialConfig.userNameIdTable;
   let poolUsedNames = serverInitialConfig.poolOfUsedNames;
   sessionId = parseInt(sessionId);

   let nameToDelete = sessionIdNameTable.get (sessionId);
   console.log ('Name to delete is : ' + nameToDelete);

   if (nameToDelete) {
      sessionIdNameTable.set (sessionId, userName);
      poolUsedNames.add (userName);
      poolUsedNames.delete (nameToDelete);

      // res.status(200).send(Object.fromEntries (sessionIdNameTable));
      res.status(204).send();
      return ;
   }

   res.status(400).send();
});


const port = process.env.PORT || 2200;
app.listen (port, () => {
   console.log ('listening to port ', port);
});

