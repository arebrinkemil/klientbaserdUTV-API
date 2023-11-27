const API_KEY = "AIzaSyBGoaAhnmGXO2mLUevU1VWGo8FGFiTjabQ "; //youtube

let apiKey = "7d0aa209496930d33c0dff82ce1ef7ab"; //lastfm
let limit = 128;
let LastFmUrl = `https://ws.audioscrobbler.com/2.0/?method=chart.gettopartists&api_key=${apiKey}&limit=${limit}&format=json`;

fetch(LastFmUrl)
  .then((response) => response.json())
  .then((data) => {
    console.log("Top Artists:", data.artists.artist);
    processArtists(data.artists.artist);
  })
  .catch((error) => console.error("Error:", error));

// ... Existing code for fetching top artists ...

async function processArtists(artists) {
  let artistVideos = [];

  for (let artist of artists) {
    let videos = await searchMusicVideos(artist.name + " music video");
    let topVideos = await getTopThreeVideos(videos);
    artistVideos.push({ artist: artist.name, videos: topVideos });
  }

  return artistVideos;
}

async function searchMusicVideos(query) {
  let response = await fetch(
    `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
      query
    )}&type=video&maxResults=10&key=${API_KEY}`
  );
  let data = await response.json();
  return data.items.map((item) => item.id.videoId).join(",");
}

async function getTopThreeVideos(videoIds) {
  let response = await fetch(
    `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&id=${videoIds}&key=${API_KEY}`
  );
  let data = await response.json();

  let sortedVideos = data.items.sort(
    (a, b) => b.statistics.viewCount - a.statistics.viewCount
  );

  return sortedVideos.slice(0, 3);
}

// ... Code for fetching top artists ...

fetch(LastFmUrl)
  .then((response) => response.json())
  .then((data) => {
    console.log("Top Artists:", data.artists.artist);
    return processArtists(data.artists.artist);
  })
  .then((artistVideos) => {
    console.log("Artist Videos:", artistVideos);
    // Now artistVideos contains each artist with their top 3 videos
  })
  .catch((error) => console.error("Error:", error));

// function displayVideos(videos) {
//   const container = document.getElementById("video-container");
//   container.innerHTML = ""; // Clear previous results

//   videos.forEach((video) => {
//     console.log(video);
//     const videoId = video.id;
//     const iframe = document.createElement("iframe");
//     iframe.src = `https://www.youtube.com/embed/${videoId}`;
//     iframe.width = "560";
//     iframe.height = "315";
//     iframe.frameBorder = "0";
//     iframe.allow =
//       "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
//     iframe.allowFullscreen = true;

//     container.appendChild(iframe);
//   });
// }
