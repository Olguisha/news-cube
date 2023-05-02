import { initializeApp } from "https://www.gstatic.com/firebasejs/9.13.0/firebase-app.js";
import {
  collection,
  doc,
  getDocs,
  getDoc,
  getFirestore,
  getCountFromServer,
  query,
  where,
  setDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "https://www.gstatic.com/firebasejs/9.13.0/firebase-firestore.js";
import {
  getAuth,
  signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/9.13.0/firebase-auth.js";
import {
  getStorage,
  ref,
  getDownloadURL,
} from "https://www.gstatic.com/firebasejs/9.13.0/firebase-storage.js";

var startButton = document.getElementById("start"); // creating startButton variable and connecting to Firebase database
var columns = document.getElementsByClassName("column"); // getting elements from html
var keyTerm = "";
let articles = [];
var guardianURL =
  "https://content.guardianapis.com/search?api-key=GUARDIANAPIKEY=breaking&show-fields=thumbnail,trailText&show-blocks=all&page-size=1";

var GNewsApiKey = "THE GNEWS API KEY";

var dataList = new Array(6);
// [{"headline":"", "description": "", "body content": ""}]
// dataList[0]["headline"]

// Import the functions you need from the SDKs you need

const firebaseConfig = {
  apiKey: "THE API KEY",
  authDomain: "esp-tester-c4a0c.firebaseapp.com",
  projectId: "esp-tester-c4a0c",
  storageBucket: "esp-tester-c4a0c.appspot.com",
  messagingSenderId: "196496990452",
  appId: "1:196496990452:web:c69b8d1e3c22cce76bfea1",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage();
const auth = getAuth();

async function writeToDataBase(input_value) {
  console.log("the input value is: ", input_value);
  // console.log("the current data is: ", current_data);
  const valRef = doc(db, "newscube", "newscube_data");
  await updateDoc(valRef, {
    article1: arrayUnion(input_value),
    // article1: input_value,
  });

  // var tag_input = document.getElementById("tag");
  // tag_input.value = "";
}

startButton.onclick = () => {
  // below is what happens when button is clicked (all the steps it goes through)

  // initialProcess();
  twoStepCall();
};

// };

function callAPI(api, url) {
  if (api == "guardian") {
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        // Access the articles array in the response
        const articles = data.response.results;

        // Loop through the articles and extract the information you need
        articles.forEach((article) => {
          const headline = article.webTitle;
          const thumbnailUrl = article.fields.thumbnail;
          const trailText = article.fields.trailText;
          const articleUrl = article.webUrl;

          // Do something with the extracted information
          console.log(headline);
          console.log(thumbnailUrl);
          console.log(trailText);
          console.log(articleUrl);
          columns[0].innerHTML = "";
          columns[0].innerHTML += "<h1>" + headline + "</h1>";
          columns[0].innerHTML += "<br>" + "<p>" + trailText + "</p>";
          keyTerm = headline;
        });
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }
}

function twoStepCall() {
    // search APIs to get versions of article
  
  // call guardian - check for data - add it to array if its available

    // "https://content.guardianapis.com/search?api-key=GUARDIANAPIKEY=breaking&show-fields=thumbnail,trailText&show-blocks=all&page-size=1";
  var guardianURL =  "https://content.guardianapis.com/search?&page-size=10&api-key=GUARDIANAPIKEY";
  var numArticles = 10;
  fetch(guardianURL)
    .then((response) => response.json())
    .then((data) => {
    console.log(data)
    var articles = data.response.results;
    console.log(articles);
      // for (let i = 0; i < articles.length; i++) {
    
            // get article search term
            var searchTerm = articles[1]["webTitle"];
            console.log("the search term is: ", searchTerm);

            // call NYT - check for for data - add it to array if its available

            // call GNews - check for for data - add it to array if its available
        var textArray = searchTerm.split(" ");
        var searchTermFormatted = "";
        for(let i=0; i< textArray.length-5; i++){
          searchTermFormatted += textArray[i] + "%20"
        }
        searchTermFormatted += textArray[textArray.length-1] + "%22";
    console.log("search term is: ", searchTermFormatted);
        var GNewsUrl ="https://gnews.io/api/v4/search?q=%22" + searchTermFormatted + "&apikey=" + GNewsApiKey;
        fetch(GNewsUrl)
        .then(function (response) {
          return response.json();
        })
        .then(function (data) {
          console.log("the GNews Data is: ", data)
          var GNewsArticles = data.articles;
          console.log("the GNews articles are: ", GNewsArticles);

        });
        
          // }
    
//       var GNewsUrl =
//         "https://gnews.io/api/v4/top-headlines?category=" +
//         category +
//         "&lang=en&country=us&max=6&apikey=" +
//         GNewsApiKey; //structure of the url, I changed max from 10 to 6

//       fetch(GNewsUrl)
//         .then(function (response) {
//           return response.json();
//         })
//         .then(function (data) {
//           articles = data.articles;

//           console.log(articles);
//           for (let i = 0; i < columns.length; i++) {
//             // write content to website
//             columns[i].innerHTML = "";
//             columns[i].innerHTML += "<h1>" + articles[i]["title"] + "</h1>";
//             columns[i].innerHTML +=
//               "<br>" + "<p>" + articles[i]["description"] + "</p>";
//             // write content database
//             writeToDataBase(articles[i]["description"]);
//           }
//         });
    });

  // populate database

  // populate website
}

function initialProcess() {
  fetch(GNewsUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      articles = data.articles;
      console.log(articles);
      for (let i = 0; i < columns.length; i++) {
        // write content to website
        columns[i].innerHTML = "";
        columns[i].innerHTML += "<h1>" + articles[i]["title"] + "</h1>";
        columns[i].innerHTML +=
          "<br>" + "<p>" + articles[i]["description"] + "</p>";
        // write content database
        writeToDataBase(articles[i]["description"]);
      }
      // console.log(i)

      //     for (let i = 0; i < articles.length; i++) { //for loop is used to fetch news articles from the API and store them in the database
      //       // articles[i].title
      //       // console.log("Title: " + articles[i]['title']);
      //       // articles[i].description
      //       // console.log("Description: " + articles[i]['description']);
      //       console.log(articles);
      //       writeToDataBase(articles[i]['description'])
      //       // You can replace {property} below with any of the article properties returned by the API.
      //       // articles[i].{property}
      //       // console.log(articles[i]['{property}']);

      //       // Delete this line to display all the articles returned by the request. Currently only the first article is displayed.
      //       // break;
      //     }
    });
  // callAPI("guardian", guardianURL)
}
