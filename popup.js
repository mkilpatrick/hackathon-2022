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

function parseResponse(response) {
  for (var key in jsonObject) {
    const value = jsonObject[key]

    if (value instanceof Array) {
      for (let i = 0; i < value.length; i++) {
        const item = value[i]
        if (typeof item === 'string' || item instanceof String) {
          if (mapping.hasOwnProperty(item)) {
            mapping[item].push((jsonPath + "." + key).substring(1))
          } else {
            mapping[item] = [(jsonPath + "." + key).substring(1)]
          }
        } else {
          getFieldsHelper(value, jsonPath + "." + key, mapping)
        }
      }
    } else if (typeof value === 'string' || value instanceof String) {
      if (mapping.hasOwnProperty(value)) {
        mapping[value].push((jsonPath + "." + key).substring(1))
      } else {
        mapping[value] = [(jsonPath + "." + key).substring(1)]
      }

    } else if (value instanceof Object) {
      getFieldsHelper(value, jsonPath + "." + key, mapping)
    }
  }

  const mapping = {}
  getFieldsHelper(entities, "", mapping)

  return mapping
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
        chrome.tabs.sendMessage(activeTab.id, { entity: entityData }, res => {
          const parentContainer = document.getElementById("fieldsInUse");
          parentContainer.innerHTML = 'Fields in use:';
          if (Array.isArray(res) && res.length > 0) {
            res.forEach(e => {
              const fieldDiv = document.createElement('div');
              fieldDiv.innerHTML = e.field + ': ' + e.value;
              parentContainer.append(fieldDiv);
            });
          }
        });
      } else {
        document.getElementById("apiResponse").innerHTML = "Not Live API results";
      }
  });
}
