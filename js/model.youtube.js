// Your use of the YouTube API must comply with the Terms of Service:
// https://developers.google.com/youtube/terms

// Helper function to display JavaScript value on HTML page.


//Call Api
// After the API loads, call a function to enable the search box.

// Search for a specified string.
 function search(q) {
   var request = gapi.client.youtube.search.list({
     q: q,
     part: 'snippet'
   });

   request.execute(function(response) {
     var str = JSON.stringify(response.result);
     console.log(str);
   });
 }


function searchByKeyword() {
  var results = YouTube.Search.list("id,snippet", 
                   {q : "google apps script", maxResults: 25});
  
  for(var i in results.items) {
    var item = results.items[i];
    Logger.log("[%s] Title: %s", item.id.videoId, item.snippet.title);

  }
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
//     console.list(request);
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