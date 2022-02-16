# Phebi API (NodeJS)

The Phebi API is to enable 3rd party Applications access to Phebi's emotion analysis and transcription services.

The API can load files, run processes and extract transcription, translation and emotions of processed or existing data files.

## Authentication

You always need to send the Subscription Key provided to you by Phebi in the request headers. If no Subscription key or an invalid key was provided the server will return a 403 Forbidden error. The server will also return a 403 Forbidden error when the provided subscription key does not have access to the requested project or resource.

```
var subscriptionKey = "b97076b5-faf4-4c66-8123-1deb12db9817";

const accessTokenHeader = {
    "Subscription": subscriptionKey
};
```

## Methods

There are various methods available to retrieve data from Phebi, add new data to an existing project or modify data like transcription or translation.

### "/files/{project_name}"

This method will return all data entries (files).

Form Fields
| Field  | Type  | Description | Required | Default value |
| ------------- | ------------- |
| files | string array | Ids of the files that should be returned | Optional | null
| transcription | boolean | Specifies if the transcription should be returned | Optional | false
| translation | boolean | Specifies if the translation should be returned | Optional | false
| emotions | boolean | Specifies if the emotion values should be returned | Optional | false

```
// Build the url to the api endpoint.
var url = [
    "https://",
    host,
    "/api/files/",
    encodeURIComponent(project)
].join("");

// Call the api with the request url.
request.get(url, { headers: accessTokenHeader }).then((response) => {
    response = JSON.parse(response);

    console.log([response.length, "files loaded."].join(" "));
});
```
