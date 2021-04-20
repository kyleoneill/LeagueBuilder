const { getChampionBuild } = require("./getBuild");
const { getChampionCounter } = require("./getCounter");
const { 
    getLeagueVersion,
    getChampionFile,
    getItemFile
} = require("./getRequests");

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

function mapItemsToIndex(itemFile) {
    var index = [];
    for(const key in itemFile.data) {
        index.push(itemFile.data[key].name);
    }
    return index;
}

async function getData(rank, getBuild, championFile, itemFile) {
    const ddLength = Object.keys(championFile.data).length;
    let index = 0;
    for (const key in championFile.data) {
        let champion = championFile.data[key].id.toLowerCase();
        let humanReadableName = championFile.data[key].name;
        let title = championFile.data[key].title;
        if(champion === "monkeyking") {
            champion = "wukong";
        }
        if(getBuild) {
            let itemMap = mapItemsToIndex(itemFile);
            await getChampionBuild(champion, rank, itemMap, humanReadableName, title);
        }
        else {
            await getChampionCounter(champion, rank);
        }
        index++;
        console.clear();
        let type = getBuild ? "build" : "counter";
        console.log(`Finished ${index} of ${ddLength} for champion ${type} info.`);
        await sleep(1000);
    }
}

async function main() {
    //this should be an argument or something
    let rank = "overall";

    let version = await getLeagueVersion();
    let championFile = await getChampionFile(version);
    let itemFile = await getItemFile(version);

    await getData(rank, true, championFile, itemFile); //build data
    await getData(rank, false, championFile, itemFile); //counter data
}

main().then(() => {
    console.log("Finished writing build and counter information");
});

//I need tests for the export that checks build info for _every champion_