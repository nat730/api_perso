import express, { Request, Response } from 'express';
import { sequelize, freeGame, officialGame } from './sequelize';
import bodyParser from 'body-parser';
import cors from 'cors';

const app = express();
const port = 3000;

app.use(express.json());
app.use(bodyParser.json());
app.use(cors());

app.get('/api/freeGames', async (req: Request, res: Response) => {
  try {
    const games = await freeGame.findAll();
    res.json(games);
  } catch (error) {
    console.error('Error fetching free games:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/officialGames', async (req: Request, res: Response) => {
  try {
    const games = await officialGame.findAll();
    res.json(games);
  } catch (error) {
    console.error('Error fetching official games:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/api/freeGames', async (req: Request, res: Response) => {
  try {
    const { name, description, image } = req.body;
    const newFreeGame = await freeGame.create({ name, description, image });
    res.json(newFreeGame);
  } catch (error) {
    console.error('Erreur lors de la création d\'un jeu gratuit :', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

app.get('/api/freeGames', async (req: Request, res: Response) => {
  try {
    const freeGames = await freeGame.findAll();
    res.json(freeGames);
  } catch (error) {
    console.error('Erreur lors de la récupération des jeux gratuits :', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

app.get('/api/freeGames/:id', async (req: Request, res: Response) => {
  try {
    const gameId = req.params.id;
    const freeGameById = await freeGame.findByPk(gameId);
    res.json(freeGameById);
  } catch (error) {
    console.error('Erreur lors de la récupération du jeu gratuit par ID :', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

sequelize
  .sync({ force: true })
  .then(() => {
    console.log('Synchronization successful.');

    freeGame.create({
      name: 'Free Game 1',
      description: 'Description of Free Game 1',
      image: 'url_for_image_1',
    });

    officialGame.create({
      name: 'Official Game 1',
      description: 'Description of Official Game 1',
      image: 'url_for_image_2',
      prix: 19.99,
    });
  })
  .catch((error) => {
    console.error('Synchronization error:', error);
  });

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
