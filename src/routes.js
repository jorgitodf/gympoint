import { Router } from 'express';

import UserController from './app/controllers/UserController';

const routes = new Router();

routes.post('/users', UserController.store);

/* routes.get('/', async (req, res) => {
    const user = await User.create({
        name: 'Jorgito Paiva',
        email: 'jorgito@gmail.com',
        password_hash: '123456',
    });

    return res.json(user);
}); */

export default routes;
