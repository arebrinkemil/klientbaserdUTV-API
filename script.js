const API_KEY = "AIzaSyBGoaAhnmGXO2mLUevU1VWGo8FGFiTjabQ ";

function searchChannel() {
  var channelName = document.getElementById("query").value;

  fetch(
    `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${channelName}&type=channel&key=${API_KEY}`
  )
    .then((response) => response.json())
    .then((data) => {
      if (data.items.length > 0) {
        const channelId = data.items[0].id.channelId;
        getChannelUploadsPlaylistId(channelId);
      } else {
        console.log("Channel not found");
      }
    })
    .catch((error) => {
      console.log(error);
    });
}

function getChannelUploadsPlaylistId(channelId) {
  fetch(
    `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${channelId}&key=${API_KEY}`
  )
    .then((response) => response.json())
    .then((data) => {
      const uploadsPlaylistId =
        data.items[0].contentDetails.relatedPlaylists.uploads;
      getTopVideos(uploadsPlaylistId);
    })
    .catch((error) => console.log(error));
}

function getTopVideos(playlistId) {
  fetch(
    `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${playlistId}&maxResults=50&key=${API_KEY}`
  )
    .then((response) => response.json())
    .then((data) => {
      // Fetching details for each video to sort by view count
      const videoIds = data.items
        .map((item) => item.snippet.resourceId.videoId)
        .join(",");
      fetchVideoDetailsAndSort(videoIds);
    })
    .catch((error) => console.log(error));
}

function fetchVideoDetailsAndSort(videoIds) {
  fetch(
    `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&id=${videoIds}&key=${API_KEY}`
  )
    .then((response) => response.json())
    .then((data) => {
      // Sorting videos by view count
      const sortedVideos = data.items.sort(
        (a, b) => b.statistics.viewCount - a.statistics.viewCount
      );
      displayVideos(sortedVideos.slice(0, 10)); // Displaying top 10 videos
    })
    .catch((error) => console.log(error));
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