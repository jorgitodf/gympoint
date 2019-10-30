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

        return res.json({ id, name, email, createdAt });
    }
}

export default new UserController();
