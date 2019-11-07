import { subDays, endOfWeek } from 'date-fns';
import { Op } from 'sequelize';
import Checkin from '../models/Checkin';
import Student from '../models/Student';
import Matriculation from '../models/Matriculation';

class CheckinController {
    async index(req, res) {
        if (req.userName !== 'Administrador') {
            return res.status(401).json({
                error: 'Você não possui Permissão para realizar essa Ação!',
            });
        }

        const { id } = req.params;

        const student = await Student.findByPk(id);

        if (!student) {
            res.status(400).json({ error: 'Aluno não cadastrado!' });
        }

        const checkIns = await Checkin.findAll({
            where: {
                student_id: id,
            },
            order: [['created_at', 'DESC']],
        });

        return res.json(checkIns);
    }

    async store(req, res) {
        if (req.userName !== 'Administrador') {
            return res.status(401).json({
                error: 'Você não possui Permissão para realizar essa Ação!',
            });
        }

        const { id } = req.params;
        const student = await Student.findByPk(id);

        if (!student) {
            res.status(400).json({ error: 'Aluno não cadastrado!' });
        }

        const matriculationExists = await Matriculation.findOne({
            where: { student_id: id },
        });

        if (!matriculationExists) {
            return res.status(400).json({ error: 'Aluno não matriculado!' });
        }

        const now = new Date();

        const checkins = await Checkin.count({
            where: {
                student_id: student.id,
                created_at: {
                    [Op.between]: [subDays(now, 7), endOfWeek(now)],
                },
            },
        });

        if (checkins && checkins >= 5) {
            return res.status(400).json({
                error: 'O limite de 05 Check-ins em 07 dias foi excedido!',
            });
        }

        await Checkin.create({
            student_id: student.id,
        });

        return res.json({ message: 'Checkin realizado com Sucesso!' });
    }
}

export default new CheckinController();
