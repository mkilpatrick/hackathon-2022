const findAndReplaceDOMText = require('findAndReplaceDOMText');

// Listen for messages
chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
  if (msg.entity) {
    Object.entries(msg.entity).forEach(([key, val]) => {
      let node = document.createElement('span');
      node.style.outlineStyle = 'solid';
      node.style.position = 'relative';

      let tooltipNode = document.createElement('span');
      tooltipNode.innerText = val;
      tooltipNode.style.position = 'absolute';
      tooltipNode.style.zIndex = '1';
      tooltipNode.style.top = '-20px';
      tooltipNode.style.left = '-20px';
      tooltipNode.style.backgroundColor = 'black';
      tooltipNode.style.color = 'white';
      tooltipNode.style.width = 'auto';
      tooltipNode.style.height = 'auto';
      tooltipNode.style.fontSize = '12px';
      tooltipNode.style.fontWeight = 'bold';
      tooltipNode.style.padding = '2px 3px';

      node.appendChild(tooltipNode);

      findAndReplaceDOMText(document.body, {
        find: key,
        wrap: node,
        wrapClass: 'yextfield'
      });      
    });
  }
});
