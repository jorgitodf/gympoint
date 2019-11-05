import * as Yup from 'yup';
import { format } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Student from '../models/Student';

class StudentController {
    async store(req, res) {
        const schema = Yup.object().shape({
            name: Yup.string().required(),
            email: Yup.string().required(),
            age: Yup.number()
                .required()
                .positive()
                .integer()
                .required(),
            weight: Yup.number()
                .required()
                .positive()
                .integer()
                .required(),
            stature: Yup.number()
                .required()
                .positive()
                .integer()
                .required(),
        });

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'Validations Fail' });
        }

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
        if (req.userName !== 'Administrador') {
            return res.status(401).json({
                error: 'Você não possui Permissão para realizar essa Ação!',
            });
        }

        const schema = Yup.object().shape({
            name: Yup.string(),
            email: Yup.string(),
            age: Yup.number()
                .positive()
                .integer()
                .required(),
            weight: Yup.number()
                .positive()
                .integer()
                .required(),
            stature: Yup.number()
                .positive()
                .integer()
                .required(),
        });

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'Validations Fail' });
        }

        const { id, email } = req.body;
        const student = await Student.findByPk(id);

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
