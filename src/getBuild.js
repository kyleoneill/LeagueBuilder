const axios = require("axios");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const spriteSheet = require("../spriteMap.json");

class Build {
    constructor(name, runes, items) {
        this.name = name;
        this.runes = runes;
        this.items = items;
    }
}

class Runes {
    constructor() {
        this.primary = [];
        this.secondary = [];
        this.tertiary = [];
    }
}

function cleanPerkName(nameToClean) {
    let re = new RegExp(/\s+/, 'g');
    let split = nameToClean.split(re);
    if(
        split[0].toLowerCase() == "the" &&
         (split[1].toLowerCase() == "keystone" || split[1].toLowerCase() == "rune")
    ) {
        split.splice(0, 2);
        nameToClean = split.join(' ');
    }
    return nameToClean
}

function matchItemName(backgroundImage, backgroundPosition) {
    let sheet;
    if(backgroundImage.includes("item0.png")) {
        sheet = spriteSheet["item0.png"];
    }
    else if(backgroundImage.includes("item1.png")) {
        sheet = spriteSheet["item1.png"];
    }
    else if(backgroundImage.includes("item2.png")) {
        sheet = spriteSheet["item2.png"];
    }
    else {
        return new Error("Request for a sprite sheet that is not mapped")
    }
    let item = sheet[`${backgroundPosition}`];
    return item;
}

// TODO - make this DRY
function getRunesFromDoc(doc) {
    let runes = new Runes();

    let runeContainer = doc.querySelector(".rune-trees-container-2.media-query_MOBILE_LARGE__DESKTOP_LARGE");
    let primaryContainer = runeContainer.children[0];
    let secondaryTertiaryContainer = runeContainer.children[1];
    let secondaryContainer = secondaryTertiaryContainer.children[0];
    let tertiaryContainer = secondaryTertiaryContainer.children[2];

    let primaryRuneName = primaryContainer.querySelector(".perk-style-title").textContent;
    runes.primary.push(primaryRuneName);
    let activePrimaryPerks = primaryContainer.querySelectorAll(".perk-active > img");
    activePrimaryPerks.forEach(activePerk => {
        let cleanedName = cleanPerkName(activePerk.alt);
        runes.primary.push(cleanedName);
    });

    runes.secondary.push(secondaryContainer.querySelector(".perk-style-title").textContent);
    let activeSecondaryPerks = secondaryContainer.querySelectorAll(".perk-active > img");
    activeSecondaryPerks.forEach(activePerk => {
        let cleanedName = cleanPerkName(activePerk.alt);
        runes.secondary.push(cleanedName);
    });

    let activeTertiaryPerks = tertiaryContainer.querySelectorAll(".shard-active > img");
    activeTertiaryPerks.forEach(activePerk => {
        let cleanedName = cleanPerkName(activePerk.alt)
        runes.tertiary.push(cleanedName);
    });

    return runes;
}

function getItemsFromDoc(doc) {
    let itemsContainer = doc.querySelector(".recommended-build_items.media-query_DESKTOP_MEDIUM__DESKTOP_LARGE");
    let itemImages = itemsContainer.querySelectorAll(".item-img > div > div");
    let itemNames = [];
    itemImages.forEach(itemContainer => {
        let backgroundImage = itemContainer.style.backgroundImage;
        let backgroundPosition = itemContainer.style.backgroundPosition;
        let itemName = matchItemName(backgroundImage, backgroundPosition);
        itemNames.push(itemName);
    });
    return itemNames;
}

async function getChampionBuild(championName) {
    console.log(championName);
    const res = await axios.default.get(`https://u.gg/lol/champions/${championName}/build`);
    const dom = new JSDOM(res.data);
    const doc = dom.window.document;

    const runes = getRunesFromDoc(doc);
    const items = getItemsFromDoc(doc);

    return new Build(championName, runes, items);
}

module.exports = {
    getChampionBuild
}

// https://u.gg/lol/champions/veigar/build