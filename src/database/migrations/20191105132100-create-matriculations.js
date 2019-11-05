module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('matriculations', {
            id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
            },
            start_date: {
                type: Sequelize.DATE,
                allowNull: false,
            },
            end_date: {
                type: Sequelize.DATE,
                allowNull: false,
                unique: true,
            },
            price: {
                type: Sequelize.DECIMAL(5, 2),
                allowNull: false,
            },
            plan_id: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'plans',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'RESTRICT',
                allowNull: false,
            },
            student_id: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'students',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'RESTRICT',
                allowNull: false,
            },
            created_at: {
                type: Sequelize.DATE,
                allowNull: false,
            },
            updated_at: {
                type: Sequelize.DATE,
                allowNull: false,
            },
        });
    },

    down: queryInterface => {
        return queryInterface.dropTable('matriculations');
    },
};