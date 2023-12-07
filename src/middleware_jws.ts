import jwt from 'jsonwebtoken';
import { BlackList } from './sequelize';
import { NextFunction, Request, Response } from 'express';


const authenticationMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authorizationHeader = req.headers.authorization;

  if (!authorizationHeader) {
    return res.status(401).json({ error: 'Token manquant. Authentification requise.' });
  }

  const [bearer, token] = authorizationHeader.split(' ');

  if (bearer !== 'Bearer' || !token) {
    return res.status(401).json({ error: 'Format de token incorrect. Authentification requise.' });
  }

  try {
    const decoded = jwt.verify(token, 'secret');
    const isBlacklisted = await BlackList.findOne({ where: { jwtToken: token } })
    if (!isBlacklisted) {
      //@ts-ignore
      req.user = decoded;
      next();
    } else {
      return res.status(401).json({ error: 'Token invalide. Authentification requise.' });
    }
  }
  catch (error) {
    return res.status(401).json({ error: 'Token invalide. Authentification requise.' });
  }
};

export default authenticationMiddleware;