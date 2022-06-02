let liveApiKeyDiv = document.getElementById("liveApiKey");

chrome.storage.sync.get("liveApiKey", ({ liveApiKey }) => {
  liveApiKeyDiv.innerHTML = "Using liveApiKey: " + liveApiKey;
});

// When the button is clicked, inject setPageBackgroundColor into current page
liveApiKeyDiv.addEventListener("click", async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: queryLiveApi,
  });
});

/**
 * Queries LiveApi to get the data of an entity based on the current url.
 */
function queryLiveApi() {
  chrome.storage.sync.get("liveApiKey", ({ liveApiKey }) => {
    const path = window.location.pathname;


  });
}
