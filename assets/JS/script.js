var playerNum = 1;
var theplayerName = "lebron james";

//wikipedia search player
async function getWikiExtract(nameA){
    console.log(nameA);
    //Actual API call
    async function getResponse(){
        var theresponse = await axios.get("https://en.wikipedia.org/w/api.php?action=query&format=json&formatversion=2&prop=extracts&titles=" + nameA[0] + "%20" + nameA[1] + "&exintro=1&explaintext=1&origin=*");
        return theresponse.data.query.pages[0].extract;
    }
    try {
        const result_1 = await getResponse();
        console.log("result1= " + result_1);
        return result_1;
    } catch (error) {
        console.log("There has been an error: " + error);
        return null;
    }
}

//unfinished
function nameFixer(name) {
    var nameA = name.toString().split(" ");
    if(nameA.length < 2){alert("names must be 2 words")}
    nameA[0] = nameA[0].charAt(0).toUpperCase() + nameA[0].slice(1);
    nameA[1] = nameA[1].charAt(0).toUpperCase() + nameA[1].slice(1);
    if(nameA[0] === "Lebron"){nameA[0] = "LeBron";}
    if (nameA.length > 2) { alert("Must be less than 3.") }
    return nameA;
}
var nameA = nameFixer(theplayerName);
console.log(getWikiExtract(nameA));