const axios = require("axios");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

async function getDocumentFromURL(url) {
    const res = await axios.default.get(url);
    const dom = new JSDOM(res.data);
    const doc = dom.window.document;
    return doc;
}

async function getBuildDocument(champion, rank) {
    const doc = await getDocumentFromURL(`https://u.gg/lol/champions/${champion}/build?rank=${rank}`);
    return doc;
}

async function getCounterDocument(champion, rank) {
    const doc = await getDocumentFromURL(`https://u.gg/lol/champions/${champion}/counter?rank=${rank}`);
    return doc; 
}

async function getLeagueVersion() {
    const res = await axios.default.get("https://ddragon.leagueoflegends.com/api/versions.json");
    let version = res.data[0];
    return version;
}

async function getChampionFile(version) {
    const res = await axios.default.get(`http://ddragon.leagueoflegends.com/cdn/${version}/data/en_US/champion.json`);
    return res.data;
}

async function getItemFile(version) {
    const res = await axios.default.get(`http://ddragon.leagueoflegends.com/cdn/${version}/data/en_US/item.json`);
    return res.data;
}

module.exports = {
    getDocumentFromURL,
    getBuildDocument,
    getCounterDocument,
    getLeagueVersion,
    getChampionFile,
    getItemFile
}