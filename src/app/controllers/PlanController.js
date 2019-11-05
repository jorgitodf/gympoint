import * as Yup from 'yup';
import { format } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Plan from '../models/Plan';

class PlanController {
    async store(req, res) {
        if (req.userName !== 'Administrador') {
            return res.status(401).json({
                error: 'Você não possui Permissão para realizar essa Ação!',
            });
        }

        const schema = Yup.object().shape({
            title: Yup.string().required(),
            duration: Yup.number()
                .required()
                .positive()
                .integer()
                .required(),
            price: Yup.number()
                .required()
                .positive()
                .integer()
                .required(),
        });

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'Validations Fail' });
        }

        const planExists = await Plan.findOne({
            where: { title: req.body.title },
        });

        if (planExists) {
            return res
                .status(400)
                .json({ error: 'O Plano informado já existe cadastrado!' });
        }

        const { id, title, duration, price, createdAt } = await Plan.create(
            req.body
        );

        const created_at = format(createdAt, 'yyyy-MM-dd HH:mm:ss', {
            locale: pt,
        });

        return res.json({ id, title, duration, price, created_at });
    }

    async index(req, res) {
        if (req.userName !== 'Administrador') {
            return res.status(401).json({
                error: 'Você não possui Permissão para realizar essa Ação!',
            });
        }

        const plans = await Plan.findAll({
            attributes: ['id', 'title', 'duration', 'price'],
        });

        if (plans.length === 0) {
            res.status(401).json({
                error: 'Não há nenhum Plano Cadastrado no Momento!',
            });
        }

        return res.json(plans);
    }

    async update(req, res) {
        if (req.userName !== 'Administrador') {
            return res.status(401).json({
                error: 'Você não possui Permissão para realizar essa Ação!',
            });
        }

        const schema = Yup.object().shape({
            title: Yup.string().required(),
            duration: Yup.number()
                .required()
                .positive()
                .integer()
                .required(),
            price: Yup.number()
                .required()
                .positive()
                .integer()
                .required(),
        });

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'Validations Fail' });
        }

        const { id, title } = req.body;
        const plan = await Plan.findByPk(id);

        if (!plan) {
            return res.status(400).json({
                error: 'O Plano informado não existe cadastrado!',
            });
        }

        const { duration, price } = await plan.update(req.body);

        return res.json({
            id,
            title,
            duration,
            price,
        });
    }

    async delete(req, res) {
        if (req.userName !== 'Administrador') {
            return res.status(401).json({
                error: 'Você não possui Permissão para realizar essa Ação!',
            });
        }

        const plan = await Plan.findByPk(req.params.id);

        if (!plan) {
            return res.status(400).json({
                error: 'O Plano informado não existe cadastrado!',
            });
        }

        const { title } = await plan.destroy({
            where: { id: req.params.id },
        });

        return res.json({
            sucess: `O plano ${title} foi deletado com sucesso!`,
        });
    }
}

export default new PlanController();
