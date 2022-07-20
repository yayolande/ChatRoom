//
// Function definitions zone
//

function extractValueFromCookie (cookies, cookieName) {
   let indexSeparator = "";
   let cookieValue = "";

   if (!cookies)  return cookieValue;
   let arr = cookies.split(';');

   arr.forEach ((el) => {
      if (el.match (cookieName)) {
         el = el.trim();
         indexSeparator = el.indexOf('=');
         el = el.slice(indexSeparator + 1);
         cookieValue = el;
      }
   });
   return cookieValue;
}

function setCookieNewUser (server, res) {
   let options = { expires: new Date(Date.now() + 99999999) };
   let userSessionIdCookieValue = "";

   res.cookie (server.cookieSessionName, server.currentUserId.toString(), options);
   userSessionIdCookieValue = server.currentUserId;
   server.currentUserId++;

   return userSessionIdCookieValue;
}

function setNewChatUser (server, res) {
   let randomNumber = parseInt (Math.random() * server.names.length);
   let userName = server.names[randomNumber];
   const baseName = userName;
   let counter = 0;

   while (true) {
      if (server.poolOfUsedNames.has(userName)) {
         userName = baseName + `${counter * 10}`;
         counter++;
      } else {
         server.poolOfUsedNames.add (userName);
         break;
      }
   }

   let userId = setCookieNewUser (server, res);
   server.userNameIdTable.set (userId, userName);
   console.log ('init new user : ' + userId + ' --> ' + userName);

   return userId;
}

function linkNameToMessages (messages, idNameTable) {
   // let idNameTable = server.userNameIdTable;
   let mappedMessages = [];
   let name = "";

   messages.forEach ((el) => {
      name = idNameTable.get (parseInt(el.userId)) || "No Name 66";
      mappedMessages.push ({
         'userName': name,
         'message': el.message
      });
   });

   return mappedMessages;
}

function mapToString (map) {
   let str = "Map --- ";

   map.forEach((val, key) => {
      str += `${key}:${val};`;
   });

   return str;
}

module.exports = {
   extractValueFromCookie,
   setCookieNewUser,
   setNewChatUser,
   linkNameToMessages,
   mapToString
};
