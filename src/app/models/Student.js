import Sequelize, { Model } from 'sequelize';

class Student extends Model {
    static init(sequelize) {
        super.init(
            {
                name: Sequelize.STRING,
                email: Sequelize.STRING,
                age: Sequelize.INTEGER,
                weight: Sequelize.INTEGER,
                stature: Sequelize.INTEGER,
            },
            {
                sequelize,
            }
        );
    }
}

export default Student;
