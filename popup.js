let liveApiKeyDiv = document.getElementById("liveApiKey");

chrome.storage.sync.get("liveApiKey", ({ liveApiKey }) => {
  liveApiKeyDiv.innerHTML = "Using liveApiKey: " + liveApiKey;
});

window.onload = function() {
  queryLiveApi();
}

function getStorageData(key) {
  return new Promise((resolve) => {
    chrome.storage.sync.get(key, resolve);
  });
}

function getActiveTab() {
  return new Promise((resolve) => {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      resolve(tabs[0]);
    });
  });
}

/**
 * Queries LiveApi to get the data of an entity based on the current url.
 */
const queryLiveApi = async() => {
  const { liveApiKey } =  await getStorageData("liveApiKey");
  let activeTab = await getActiveTab();
  let url = activeTab.url;

  const filter = encodeURIComponent(`{"websiteUrl.url": {"$eq": "${url}"}}`);
  const queryUrl = `https://liveapi.yext.com/v2/accounts/me/entities?api_key=${liveApiKey}&v=20220602&filter=${filter}`;

  await fetch(queryUrl)
    .then(response => response.json())
    .then(data => {
      if (data?.response?.count == 1) {
        entityData = JSON.stringify(data.response.entities[0]);
        document.getElementById("apiResponse").innerHTML = entityData;
        chrome.tabs.sendMessage(activeTab.id, { entity: entityData }, function(response) {
          console.log(response);
        });
      } else {
        document.getElementById("apiResponse").innerHTML = "Not Live API results";
      }
  });
}
