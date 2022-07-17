//
// Function definitions zone
//

function extractValueFromCookie (cookies, cookieName) {
   let indexSeparator = "";
   let cookieValue = "";

   console.log ('cookies from extractValueFromCookie : ', cookies);
   if (!cookies)  return cookieValue;
   let arr = cookies.split(';');

   arr.forEach ((el) => {
      if (el.match (cookieName)) {
         el = el.trim();
         indexSeparator = el.indexOf('=');
         el = el.slice(indexSeparator + 1);
         cookieValue = el;
         console.log ('cookie ', cookieName, ' = ', el);
      }
   });
   return cookieValue;
}

function setCookieIfNotFound (cookieValue, res) {
   if (!cookieValue) {
      let options = { expires: new Date(Date.now() + 99999999) };
      res.cookie (cookieName, currentUserId.toString(), options);
      cookieValue = currentUserId;
      currentUserId++;
   }

   return cookieValue;
}

module.exports = {
   extractValueFromCookie,
   setCookieIfNotFound
};
