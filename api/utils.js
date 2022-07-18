//
// Function definitions zone
//

function extractValueFromCookie (cookies, server) {
   let indexSeparator = "";
   let cookieValue = "";
   let cookieName = server.cookieSessionName;

   // console.log ('cookies from extractValueFromCookie : ', cookies);
   if (!cookies)  return cookieValue;
   let arr = cookies.split(';');

   arr.forEach ((el) => {
      if (el.match (cookieName)) {
         el = el.trim();
         indexSeparator = el.indexOf('=');
         el = el.slice(indexSeparator + 1);
         cookieValue = el;
         // console.log ('cookie ', cookieName, ' = ', el);
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

   return userId;
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
   mapToString
};
