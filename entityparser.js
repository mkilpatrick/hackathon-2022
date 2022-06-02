
class entityparser {
	constructor(response) {
		this.response = response
	}

	getFields = () => {
		const mappings = {}

		// assume for now that there is only one matching entity
		const entities = this.response.response.entities[0]

		function getFieldsHelper (jsonObject, jsonPath) {
			const paths = []
			for (var key in jsonObject) {
				if (typeof jsonObject.key === "object") {
					paths.concat(getFieldsHelper(jsonObject.key, jsonPath + "/" + key))
				} else {
					paths.push([jsonPath, jsonObject.key])
				}
			}
			return paths
		}

		return getFieldsHelper(entities, "")
	}
}

fetch('https://liveapi.yext.com/v2/accounts/me/entities?api_key=3edb77b89b2361b2bc0b4cb6c79ab134&v=20220602&filter=%7B%22websiteUrl.url%22%3A%20%7B%22%24eq%22%3A%20%22http%3A%2F%2Fbroomhallbrothers.com%22%7D%7D')
  .then(response => response.json())
  .then(data => {
  	const temp = new entityparser(data)
  	console.log(temp.getFields())
});

