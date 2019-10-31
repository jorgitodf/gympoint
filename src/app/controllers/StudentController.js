import { format } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Student from '../models/Student';

class StudentController {
    async store(req, res) {
        const studentExists = await Student.findOne({
            where: { email: req.body.email },
        });

        if (studentExists) {
            return res
                .status(400)
                .json({ error: 'O E-mail informado já existe cadastrado!' });
        }

        if (req.userName !== 'Administrador') {
            return res.status(401).json({
                error: 'Você não possui Permissão para realizar essa Ação!',
            });
        }

        const {
            id,
            name,
            email,
            age,
            weight,
            stature,
            createdAt,
        } = await Student.create(req.body);

        const created_at = format(createdAt, 'yyyy-MM-dd HH:mm:ss', {
            locale: pt,
        });

        return res.json({ id, name, email, age, weight, stature, created_at });
    }

    async update(req, res) {
        const { id, email } = req.body;
        const student = await Student.findByPk(id);

        // eslint-disable-next-line no-console
        console.log(req.userName);

        if (req.userName !== 'Administrador') {
            return res.status(401).json({
                error: 'Você não possui Permissão para realizar essa Ação!',
            });
        }

        if (email !== student.email) {
            const emailExists = await Student.findOne({ where: { email } });

            if (emailExists) {
                return res.status(400).json({
                    error: 'O E-mail informado já existe cadastrado!',
                });
            }
        }

        const { name, age, weight, stature } = await student.update(req.body);

        return res.json({
            id,
            name,
            email,
            age,
            weight,
            stature,
        });
    }
}

export default new StudentController();
