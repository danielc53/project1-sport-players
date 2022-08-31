//vvv unused currently vvv
var playerArray = [];
//vvv for testing getWikiExtract() vvv
var theplayerName = ["Lebron", "James"];
var wikiText;
//^^^ Above are test variables.^^^
//vvv Below are probably final variables.vvv
var player1SearchButton = document.querySelector("#player1SearchButton");
var player2SearchButton = document.querySelector("#player2SearchButton");
var homeBtn = document.querySelector("#home-btn");


//wikipedia search player
async function fetchWikiExtract(firstName, lastName) {
  async function getResponse() {
    var theresponse = await axios.get(
      "https://en.wikipedia.org/w/api.php?action=query&format=json&formatversion=2&prop=extracts&titles=" +
      firstName +
      "%20" +
      lastName +
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
    buttons.setAttribute("class", "spacing")
    buttons.addEventListener("click", function () {
      searchBox.innerHTML = "";
      handlePlayerSelect(this.id,playerNum);
    });
  }
  searchBox.style.display = "inline-block";
}


//TODO: fetch images from local json maybe
async function handlePlayerSelect(playerID, playerNum) {
  var seasonStats = await fetchSelectedSeasonAverages(playerID, "2021");
  //console.log(seasonStats);
   var playerInfo = await getPlayerInfo(playerID);
   if(playerNum === 1){ 
    var contentBox = document.querySelector("#player1searchResults");
    var wikiExtractEl = document.querySelector("#wiki-bio1");
    var stats = document.querySelector("#stats");
   }
   else {
    var contentBox =document.querySelector("#player2searchResults");
    var wikiExtractEl = document.querySelector("#wiki-bio2");
    var stats = document.querySelector("#stats2");
  }
   var wikiExtract = await fetchWikiExtract(playerInfo.first_name, playerInfo.last_name);
   if (wikiExtract.length === 0) {
    wikiExtract = "There is currently no bio available for this player."
  }
   var teamNameEl = document.createElement("h2")
   var playerNameEl = document.createElement("h2");
   var points = document.createElement("p");
   var rebounds = document.createElement("p");
   var assist = document.createElement("p");
   var steals = document.createElement("p");

   rebounds.innerHTML = seasonStats.data.data[0].reb + " rpg.";
   assist.innerHTML = seasonStats.data.data[0].ast + " apg.";
   steals.innerHTML = seasonStats.data.data[0].stl + " spg.";
   points.innerHTML = seasonStats.data.data[0].pts + " ppg.";
   playerNameEl.innerHTML = playerInfo.first_name + " " + playerInfo.last_name;
   wikiExtractEl.innerHTML = wikiExtract;
   teamNameEl.innerHTML = playerInfo.team.name;
   stats.appendChild(points); 
   stats.appendChild(rebounds);
   stats.appendChild(assist);
   stats.appendChild(steals);
   contentBox.appendChild(playerNameEl);
   contentBox.appendChild(teamNameEl);
   stats.style.display = "block";
   teamNameEl.style.display = "block";
   playerNameEl.style.display = "inline-block";
   wikiExtractEl.style.display = "inline-block";
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


async function fetchSelectedSeasonAverages(playerID, season) {
  try {
    var seasonAverages = await axios.get("https://www.balldontlie.io/api/v1/season_averages?season=" + season + "&player_ids[]=" + playerID);
    return seasonAverages;
    
  } catch {
    console.log("There has been an error: " + error);
    return null;
  }
}


  homeBtn.addEventListener("click", function () { location.reload() });

  player1SearchButton.addEventListener("click", async function () {
  var wikiBio1 = document.getElementById("wiki-bio1");
  var playerName1Input = document.querySelector("#player-name");
  var player1SearchResults = document.querySelector("#player1searchResults");
  var stats = document.querySelector("#stats");
  player1SearchButton.style.display = "none";
  player1SearchResults.style.display = "block";

  var Player1ClearButton = document.querySelector("#player1ClearButton");
  Player1ClearButton.style.display = "block";
  Player1ClearButton.addEventListener("click", function () {
      player1SearchResults.innerHTML = "";
      wikiBio1.innerHTML = "";
      stats.innerHTML = "";
      stats.style.display = "none";
      player1SearchResults.style.display = "none";
      player1SearchButton.style.display = "block";
      Player1ClearButton.style.display = "none";
    })

  var searchResults = await fetchSearchedPlayerName(playerName1Input.value.toString())
  if (searchResults.length === 1) {
    handlePlayerSelect(searchResults[0].id, 1);
  }
  else if (searchResults.length > 1) {
    searchArea(searchResults, 1);
  }
  else {
    console.log("Player Cannot be found. Please try again.");
  }
});

player2SearchButton.addEventListener("click", async function () {
  var Player2ClearButton = document.querySelector("#player2ClearButton");
  var playerName2Input = document.querySelector("#player-name2");
  var stats = document.querySelector("#stats2");
  var player2SearchResults = document.querySelector("#player2searchResults");
  var wikiBio2 = document.getElementById("wiki-bio2");
  player2SearchButton.style.display = "none";
  Player2ClearButton.style.display = "block";
  player2SearchResults.style.display = "block";
  Player2ClearButton.addEventListener("click", function () {
      player2SearchResults.innerHTML = "";
      wikiBio2.innerHTML = "";
      stats.innerHTML = "";
      stats.style.display = "none";
      player2SearchResults.style.display = "none";
      player2SearchButton.style.display = "block";
      Player2ClearButton.style.display = "none";
    })
  var searchResults = await fetchSearchedPlayerName(playerName2Input.value.toString())
  if (searchResults.length === 1) {
    handlePlayerSelect(await searchResults[0].id, 2);
  }
  else if (searchResults.length > 1){
    searchArea(searchResults, 2);
  }
  else {
    console.log("Player Cannot be found. Please try again.");
  }
});



// //these are just for testing.
// async function dothething() {
//     var wikiText = await getWikiExtract(theplayerName);
//     console.log(wikiText);
// }
// dothething();

