// // Listen for messages
chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
  if (msg.entity) {
      console.log('msg.entity', msg.entity);

      //mock data for when we figure out the string matching process
      const testData = [{
        field: 'c_someField',
        value: 'some random text'
      }]
      sendResponse(testData);
  }
});
