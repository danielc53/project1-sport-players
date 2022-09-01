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
var Player1ClearButton = document.querySelector("#player1ClearButton");
var Player2ClearButton = document.querySelector("#player2ClearButton");


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
    openModal(error);
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
    openModal(error);
    return null;
  }
}

async function getPlayerInfo(playerID) {
  try{
    var theresponse = await axios.get("https://www.balldontlie.io/api/v1/players/" + playerID);
  } catch(error) {
    openModal(error);
    return null;
  }
  return theresponse.data;
}

//not used currently
async function fetchFirst100Games(playerID) {
  try {
    var theresponse = await axios.get("https://www.balldontlie.io/api/v1/stats?per_page=100&player_ids[]=" + playerID)
    return theresponse;
  } catch {
    openModal(error);
    return null;
  }
  
}


async function fetchSelectedSeasonAverages(playerID, season) {
  try {
    var seasonAverages = await axios.get("https://www.balldontlie.io/api/v1/season_averages?season=" + season + "&player_ids[]=" + playerID);
    return seasonAverages;
    
  } catch(error) {
    openModal("There was an error fetching the season averages. Error: " + error);
    return null;
  }
}
//Places players in search boxes (unless only 1 player was returned from search)
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
      selectSeason(this.id,playerNum);
    });
  }
  searchBox.style.display = "inline-block";
}
  async function selectSeason (playerID, playerNum) {
    var playerData = await getPlayerInfo(playerID);
    var seasonNum = 2021;
    if (playerNum === 1) {
      var loadSeasonsB = document.querySelector("#player1dropdownB");
    }
    else {
      var loadSeasonsB = document.querySelector("#player2dropdownB");
    }
  //Makes dropdown list to select season averages
  loadSeasonsB.style.display = "inline-block";  
  var dropdownBox = document.createElement("select");
  dropdownBox.setAttribute("selected",seasonNum);
  dropdownBox.setAttribute("id","player" + playerNum + "options");
  for (i=2021; i>1978; i--) {
    var options = document.createElement("option");
    options.setAttribute("value", i);
    options.innerHTML = i;
    dropdownBox.appendChild(options);
  }
  loadSeasonsB.after(dropdownBox);
  loadSeasonsB.addEventListener("click", function(){
    if (playerNum === 1) {
      dropdownBox.remove()
      loadSeasonsB.style.display = "none";
      handlePlayerSelect(playerID, 1, dropdownBox.value);
    }
    else {
      dropdownBox.remove()
      loadSeasonsB.style.display = "none";
      handlePlayerSelect(playerID, 2, dropdownBox.value);
    }
    
  })
  }


//TODO: fetch images from local json maybe
async function handlePlayerSelect(playerID, playerNum, seasonNum) {
  var seasonStats = await fetchSelectedSeasonAverages(playerID, seasonNum);
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

  if (seasonStats.data.data.length > 0){
    rebounds.innerHTML = seasonStats.data.data[0].reb + " rpg.";
    assist.innerHTML = seasonStats.data.data[0].ast + " apg.";
    steals.innerHTML = seasonStats.data.data[0].stl + " spg.";
    points.innerHTML = seasonStats.data.data[0].pts + " ppg.";

    stats.appendChild(points); 
    stats.appendChild(rebounds);
    stats.appendChild(assist);
    stats.appendChild(steals);

    playerNameEl.innerHTML = playerInfo.first_name + " " + playerInfo.last_name;
    wikiExtractEl.innerHTML = wikiExtract;
    teamNameEl.innerHTML = playerInfo.team.name;

    contentBox.appendChild(playerNameEl);
    contentBox.appendChild(teamNameEl);

    stats.style.display = "block";
    teamNameEl.style.display = "block";
    playerNameEl.style.display = "inline-block";
    wikiExtractEl.style.display = "inline-block";
  }
  else{
    openModal("There are no recorded games for Player " + playerNum + " during the " + seasonNum + " season.");
  }
}

function openModal(modalText) {
  var modal = document.querySelector("#modal");
  var close = document.querySelector("#closeModal");
  var modalTextEl = document.querySelector("#modalText");
  modalTextEl.textContent = modalText;
  modal.style.display = "block";
  close.addEventListener("click", function(){
    modal.style.display = "none"
  })
  window.addEventListener("click", function(event) {
    if(event.target == modal) {
      modal.style.display = "none";
    }
  })
}


  homeBtn.addEventListener("click", function () { location.reload() });

  player1SearchButton.addEventListener("click", async function () {
  var wikiBio1 = document.getElementById("wiki-bio1");
  var playerName1Input = document.querySelector("#player-name");
  var player1SearchResults = document.querySelector("#player1searchResults");
  var stats = document.querySelector("#stats");
  player1SearchButton.style.display = "none";
  player1SearchResults.style.display = "block";

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
    selectSeason(searchResults[0].id, 1);
  }
  else if (searchResults.length > 1) {
    searchArea(searchResults, 1);
  }
  else {
    openModal("This player could not be found. Please check spelling and try again.");
  }
});

player2SearchButton.addEventListener("click", async function () {
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
    selectSeason(await searchResults[0].id, 2);
  }
  else if (searchResults.length > 1){
    searchArea(searchResults, 2);
  }
  else {
    openModal("This player could not be found. Please check spelling and try again.");
  }
});