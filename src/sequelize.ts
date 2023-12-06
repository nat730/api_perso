import { DataTypes, Model, Sequelize } from "sequelize"

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./db.sqlite",
})

const freeGame = sequelize.define('freeGame', {
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

const officialGame = sequelize.define('officialGame', {
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

const blackList = sequelize.define('BlackList', {
  JwtToken: {
      type: DataTypes.STRING,
  },
}
, {
  timestamps: false,
});

sequelize
  //.sync({ force: true })
  .sync()
  export { sequelize, freeGame, officialGame, User,blackList };