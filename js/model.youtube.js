// Your use of the YouTube API must comply with the Terms of Service:
// https://developers.google.com/youtube/terms

// Helper function to display JavaScript value on HTML page.
var OAUTH2_CLIENT_ID = '448772845154-ks3qesatc7etutn5hopbdepbs1q5v2ik.apps.googleusercontent.com';
var OAUTH2_SCOPES = [
  'https://www.googleapis.com/auth/youtube'
];

//Call Api
// After the API loads, call a function to enable the search box.
function handleAPILoaded() {
  $.attr('disabled', false);
}

// Search for a specified string.
function search() {
  var q = $.val();
  var request = gapi.client.youtube.search.list({
    q: q,
    part: 'snippet'
  });

  request.execute(function(response) {
    var str = JSON.stringify(response.result);
    console.log(str);
  });
}





function getResponse(response) {
    var responseString = JSON.stringify(response, '', 2);
}

// Called automatically when JavaScript client library is loaded.
function onClientLoad() {
    gapi.client.load('youtube', 'v3', onYouTubeApiLoad);
}

// Called automatically when YouTube API interface is loaded (see line 9).
function onYouTubeApiLoad() {
    // This API key is intended for use only in this lesson.
    // See http://goo.gl/PdPA1 to get a key for your own applications.
    gapi.client.setApiKey('AIzaSyAnKiqjbrJRs8j6qzRPlgilMc236Ypautw');

    search(x);
}
 
// function search(input) {
//     // Use the JavaScript client library to create a search.list() API call.
//     var request = gapi.client.youtube.search.list({
//         part: 'snippet',
//         q: input,
//     });
    
//     // Send the request to the API server,
//     // and invoke onSearchRepsonse() with the response.
//     request.execute(onSearchResponse);
// }

// Called automatically with the response of the YouTube API request.
function onSearchResponse(response) {
    showResponse(response);
}

function displayResult(response){
    var title = response.title;
    var videoId = response.resourceId.videoId
    $.append(title, videoId);
    console.log(title, videoId)
    getResponse(response);
}