const spriteSheet = require("../spriteMap.json");
const { getBuildDocument } = require("./getRequests");
const {
    Champion,
    Runes,
    Items
} = require("./database");

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

function mapItemName(style, itemMap) {
    let index = 0;
    if(style.backgroundImage.includes("item1.png")) {
        index += 100;
    }
    else if(style.backgroundImage.includes("item2.png")) {
        index += 200;
    }
    let split = style.backgroundPosition.split(' ');
    let x = Math.abs(parseInt(split[0].slice(0, -2)));
    let y = Math.abs(parseInt(split[1].slice(0, -2)));
    index += x / 48;
    index += (y / 48) * 10;
    return itemMap[index];
}

// TODO - make this DRY
async function saveRuneTable(doc, championName) {
    let runesPrimary = [];
    let runesSecondary = [];
    let runesTertiary = [];

    let runeContainer = doc.querySelector(".rune-trees-container-2.media-query_MOBILE_LARGE__DESKTOP_LARGE");
    let primaryContainer = runeContainer.children[0];
    let secondaryTertiaryContainer = runeContainer.children[1];
    let secondaryContainer = secondaryTertiaryContainer.children[0];
    let tertiaryContainer = secondaryTertiaryContainer.children[2];

    let primaryRuneName = primaryContainer.querySelector(".perk-style-title").textContent;
    runesPrimary.push(primaryRuneName);
    let activePrimaryPerks = primaryContainer.querySelectorAll(".perk-active > img");
    activePrimaryPerks.forEach(activePerk => {
        let cleanedName = cleanPerkName(activePerk.alt);
        runesPrimary.push(cleanedName);
    });

    runesSecondary.push(secondaryContainer.querySelector(".perk-style-title").textContent);
    let activeSecondaryPerks = secondaryContainer.querySelectorAll(".perk-active > img");
    activeSecondaryPerks.forEach(activePerk => {
        let cleanedName = cleanPerkName(activePerk.alt);
        runesSecondary.push(cleanedName);
    });

    let activeTertiaryPerks = tertiaryContainer.querySelectorAll(".shard-active > img");
    activeTertiaryPerks.forEach(activePerk => {
        let cleanedName = cleanPerkName(activePerk.alt)
        runesTertiary.push(cleanedName);
    });

    await Runes.create({
        runeChampionName: championName,
        runePrimary: runesPrimary.join('&'),
        runeSecondary: runesSecondary.join('&'),
        runeTertiary: runesTertiary.join('&')
    });
}

function populateItemArr(arr, itemsContainer, selector, itemMap) {
    let images = itemsContainer.querySelectorAll(selector);
    images.forEach(itemContainer => {
        let itemName = mapItemName(itemContainer.style, itemMap);
        arr.push(itemName);
    });
}

async function saveItemTable(doc, championName, itemMap) {
    let starting = [];
    let mythic = [];
    let fourth = [];
    let fifth = [];
    let sixth = [];

    let itemsContainer = doc.querySelector(".recommended-build_items.media-query_DESKTOP_MEDIUM__DESKTOP_LARGE");
    populateItemArr(starting, itemsContainer, ".starting-items .item-img > div > div", itemMap);
    populateItemArr(mythic, itemsContainer, ".core-items .item-img > div > div", itemMap);
    populateItemArr(fourth, itemsContainer, ".item-options-1 .item-img > div > div", itemMap);
    populateItemArr(fifth, itemsContainer, ".item-options-2 .item-img > div > div", itemMap);
    populateItemArr(sixth, itemsContainer, ".item-options-3 .item-img > div > div", itemMap);
    await Items.create({
        itemChampionName: championName,
        startingItems: starting.join('&'),
        mythicCore: mythic.join('&'),
        fourthItem: fourth.join('&'),
        fifthItem: fifth.join('&'),
        sixthItem: sixth.join('&')
    });
}

async function saveChampionTable(doc, championName) {
    let rankingSection = doc.querySelector(".champion-ranking-stats");
    let winRate = parseFloat(rankingSection.querySelector(".win-rate > div").textContent.slice(0, -1));
    let pickRate = parseFloat(rankingSection.querySelector(".pick-rate > div").textContent.slice(0, -1));
    let banRate = parseFloat(rankingSection.querySelector(".ban-rate > div").textContent.slice(0, -1));
    await Champion.create({
        champName: championName,
        winRate: winRate,
        pickRate: pickRate,
        banRate: banRate
    });
}

async function getChampionBuild(championName, rank, itemMap) {
    const doc = await getBuildDocument(championName, rank);

    await saveChampionTable(doc, championName);
    await saveRuneTable(doc, championName);
    await saveItemTable(doc, championName, itemMap);
}

module.exports = {
    getChampionBuild
}