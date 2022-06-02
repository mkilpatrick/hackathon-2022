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
  const mappings = {}

  // ignore non-string values
  function getFieldsHelper (jsonObject, jsonPath, mapping) {
    for (var key in jsonObject) {
      const value = jsonObject[key]
      if (value instanceof Array) {
        // console.log("I am array")
        // for (var item in value) {
        //  mapping[item] = jsonPath + "/" + key
        // }
      } else if (typeof value === 'string' || value instanceof String) {
        mapping[value] = (jsonPath + "." + key).substring(1)
      } else if (value instanceof Object) {
        getFieldsHelper(value, jsonPath + "." + key, mapping)
      }
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
        console.log(parseResponse(entityData));
        document.getElementById("apiResponse").innerHTML = entityData;
        chrome.tabs.sendMessage(activeTab.id, { entity: entityData }, function(response) {
          console.log(response);
        });
      } else {
        document.getElementById("apiResponse").innerHTML = "Not Live API results";
      }
  });
}



class entityparser {
  constructor(response) {
    this.response = response
  }

  getFields = () => {
    const mappings = {}

    // assume for now that there is only one matching entity
    const entities = this.response.response.entities[0]

    // ignore non-string values
    function getFieldsHelper (jsonObject, jsonPath, mapping) {
      for (var key in jsonObject) {
        const value = jsonObject[key]
        if (value instanceof Array) {
          // console.log("I am array")
          // for (var item in value) {
          //  mapping[item] = jsonPath + "/" + key
          // }
        } else if (typeof value === 'string' || value instanceof String) {
          mapping[value] = (jsonPath + "." + key).substring(1)
        } else if (value instanceof Object) {
          getFieldsHelper(value, jsonPath + "." + key, mapping)
        }
      }
    }

    const mapping = {}
    getFieldsHelper(entities, "", mapping)

    return mapping
  }
}

fetch('https://liveapi.yext.com/v2/accounts/me/entities?api_key=3edb77b89b2361b2bc0b4cb6c79ab134&v=20220602&filter=%7B%22websiteUrl.url%22%3A%20%7B%22%24eq%22%3A%20%22http%3A%2F%2Fbroomhallbrothers.com%22%7D%7D')
  .then(response => response.json())
  .then(data => {
    const temp = new entityparser(data)
    console.log(temp.getFields())
});

