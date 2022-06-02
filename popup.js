let liveApiKeyDiv = document.getElementById("liveApiKey");

chrome.storage.sync.get("liveApiKey", ({ liveApiKey }) => {
  liveApiKeyDiv.innerHTML = "Using liveApiKey: " + liveApiKey;
});

window.onload = function() {
  queryLiveApi();
}

/**
 * Queries LiveApi to get the data of an entity based on the current url.
 */
const queryLiveApi = () => {
  chrome.storage.sync.get("liveApiKey", async({ liveApiKey }) => {
    const path = window.location.pathname;
    const queryUrl = `https://liveapi.yext.com/v2/accounts/me/entities/1985?api_key=${liveApiKey}&v=20220602`;
    console.log(queryUrl);

    await fetch(queryUrl)
      .then(response => response.json())
      .then(data => {
        console.log(data);
      });
  });
}
