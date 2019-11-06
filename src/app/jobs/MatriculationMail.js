import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Mail from '../../lib/Mail';

class MatriculationMail {
    get key() {
        return 'MatriculationMail';
    }

    async handle({ data }) {
        const { student, plan, end_date, price } = data;

        await Mail.sendMail({
            to: `${student.name} <${student.email}>`,
            subject: 'Bem vindo a GYMPOINT',
            template: 'matriculation',
            context: {
                name: student.name,
                plan: plan.title,
                end_date: format(
                    parseISO(end_date),
                    "'Dia' dd 'de' MMMM 'de' yyyy",
                    {
                        locale: pt,
                    }
                ),
                total: price,
            },
        });
    }
}

export default new MatriculationMail();
