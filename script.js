const PAT = "361aae960c1b4484abb067137d07462c";
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
    .then((result) => {
      const resultArray = result.outputs[0].data.concepts.slice(0, 5);
      let resultArrayNames = resultArray.map((item) => item.name);
      handleClarifaiResponse(resultArrayNames);
    })
    .catch((error) => console.log("error", error));
}

function relatedSearch(term) {
  const PAT = "361aae960c1b4484abb067137d07462c";
  const USER_ID = "openai";
  const APP_ID = "chat-completion";

  const MODEL_ID = "GPT-4";
  const MODEL_VERSION_ID = "5d7a50b44aec4a01a9c492c5a5fcf387";
  const RELATED_SEARCH =
    "can you give me 5 related terms for the term " +
    term +
    ". give them in a javascript array format with no comments";
  const NO_SEARCH =
    "give me 5 trending news categories. give them in a javascript array format with no comments";

  if (term == "") {
    var RAW_TEXT = NO_SEARCH;
  } else {
    var RAW_TEXT = RELATED_SEARCH;
  }

  const raw = JSON.stringify({
    user_app_id: {
      user_id: USER_ID,
      app_id: APP_ID,
    },
    inputs: [
      {
        data: {
          text: {
            raw: RAW_TEXT,
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
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      if (data.status.code != 10000) console.log(data.status);
      else gptResponse = data["outputs"][0]["data"]["text"]["raw"];
      let gptArray = JSON.parse(gptResponse);
      handleClarifaiResponse(gptArray);
    })
    .catch((error) => console.log("error", error));
}

function handleClarifaiResponse(concepts) {
  const buttonsContainer = document.getElementById(
    "clarifai-buttons-container"
  );
  buttonsContainer.innerHTML = ""; // rens

  concepts.forEach((concept) => {
    const button = document.createElement("button");
    button.textContent = concept;
    button.onclick = () => fetchNews(concept);
    buttonsContainer.appendChild(button);
  });
}

function fetchNews(searchTerm) {
  const apiKey = "d168f91151c24337b5662161b355bcbc"; // apikey
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
  newsContainer.innerHTML = ""; // rensar

  articles.forEach((article) => {
    const elem = document.createElement("div");
    elem.className = "article";

    let imageHtml = article.urlToImage
      ? `<img class="article-image" src="${article.urlToImage}" alt="Article Image">`
      : "";

    const breadText = document.createElement("div");
    breadText.className = "article-bread-text";
    breadText.innerHTML = `
      <h3 class="article-title">${article.title}</h3>
      <p class="article-description">${article.description}</p>
      <a class="article-link" href="${article.url}" target="_blank">Read more</a>
    `;

    elem.innerHTML = `${imageHtml}<p class="article-date">${article.publishedAt}</p>`;
    elem.appendChild(breadText);
    newsContainer.appendChild(elem);
  });
}

/* <p class="article-content">${article.content}</p>

<figure class="snip1347">
  <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/331810/sample87.jpg" alt="sample87" />
  <div class="date">September 14th, 2015</div>
  <figcaption>
    <h2>The world ended yesterday</h2>
    <p>I'm looking for something that can deliver a 50-pound payload of snow on a small feminine target. Can you suggest something? Hello...? </p>
    <a href="#" class="read-more">Read More</a>
  </figcaption>
</figure> */
