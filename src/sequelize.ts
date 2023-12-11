import { DataTypes, Sequelize } from "sequelize"

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./db.sqlite",
})

const FreeGame = sequelize.define('freeGame', {
  id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
  },
  name: {
      type: DataTypes.STRING,
  },
  description: {
    type: DataTypes.STRING,
  },
  image: {
    type: DataTypes.STRING,
  },
}, {
  timestamps: false,
});

const OfficialGame = sequelize.define('officialGame', {
  id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
  },
  name: {
      type: DataTypes.STRING,
      allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  image: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  prix: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
}, {
  timestamps: false,
});

const User = sequelize.define('User', {
  id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
  },
  username:{
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
      type: DataTypes.STRING,
      allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}
, {
  timestamps: false,
});

const BlackList = sequelize.define('BlackList', {
  jwtToken: {
      type: DataTypes.STRING,
  },
}
, {
  timestamps: false,
});

sequelize
  //.sync({ force: true })
  .sync()
  export { sequelize, FreeGame, OfficialGame, User,BlackList };