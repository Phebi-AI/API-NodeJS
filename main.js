const request = require('request-promise');
const fs = require('fs');

var subscriptionKey = "b97076b5-faf4-4c66-8123-1deb12db9817";
var host = "konstantin.phebi.ai";
var project = "Example";

// We need the send the subscription key in the request header.
const accessTokenHeader = {
    "Subscription": subscriptionKey
};

// Build the url to the api endpoint.
var url = [
    "https://",
    host,
    "/api/files/",
    encodeURIComponent(project)
].join("");

function GetFiles(onResponse) {
    // Call the api with the request url.
    request.get(url, { headers: accessTokenHeader }).then(onResponse);
}

function GetValues(file_ids, onResponse) {
    request.post(url, {
        headers: accessTokenHeader, form: {
            transcription: true,
            translation: true,
            emotions: true,
            files: file_ids
        }
    }).then(onResponse);
}

function UploadFile(fileName) {
    var url = [
        "https://",
        host,
        "/api/upload/",
        encodeURIComponent("API Creation Test")
    ].join("");

    var req = request.post(url, { headers: accessTokenHeader }, function (err, resp, body) {
        console.log(body);

        var response = JSON.parse(body);

        Process(response.Files)
    });
    var form = req.form();
    form.append("transcription", "false");
    form.append("emotions", "false");
    form.append('file', fs.createReadStream(fileName));
}

function Process(files) {
    var url = [
        "https://",
        host,
        "/api/process/",
        encodeURIComponent("API Creation Test")
    ].join("");

    request.post(url, {
        headers: accessTokenHeader,
        form: {
            transcription: true,
            translation: true,
            diarization: true,
            emotions: true,
            files: files
        }
    }).then(function (response) {
        console.log(response);
        response = JSON.parse(response);

        if (response.Error != null) {
            console.log(response.Error);
            return;
        }

        GetProgress(response.Id);
    });
}

function GetProgress(id) {
    var url = [
        "https://",
        host,
        "/api/process/progress/",
        encodeURIComponent(id)
    ].join("");

    request.get(url, {
        headers: accessTokenHeader
    }).then(function (response) {
        console.log(response);
    });
}

//UploadFile("test.wav");
GetFiles((response) => {
    response = JSON.parse(response);

    console.log([response.length, "files loaded."].join(" "));

    console.log("Loading full transcription & emotions for first 10 files.");

    //file_ids = response.slice(0, 10).map(item => item.Id)
    file_ids = ["e3b6a68e-9a39-41c7-b923-b837b73a7407"];

    GetValues(file_ids, (response) => {
        console.log(response);
        response = JSON.parse(response);

        var transcription = response[0].Transcription.map(segment => segment.Text).join(" ");

        console.log(transcription);
    });
});