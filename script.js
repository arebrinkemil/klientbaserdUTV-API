const API_KEY = "AIzaSyBGoaAhnmGXO2mLUevU1VWGo8FGFiTjabQ ";

function search() {
  var x = document.getElementById("query").value;
  searchTerm = x;

  fetch(
    `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${searchTerm}&key=${API_KEY}`
  )
    .then((response) => response.json())
    .then((data) => {
      displayVideos(data.items);
    })
    .catch((error) => {
      console.log(error);
    });
}

function displayVideos(videos) {
  const container = document.getElementById("video-container");
  container.innerHTML = ""; // Clear previous results

  videos.forEach((video) => {
    const videoId = video.id.videoId;
    const iframe = document.createElement("iframe");
    iframe.src = `https://www.youtube.com/embed/${videoId}`;
    iframe.width = "560";
    iframe.height = "315";
    iframe.frameBorder = "0";
    iframe.allow =
      "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
    iframe.allowFullscreen = true;

    container.appendChild(iframe);
  });
}
