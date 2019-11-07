import * as Yup from 'yup';
import HelpOrder from '../models/HelpOrder';
import Student from '../models/Student';
import Matriculation from '../models/Matriculation';

import ReplyOrderMail from '../jobs/ReplyOrderMail';
import Queue from '../../lib/Queue';

class HelpOrderController {
    async index(req, res) {
        if (req.userName !== 'Administrador') {
            return res.status(401).json({
                error: 'Você não possui Permissão para realizar essa Ação!',
            });
        }

        const helpOrders = await HelpOrder.findAll({
            where: { answer: null },
            include: [
                {
                    model: Student,
                    attributes: ['name', 'email'],
                },
            ],
        });

        return res.json(helpOrders);
    }

    async store(req, res) {
        const schema = Yup.object().shape({
            question: Yup.string().required(),
        });

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'Validation failed!' });
        }

        const student_id = req.params.id;

        const student = await Student.findByPk(student_id);

        if (!student) {
            res.status(400).json({ error: 'Aluno não cadastrado!' });
        }

        const matriculationExists = await Matriculation.findOne({
            where: { student_id },
        });

        if (!matriculationExists) {
            return res.status(400).json({ error: 'Aluno não matriculado!' });
        }

        const { question } = req.body;
        const helpOrder = await HelpOrder.create({ question, student_id });

        return res.json(helpOrder);
    }

    async show(req, res) {
        const helpOrders = await HelpOrder.findAll({
            where: { student_id: req.params.id },
            attributes: ['question', 'answer', 'answer_at', 'created_at'],
            include: [
                {
                    model: Student,
                    attributes: ['name', 'email'],
                },
            ],
        });
        return res.json(helpOrders);
    }

    async update(req, res) {
        if (req.userName !== 'Administrador') {
            return res.status(401).json({
                error: 'Você não possui Permissão para realizar essa Ação!',
            });
        }

        const schema = Yup.object().shape({
            answer: Yup.string().required(),
        });

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'Validation failed!' });
        }

        const { id } = req.params;

        const helpOrder = await HelpOrder.findByPk(id);

        if (!helpOrder) {
            return res
                .status(400)
                .json({ message: 'Solicitação de Ajuda não encontrada!' });
        }

        if (helpOrder.answer) {
            return res.status(400).json({ error: 'Pergunta já respondida!' });
        }

        const student = await Student.findByPk(helpOrder.student_id, {
            attributes: ['name', 'email'],
        });

        req.body.answer_at = new Date();

        await helpOrder.update(req.body);

        await Queue.add(ReplyOrderMail.key, {
            student,
            helpOrder,
        });

        return res.json({ ...req.body });
    }
}

export default new HelpOrderController();
