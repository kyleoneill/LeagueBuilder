const { getChampionBuild } = require("./getBuild");
const { getChampionCounter } = require("./getCounter");
const dataDragon = require("../champion.json");
const ddItems = require("../item.json");

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

function mapItemsToIndex() {
    var index = [];
    for(const key in ddItems.data) {
        index.push(ddItems.data[key].name);
    }
    return index;
}

async function main() {
    //these should be arguments or something
    let rank = "overall";
    let getBuild = false;
    let getCounter = true;

    const ddLength = Object.keys(dataDragon.data).length;
    let index = 0;
    let itemMap = mapItemsToIndex();
    for (const key in dataDragon.data) {
        let champion = dataDragon.data[key].id.toLowerCase();
        if(champion === "monkeyking") {
            champion = "wukong";
        }
        if(getBuild) {
            await getChampionBuild(champion, rank, itemMap);
        }
        if(getCounter) {
            await getChampionCounter(champion, rank);
        }
        index++;
        console.clear();
        console.log(`Finished ${index} of ${ddLength} champions`);
        await sleep(1000);
    }
}

main().then(() => {
    console.log("Finished writing build information");
});

//I need tests for the export that checks build info for _every champion_

//I need some sort of updater so I don't need to manually run this