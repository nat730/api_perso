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
  },
  description: {
    type: DataTypes.STRING,
  },
  image: {
    type: DataTypes.STRING,
  },
  prix: {
    type: DataTypes.FLOAT,
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
  email: {
      type: DataTypes.STRING,
  },
  password: {
    type: DataTypes.STRING,
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