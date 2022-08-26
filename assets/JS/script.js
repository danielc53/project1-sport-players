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
var homeBtn = document.querySelector("#home-btn");
var Player1ClearButton = document.querySelector("#player1ClearButton");
var Player2ClearButton = document.querySelector("#player2ClearButton");

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
      "https://www.balldontlie.io/api/v1/players?search=" + searchTerm + "&per_page=10"
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
    var searchBox = document.querySelector("#player1searchResults");
  } else {
    var searchBox = document.querySelector("#player2searchResults");
  }
  for (i = 0; i < searchArray.length; i++) {
    var searchResults = document.createElement("p");
    var buttons = document.createElement("button");
    searchBox.appendChild(searchResults);
    searchResults.textContent =
      searchArray[i].first_name + " " + searchArray[i].last_name;
    searchResults.appendChild(buttons);
    buttons.textContent = "Select";
    buttons.setAttribute("id", searchArray[i].id);
    buttons.addEventListener("click", function () {
      searchBox.innerHTML = "";
      handlePlayerSelect(this.id,playerNum);
    });
  }
  searchBox.style.display = "inline-block";
  Player1ClearButton.addEventListener("click", function () {
    if (playerNum === 1) {
      searchBox.innerHTML = "";
      player1SearchButton.style.display = "block";
      Player1ClearButton.style.display = "none";
    }
  })

  Player2ClearButton.addEventListener("click", function () {
    if (playerNum === 2) {
      searchBox.innerHTML = "";
      player2SearchButton.style.display = "block";
      Player2ClearButton.style.display = "none";
    }})
}


//TODO: fetch images from local json maybe
async function handlePlayerSelect(playerID, playerNum) {
   var playerInfo = await getPlayerInfo(playerID);
   if(playerNum === 1){ 
    var contentBox = document.querySelector("#player1searchResults");
   }
   else {var contentBox =document.querySelector("#player2searchResults");}
   var playerNameEl = document.createElement("h2")
   contentBox.appendChild(playerNameEl);
   playerNameEl.append(playerInfo.first_name + " " + playerInfo.last_name);
}

async function getPlayerInfo(playerID) {
  var theresponse = await axios.get("https://www.balldontlie.io/api/v1/players/" + playerID);
  return theresponse.data;
}

//not used currently
async function fetchFirst100Games(playerID) {
  var theresponse = await axios.get("https://www.balldontlie.io/api/v1/stats?per_page=100&player_ids[]=" + playerID)
  console.log(theresponse)
  return theresponse;
}

//in progress
async function fetchSelectedSeasonAverages(playerID, season) {
  try {
    var seasonAverages = await axios.get("https://www.balldontlie.io/api/v1/season_averages?season=" + season + "&player_ids[]=" + playerID);
    return seasonAverages;
  } catch {
    console.log("There has been an error: " + error);
    return null;
  }
}
homeBtn.addEventListener("click", function () { location.reload() })
player1SearchButton.addEventListener("click", async function () {
  player1SearchButton.style.display = "none";
  Player1ClearButton.style.display = "block";
  searchArea(
    await fetchSearchedPlayerName(playerName1Input.value.toString()),
    1
  );
});
player2SearchButton.addEventListener("click", async function () {
  player2SearchButton.style.display = "none";
  Player2ClearButton.style.display = "block";
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
