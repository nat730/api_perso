import express, { Request, Response } from 'express';
import { sequelize, FreeGame, OfficialGame, User, BlackList } from './sequelize';
import authenticationMiddleware from './middleware_jws'
import bodyParser from 'body-parser';
import cors from 'cors';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

const app = express();
const port = 3000;
const saltRounds = 10;
app.use(bodyParser.json());
app.use(cors());

app.post('/api/freegames', async (req: Request, res: Response) => {
  try {
    const { name, description, image } = req.body;
    const newFreeGame = await FreeGame.create({ name, description, image });
    res.json(newFreeGame);
  } catch (error) {
    console.error('Erreur lors de la création d\'un jeu gratuit :', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

app.get('/api/freegames', async (req: Request, res: Response) => {
  try {
    const freeGames = await FreeGame.findAll();
    res.json(freeGames);
  } catch (error) {
    console.error('Erreur lors de la récupération des jeux gratuits :', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

app.get('/api/freegames/:id', async (req: Request, res: Response) => {
  try {
    const gameId = req.params.id;
    const freeGameById = await FreeGame.findByPk(gameId);
    res.json(freeGameById);
  } catch (error) {
    console.error('Erreur lors de la récupération du jeu gratuit par ID :', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

app.put('/api/freegames/:id', async (req, res) => {
  try {
    const { name, description, image } = req.body;
    const gameId = req.params.id;
    const freeGameById = await FreeGame.findByPk(gameId);
    if(freeGameById){
      await freeGameById.update({ name, description, image })
      res.status(200).json({ message: 'Le jeu gratuit a été modifié' });
    }
    else {

    }
  } catch (error) {
    console.error('Erreur lors de la modification du jeu gratuit par ID :', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
})

app.delete('/api/freegames/:id', async (req, res) => {
  try {
    const gameId = req.params.id;
    const freeGameById = await FreeGame.findByPk(gameId);
    if (freeGameById) {
      await freeGameById.destroy()
    }
    res.status(200).json({ message: 'Le jeu gratuit a été supprimé' });
  } catch (error) {
    console.error('Erreur lors de la suppression du jeu gratuit par ID :', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

// @ts-ignore
app.post('/api/officialgames', authenticationMiddleware, async (req: Request, res: Response) => {
  try {
    const { name, description, image,prix } = req.body.data;
    const newFreeGame = await OfficialGame.create({ name, description, image, prix });
    res.json(newFreeGame);
  } catch (error) {
    console.error('Erreur lors de la création d\'un jeu gratuit :', error);
    res.status(500).json({ message: 'Erreur interne du serveur' });
  }
});

// @ts-ignore
app.get('/api/officialgames', authenticationMiddleware, async (req: Request, res: Response) => {
  try {
    const freeGames = await OfficialGame.findAll();
    res.json(freeGames);
  } catch (error) {
    console.error('Erreur lors de la récupération des jeux gratuits :', error);
    res.status(500).json({ message: 'Erreur interne du serveur' });
  }
});

// @ts-ignore
app.get('/api/officialgames/:id', authenticationMiddleware, async (req: Request, res: Response) => {
  try {
    const gameId = req.params.id;
    const freeGameById = await OfficialGame.findByPk(gameId);
    res.json(freeGameById);
  } catch (error) {
    console.error('Erreur lors de la récupération du jeu gratuit par ID :', error);
    res.status(500).json({ message: 'Erreur interne du serveur' });
  }
});

// @ts-ignore
app.put('/api/officialgames/:id', authenticationMiddleware, async (req, res) => {
  try {
    const { name, description, image } = req.body;
    const gameId = req.params.id;
    const officialGameById = await OfficialGame.findByPk(gameId);
    await OfficialGame.update(
      { name, description, image }, {
      where: { id: officialGameById }
    })
    res.status(200).json({ error: 'Le jeu gratuit a été modifié' });
  } catch (error) {
    console.error('Erreur lors de la modification du jeu gratuit par ID :', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
})

// @ts-ignore
app.delete('/api/officialgames/:id', authenticationMiddleware, async (req, res) => {
  try {
    const gameId = req.params.id;
    const officialGameById = await OfficialGame.findByPk(gameId);
    await OfficialGame.destroy({
      where: { id: officialGameById }
    })
    res.status(200).json({ error: 'Le jeu gratuit a été supprimé' });
  } catch (error) {
    console.error('Erreur lors de la suppression du jeu gratuit par ID :', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

app.post('/api/auth/local/register', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ error: 'Cet utilisateur existe déjà' });
    }
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const newUser = await User.create({
      email,
      password: hashedPassword,
    });
    const result = newUser.dataValues
    delete result.password
  } catch (error) {
    console.error('Erreur lors de l\'inscription :', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

app.post('/api/auth/local', async (req: Request, res: Response) => {
  try {
    const { identifier, password } = req.body;
    const user = await User.findOne({ where: { email: identifier } });
    if (!user) {
      return res.status(401).json({ error: 'Identifiants invalides' });
    }
    //@ts-ignore
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Identifiants invalides' });
    }
    //@ts-ignore
    const jwtToken = jwt.sign({uuid: uuidv4(), userId: user.id },'secret',{ expiresIn: '1h' });
        res.status(200).json({ message: 'Connexion réussie', jwtToken });
  } catch (error) {
    console.error('Erreur lors de la connexion :', error);
    res.status(500).json({ message: 'Erreur interne du serveur', error: error });
  }
});

//@ts-ignore
app.post('/api/auth/local/logout', authenticationMiddleware, async (req, res) => {
  try {
    const tokenToBlacklist = req.headers.authorization;
    if (!tokenToBlacklist) {
      return res.status(401).json({ error: 'Token manquant. Authentification requise.' });
    }
    const [bearer, token] = tokenToBlacklist.split(' ');

    if (bearer !== 'Bearer' || !token) {
      return res.status(401).json({ error: 'Format de token incorrect. Authentification requise.' });
    }
    if (!tokenToBlacklist) {
      return res.status(400).json({ error: 'Token not found. Unable to blacklist.' });
    }
    if (bearer !== 'Bearer' || !token) {
      return res.status(401).json({ error: 'Format de token incorrect. Authentification requise.' });
    }
    await BlackList.create({ JwtToken: token });
    res.status(200).json({ error: 'Logout successful' });
  } catch (error) {
    console.error('Error during logout:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/users/me',authenticationMiddleware, async (req: Request, res: Response) => {
  res.json(req.user);
});

//@ts-ignore
app.put('/api/user/password', authenticationMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = req.body.id;
    const { currentPassword, password,passwordConfirmation } = req.body;
    
    if (password !== passwordConfirmation) {
      return res.status(400).json({ error: 'mot de passee differents' });
    }
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé.' });
    }
    //@ts-ignore
    const passwordMatch = await bcrypt.compare(currentPassword, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Mot de passe actuel incorrect.' });
    }

    const hashedNewPassword = await bcrypt.hash(password, 10);
    await user.update({ password: hashedNewPassword });

    res.json({ message: 'Mot de passe modifié avec succès.' });
  } catch (error) {
    console.error('Erreur lors de la modification du mot de passe :', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});
//@ts-ignore
app.get('/api/user/me', authenticationMiddleware, (req, res) => {
  const userInfo = {
    id: req.body.id,
  };
  res.status(200).json(userInfo);
});

sequelize
  .sync()
  .then(() => {
    console.log('Synchronization successful.');
  })
  .catch((error) => {
    console.error('Synchronization error:', error);
  });

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});