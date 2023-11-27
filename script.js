const API_KEY = "AIzaSyBGoaAhnmGXO2mLUevU1VWGo8FGFiTjabQ "; //youtube

let apiKey = "7d0aa209496930d33c0dff82ce1ef7ab"; //lastfm
let LastFmUrl = `https://ws.audioscrobbler.com/2.0/?method=chart.gettopartists&api_key=${apiKey}&format=json`;

fetch(LastFmUrl)
  .then((response) => response.json())
  .then((data) => {
    console.log("Top Artists:", data.artists.artist);
    artistDropDown(data.artists.artist);
  })
  .catch((error) => console.error("Error:", error));

function artistDropDown(artists) {
  let artistDropDown = document.getElementById("artistDropDown");
  for (let i = 0; i < artists.length; i++) {
    let option = document.createElement("option");
    option.value = artists[i].name;
    option.innerHTML = artists[i].name;
    artistDropDown.appendChild(option);
  }
}

document
  .getElementById("artistDropDown")
  .addEventListener("change", function () {
    var selectedValue = this.value;
    console.log(selectedValue);
    searchMusicVideos(selectedValue + " music video");
  });

function searchMusicVideos(query) {
  fetch(
    `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
      query
    )}&type=video&maxResults=10&key=${API_KEY}`
  )
    .then((response) => response.json())
    .then((data) => {
      const videoIds = data.items.map((item) => item.id.videoId).join(",");
      fetchVideoDetails(videoIds);
    })
    .catch((error) => {
      console.log(error);
    });
}

function fetchVideoDetails(videoIds) {
  fetch(
    `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&id=${videoIds}&key=${API_KEY}`
  )
    .then((response) => response.json())
    .then((data) => {
      const sortedVideos = data.items.sort(
        (a, b) => b.statistics.viewCount - a.statistics.viewCount
      );
      const slicedArray = sortedVideos.slice(0, 3);

      displayVideos(slicedArray);
    })
    .catch((error) => console.log(error));
}

function displayVideos(videos) {
  const container = document.getElementById("video-container");
  container.innerHTML = ""; // Clear previous results

  videos.forEach((video) => {
    console.log(video);
    const videoId = video.id;
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
