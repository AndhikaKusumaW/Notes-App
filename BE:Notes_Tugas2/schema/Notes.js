const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Notes = sequelize.define("Notes", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },

    judul: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    
    isi: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    
    tanggal_dibuat: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },

    }, {
      timestamps: false,
    }
);

module.exports = Notes;