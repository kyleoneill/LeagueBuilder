const { Sequelize, DataTypes } = require("sequelize");
const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: "builds.sqlite"
});

const Champion = sequelize.define("Champion", {
    champName: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    winRate: {
        type: DataTypes.NUMBER,
        allowNull: true
    },
    pickRate: {
        type: DataTypes.NUMBER,
        allowNull: true
    },
    banRate: {
        type: DataTypes.NUMBER,
        allowNull: true
    }
});

const Runes = sequelize.define("Runes", {
    runeChampionName: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    runePrimary: {
        type: DataTypes.STRING,
        allowNull: true
    },
    runeSecondary: {
        type: DataTypes.STRING,
        allowNull: true
    },
    runeTertiary: {
        type: DataTypes.STRING,
        allowNull: true
    }
});

const Counters = sequelize.define("Counters", {
    counterChampionName: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    badAgainst: {
        type: DataTypes.STRING,
        allowNull: true
    },
    goodAgainst: {
        type: DataTypes.STRING,
        allowNull: true
    },
});

const Items = sequelize.define("Items", {
    itemChampionName: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    startingItems: {
        type: DataTypes.STRING,
        allowNull: true
    },
    mythicCore: {
        type: DataTypes.STRING,
        allowNull: true
    },
    fourthItem: {
        type: DataTypes.STRING,
        allowNull: true
    },
    fifthItem: {
        type: DataTypes.STRING,
        allowNull: true
    },
    sixthItem: {
        type: DataTypes.STRING,
        allowNull: true
    },
});

sequelize.sync().then(() => {
    console.log("Database ready");
});

module.exports = {
    Champion,
    Runes,
    Counters,
    Items
}