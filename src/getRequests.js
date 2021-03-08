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

module.exports = {
    getDocumentFromURL,
    getBuildDocument,
    getCounterDocument
}