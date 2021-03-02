const { getChampionBuild } = require("./getBuild");
const dataDragon = require("../champion.json");
const fs = require("fs");

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

async function main() {
    const ddLength = Object.keys(dataDragon.data).length;
    let builds = [];
    for (const key in dataDragon.data) {
        let champion = dataDragon.data[key].id.toLowerCase();
        if(champion === "monkeyking") {
            champion = "wukong";
        }
        let build = await getChampionBuild(champion);
        let index = builds.push(build);
        //save to file here
        console.clear();
        console.log(`Finished ${index} of ${ddLength} champions`);
        await sleep(1000);
    }
    fs.writeFile("builds.json", JSON.stringify(builds), err => {
        if(err) {
            console.log("Failed to write output file", err);
        }
        else {
            console.log("Successfully wrote build file");
        }
    });
}

main().then(() => {
    console.log("Finished writing build json");
});

//I need tests for the export that checks build info for _every champion_

//I need some sort of updater so I don't need to manually run this