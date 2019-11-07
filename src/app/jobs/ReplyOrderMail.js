import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Mail from '../../lib/Mail';

class ReplyOrderMail {
    get key() {
        return 'ReplyOrderMail';
    }

    async handle({ data }) {
        const { student, helpOrder } = data;

        // eslint-disable-next-line no-console
        console.log('Queue executed');
        // eslint-disable-next-line no-console
        console.log(
            student.name,
            student.email,
            helpOrder.question,
            helpOrder.answer,
            helpOrder.createdAt
        );

        await Mail.sendMail({
            to: `${student.name} <${student.email}>`,
            subject: 'Resposta GYMPOINT',
            template: 'replyorder',
            context: {
                name: student.name,
                question: helpOrder.question,
                created_at: format(
                    parseISO(helpOrder.createdAt),
                    "'Dia' dd 'de' MMMM 'de' yyyy",
                    {
                        locale: pt,
                    }
                ),
                answer: helpOrder.answer,
            },
        });
    }
}

export default new ReplyOrderMail();
