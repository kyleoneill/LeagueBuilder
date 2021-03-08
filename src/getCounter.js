const { getCounterDocument } = require("./getRequests");
const { Counters } = require("./database");

function getWinRates(arr, doc, selector) {
    let winRateContainer = doc.querySelector(selector);
    for(let i = 0; i < winRateContainer.children.length - 1; i++) {
        let child = winRateContainer.children[i];
        let name = child.querySelector(".champion-name").textContent;
        let rate = child.querySelector(".win-rate").textContent.slice(0, 2);
        let nameRate = name + rate;
        arr.push(nameRate);
    }
}

async function getChampionCounter(championName, rank) {
    const doc = await getCounterDocument(championName, rank);
    let goodAgainst = [];
    let badAgainst = [];
    getWinRates(goodAgainst, doc, ".best-win-rate");
    getWinRates(badAgainst, doc, ".worst-win-rate");
    await Counters.create({
        counterChampionName: championName,
        badAgainst: badAgainst.join('&'),
        goodAgainst: goodAgainst.join('&')
    });
}

module.exports = {
    getChampionCounter
}