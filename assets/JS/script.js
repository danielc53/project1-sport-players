//vvv unused currently vvv
var playerArray = [];
//vvv for testing getWikiExtract() vvv
var theplayerName = ["Lebron", "James"];
var wikiText;
//^^^ Above are test variables.^^^
//vvv Below are probably final variables.vvv
var player1SearchButton = document.querySelector("#player1SearchButton");
var player2SearchButton = document.querySelector("#player2SearchButton");
var playerName1Input = document.querySelector("#player-name");
var playerName2Input = document.querySelector("#player-name2");
var player1SearchResults = document.querySelector("#player1searchResults");
var player1SearchResults = document.querySelector("#player2searchResults");

//wikipedia search player
async function getWikiExtract(nameA) {
  async function getResponse() {
    var theresponse = await axios.get(
      "https://en.wikipedia.org/w/api.php?action=query&format=json&formatversion=2&prop=extracts&titles=" +
        nameA[0] +
        "%20" +
        nameA[1] +
        "&exintro=1&explaintext=1&origin=*"
    );
    return theresponse.data.query.pages[0].extract;
  }
  try {
    var result_1 = await getResponse();
    return result_1;
  } catch (error) {
    console.log("There has been an error: " + error);
    return null;
  }
}

//Player search.
async function fetchSearchedPlayerName(searchTerm) {
  console.log(searchTerm);
  async function getResponse() {
    var theresponse = await axios.get(
      "https://www.balldontlie.io/api/v1/players?search=" + searchTerm
    );
    return theresponse.data.data;
  }
  try {
    var result_2 = await getResponse();
    return result_2;
  } catch (error) {
    console.log("There has been an error: " + error);
    return null;
  }
}
//Places players in search boxes (unless only 1 player was returned from search) <- still have to do that part
function searchArea(searchArray, playerNum) {
  if (playerNum === 1) {
    player1SearchButton.style.display = "none";
    var searchBox = document.querySelector("#player1searchResults");
  } else {
    var searchBox = document.querySelector("#player2searchResults");
    player2SearchButton.style.display = "none";
  }
  for (i = 0; i < searchArray.length; i++) {
    var searchResults = document.createElement("p");
    var buttons = document.createElement("button");
    searchBox.appendChild(searchResults);
    searchResults.textContent =
      searchArray[i].first_name + " " + searchArray[i].last_name;
    searchResults.appendChild(buttons);
    buttons.textContent = "Select";
    buttons.setAttribute("id", '"' + searchArray[i].id + '"');
    buttons.addEventListener("click", function () {
      searchBox.innerHTML = "";
      console.log(this.id + " was clicked");
    });
  }
  searchBox.style.display = "inline-block";
  var clearButton = document.createElement("button");
  searchBox.insertBefore(clearButton, searchBox.firstChild);
  clearButton.textContent = "Clear Search";
  clearButton.addEventListener("click", function () {
    searchBox.innerHTML = "";
    if (playerNum === 1) {
      player1SearchButton.style.display = "block";
    }
    if (playerNum === 2) {
      player2SearchButton.style.display = "block";
    }
  });
}

player1SearchButton.addEventListener("click", async function () {
  //    console.log(playerName1Input.value.toString());
  searchArea(
    await fetchSearchedPlayerName(playerName1Input.value.toString()),
    1
  );
});
player2SearchButton.addEventListener("click", async function () {
  searchArea(
    await fetchSearchedPlayerName(playerName2Input.value.toString()),
    2
  );
});

// //these are just for testing.
// async function dothething() {
//     var wikiText = await getWikiExtract(theplayerName);
//     console.log(wikiText);
// }
// dothething();
