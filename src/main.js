let players = null; //state
if("fetch" in window){
    fetch("https://api.npoint.io/20c1afef1661881ddc9c", {method : "GET"})
    .then(res => res.json())
    .then(data => {
        players = data.playerList.map(({
        Id,
        PFName,
        TName,
        SkillDesc,
        Value,
        CCode,
        UpComingMatchesList
    }) => ({
        Id,
        PFName,
        TName,
        SkillDesc,
        Value,
        CCode,
        UpComingMatchesList
    }));
    return players;
}).then(players => buildHTMLString(players))
}

else{
    alert("IE is not supported and I have forgotten about making API calls with XMLHttpRequest");
}

function buildHTMLString(players){
   const HTMLString =  players.sort((player1, player2) => player1.Value - player2.Value).map(player => `
    <div class="card">
                <img src = "./images/player-images/${player.Id}.jpg" alt = "${player.Id}"/>
                <p>Name : ${player.PFName || ""}</p>
                <p>Team : ${player.TName || ""}</p>
                <p>Skill : ${player.SkillDesc || ""}</p>
                <p>Value : $ ${player.Value || ""}</p>
                <p>Upcoming matches : ${player.UpComingMatchesList[0].CCode || ""} vs ${player.UpComingMatchesList[0].VsCCode || ""}</p>
                <p>Match Date : ${player.UpComingMatchesList[0].MDate ? new Date(player.UpComingMatchesList[0].MDate).toLocaleString() : ""}</p>
    </div>`).join("");
    document.querySelector(".container").innerHTML = HTMLString;
}

function searchPlayers(inputString) {
    let matchedPlayers = [];
    if(players === null) return;
    if(inputString.trim() === "") matchedPlayers = [...players];
    else{
    const searchString = inputString.trim().toLowerCase();
    matchedPlayers = players.filter(player => player.TName.toLowerCase().includes(searchString) || 
    player.PFName.toLowerCase().includes(searchString));
    }
    buildHTMLString(matchedPlayers);
}

document.forms[0].addEventListener("submit", e => {
    e.preventDefault();
    searchPlayers(document.querySelector("#search").value);
})

document.querySelector("#search").addEventListener("input", debounce(searchPlayers, 800))

function debounce(searchPlayers, delay = 800) {
    let timerId = null;
    return function(e){
        if(timerId)
            clearTimeout(timerId);

        timerId = setTimeout(() => {
            searchPlayers(e.target.value);
        }, delay)
    }
}