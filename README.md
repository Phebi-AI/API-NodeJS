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
| ------------- | ------------- | ------------- | ------------- | ------------- |
| files | string array | Ids of the files that should be returned. | Optional | null
| transcription | boolean | Specifies if the transcription should be returned. | Optional | false
| translation | boolean | Specifies if the translation should be returned. | Optional | false
| emotions | boolean | Specifies if the emotion values should be returned. | Optional | false

Retrieve all files of the project without any transcription, translation or emotion values (fastest).
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

Retrieve transcription, translation and emotion values for a specific subset of data.
```
// Build the url to the api endpoint.
// Call the api with the request url.
request.post(url, {
    headers: accessTokenHeader, form: {
        transcription: true,
        translation: true,
        emotions: true,
        files: file_ids
    }
}).then((response) => {
    response = JSON.parse(response);

    var transcription = response[0].Transcription.map(segment => segment.Text).join(" ");
    console.log(transcription);
});
```

### "upload/{project_name}"

This method is to upload a file to a new or existing project.

Form Fields
| Field  | Type  | Description | Required | Default value |
| ------------- | ------------- | ------------- | ------------- | ------------- |
| file | file | The file to be uploaded | Required | -
| respondent | string | Set the respondent or file name | Optional | Name of file uploaded
| language | integer | Set the LCID language of the file (https://docs.microsoft.com/en-us/openspecs/office_standards/ms-oe376/6c085406-a698-4e12-9d4d-c3b0ee3dbc4a) | Optional | 1033
| transcription | boolean | Specifies if the transcription should be processed immediately. Avoid if multiple files are being uploaded. | Optional | false
| translation | boolean | Specifies if the translation should be processed immediately. Avoid if multiple files are being uploaded. | Optional | false
| diarization | boolean | Specifies if the transcription should include speaker diarization. | Optional | false
| emotions | boolean | Specifies if the emotions should be processed immediately. Avoid if multiple files are being uploaded. | Optional | false

```
var url = [
    "https://",
    host,
    "/api/upload/",
    encodeURIComponent(project)
].join("");

var req = request.post(url, { headers: accessTokenHeader }, function (err, resp, body) {
    console.log(body);
});
var form = req.form();
form.append("transcription", "true");
form.append('file', fs.createReadStream(fileName));
```
