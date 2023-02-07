// Require the module
var bodyParser = require("body-parser");

const cheerio = require("cheerio");
const axios = require("axios");

// Set up the Body Parser to your App
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true})); 

const cryptoPages = [
  {
    name: "Independent",
    address: "https://www.independent.co.uk/topic/cryptocurrency",
    base: "https://www.independent.co.uk",
  },
  {
    name: "BBC",
    address: "https://www.bbc.com/news",
    base: "https://www.bbc.com",
  },
  {
    name: "CNN",
    address: "https://edition.cnn.com/business",
    base: "https://edition.cnn.com",
  },
];
const cryptoNews = [];

cryptoPages.forEach((website) => {
  axios
    .get(website.address)
    .then((response) => {
      const html = response.data;
      const $ = cheerio.load(html);

      $('a:contains("crypto")', html).each(function () {
        const title = $(this).text();
        const url = $(this).attr("href");
        cryptoNews.push({
          title,
          url:
            url.includes("www") || url.includes("http")
              ? url
              : website.base + url,
        });
      });
    })
    .catch((e) => console.log(e));
});

app.get("/", (req, res) => {
  res.json("This is an API for crypto news!!");
});
app.get("/cryptonews", (req, res) => {
  res.json(cryptoNews);
});

