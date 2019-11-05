import * as Yup from 'yup';
import { addMonths, parseISO, format } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Matriculation from '../models/Matriculation';
import Student from '../models/Student';
import Plan from '../models/Plan';

class MatriculationController {
    async index(req, res) {
        if (req.userName !== 'Administrador') {
            return res.status(401).json({
                error: 'Você não possui Permissão para realizar essa Ação!',
            });
        }

        const matriculations = await Matriculation.findAll({
            attributes: ['id', 'start_date', 'end_date', 'price'],
        });

        if (matriculations === null || matriculations.length === 0) {
            res.status(401).json({
                error: `Não há nenhuma Matrícula Cadastrada no Sistema`,
            });
        }

        return res.json(matriculations);
    }

    async store(req, res) {
        if (req.userName !== 'Administrador') {
            return res.status(401).json({
                error: 'Você não possui Permissão para realizar essa Ação!',
            });
        }

        const schema = Yup.object().shape({
            student_id: Yup.number().required(),
            plan_id: Yup.number().required(),
            start_date: Yup.date().required(),
        });

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'Validation failed!' });
        }

        const { start_date, plan_id, student_id } = req.body;

        const student = await Student.findByPk(student_id, {
            attributes: ['name', 'email'],
        });

        if (!student) {
            return res.status(400).json({ error: 'Aluno não cadastrado!' });
        }

        const matriculationExists = await Matriculation.findOne({
            where: { student_id: req.body.student_id },
        });

        if (matriculationExists) {
            return res.status(400).json({
                error: `Aluno(a) já está matriculado!`,
            });
        }

        const plan = await Plan.findByPk(plan_id, {
            attributes: ['duration', 'price', 'title'],
        });

        if (!plan) {
            return res
                .status(400)
                .json({ error: 'Selecione um Plano Válido!' });
        }

        const price = plan.duration * plan.price;

        const d = new Date();
        const timeAtual = format(d, 'HH:mm:ss', {
            locale: pt,
        });

        const end_date = addMonths(
            parseISO(`${start_date} ${timeAtual}`),
            plan.duration
        );

        const n_start_date = `${req.body.start_date} ${timeAtual}`;

        const matriculation = await Matriculation.create({
            start_date: n_start_date,
            end_date,
            price,
            plan_id,
            student_id,
        });

        return res.json(matriculation);
    }
}

export default new MatriculationController();
