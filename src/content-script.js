const findAndReplaceDOMText = require('findAndReplaceDOMText');

// Listen for messages
chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
  const style = document.createElement('style');
  
  style.textContent = `
    .yextfield {
      position: relative;
      display: inline-block;
      border-bottom: 1px dotted black; /* If you want dots under the hoverable text */
    }
    .yextfield .tooltipText {
      visibility: hidden;
      width: 120px;
      background-color: black;
      color: #fff;
      text-align: center;
      padding: 5px 0;
      border-radius: 6px;

      position: absolute;
      z-index: 1;
    }
    .yextfield:hover .tooltipText {
      visibility: visible;
    }
  `;
  document.head.appendChild(style);

  if (msg.entity) {
    Object.entries(msg.entity).forEach(([key, val]) => {
      let node = document.createElement('span');
      node.className = 'tooltip';

      let tooltipNode = document.createElement('span');
      tooltipNode.innerText = val;
      tooltipNode.style.top = '-20px';
      tooltipNode.style.left = '-20px';
      tooltipNode.style.width = 'auto';
      tooltipNode.style.height = 'auto';
      tooltipNode.style.fontSize = '12px';
      tooltipNode.style.fontWeight = 'bold';
      tooltipNode.style.padding = '2px 3px';
      tooltipNode.className = 'tooltipText'

      node.appendChild(tooltipNode);

      findAndReplaceDOMText(document.body, {
        find: key,
        wrap: node,
        wrapClass: 'yextfield'
      }); 
      
    });
  }
  sendResponse('done');
});
