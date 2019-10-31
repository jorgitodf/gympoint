import { format } from 'date-fns';
import pt from 'date-fns/locale/pt';
import User from '../models/User';

class UserController {
    async store(req, res) {
        const userExists = await User.findOne({
            where: { email: req.body.email },
        });

        if (userExists) {
            return res
                .status(400)
                .json({ error: 'O E-mail informado já existe cadastrado!' });
        }

        const { id, name, email, createdAt } = await User.create(req.body);

        const created_at = format(createdAt, 'yyyy-MM-dd HH:mm:ss', {
            locale: pt,
        });

        return res.json({ id, name, email, created_at });
    }

    async update(req, res) {
        if (req.name !== 'Administrador') {
            return res.status(401).json({
                error: 'Você não possui Permissão para realizar essa Ação!',
            });
        }
        return res.json({
            ok: true,
        });
    }
}

export default new UserController();
