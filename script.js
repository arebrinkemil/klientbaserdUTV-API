const PAT = "a7819e512daa4bdbaef6a5a5deb68bf3";
const USER_ID = "clarifai";
const APP_ID = "main";
const MODEL_ID = "general-image-recognition";
const MODEL_VERSION_ID = "aa7f35c01e0642fda5cf400f543e7c40";

function analyzeImage() {
  const imageInput = document.getElementById("image-input");

  if (imageInput.files.length > 0) {
    const reader = new FileReader();
    reader.onload = function () {
      const base64Image = reader.result.replace(
        /^data:image\/(.*);base64,/,
        ""
      );
      callClarifaiAPI(base64Image);
    };
    reader.readAsDataURL(imageInput.files[0]);
  }
}

function callClarifaiAPI(base64Image) {
  const raw = JSON.stringify({
    user_app_id: {
      user_id: USER_ID,
      app_id: APP_ID,
    },
    inputs: [
      {
        data: {
          image: {
            base64: base64Image,
          },
        },
      },
    ],
  });

  const requestOptions = {
    method: "POST",
    headers: {
      Accept: "application/json",
      Authorization: "Key " + PAT,
    },
    body: raw,
  };

  fetch(
    "https://api.clarifai.com/v2/models/" +
      MODEL_ID +
      "/versions/" +
      MODEL_VERSION_ID +
      "/outputs",
    requestOptions
  )
    .then((response) => response.json())
    .then((result) => handleClarifaiResponse(result))
    .catch((error) => console.log("error", error));
}

function handleClarifaiResponse(response) {
  const concepts = response.outputs[0].data.concepts;
  const buttonsContainer = document.getElementById(
    "clarifai-buttons-container"
  );
  buttonsContainer.innerHTML = ""; // Clear existing buttons

  concepts.forEach((concept) => {
    const button = document.createElement("button");
    button.textContent = concept.name;
    button.onclick = () => fetchNews(concept.name); // Fetch news when clicked
    buttonsContainer.appendChild(button);
  });
}

function fetchNews(searchTerm) {
  const apiKey = "d168f91151c24337b5662161b355bcbc"; // Replace with your actual NewsAPI key
  const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(
    searchTerm
  )}&pageSize=5&apiKey=${apiKey}`;

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      displayNews(data.articles);
    })
    .catch((error) => {
      console.error("Error fetching news:", error);
    });
}

function displayNews(articles) {
  const newsContainer = document.getElementById("news-container");
  newsContainer.innerHTML = ""; // Clear existing news

  articles.forEach((article) => {
    const elem = document.createElement("div");
    let imageHtml = article.urlToImage
      ? `<img src="${article.urlToImage}" alt="Article Image" style="width:100%;">`
      : "";
    elem.innerHTML = `
          <h3>${article.title}</h3>
          ${imageHtml}
          <p>${article.description}</p>
          <p>${article.content}</p>
          <p>${article.publishedAt}</p>
          <a href="${article.url}" target="_blank">Read more</a>
      `;
    newsContainer.appendChild(elem);
  });
}
