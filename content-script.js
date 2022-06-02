// chrome.runtime.onMessage.addListener(
//   function(request, sender, sendResponse) {
//     if (request.greeting === "fetchData") {
//       sendResponse('hi');
//     }
//   }
// );

// // Listen for messages
chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
  // If the received message has the expected format...
  if (msg.entity) {
      console.log('msg.entity', msg.entity);
      sendResponse('res?');
  }
});

// alert(document);
console.log('document', document);