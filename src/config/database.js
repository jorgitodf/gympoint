module.exports = {
    dialect: 'mysql',
    host: 'localhost',
    username: 'user_gympoint',
    password: '!Gympoint@2019',
    database: 'gympoint',
    define: {
        timestamps: true,
        underscored: true,
        underscoredAll: true,
    },
    dialectOptions: {
        dateStrings: true,
        typeCast: true,
    },
    timezone: 'America/Sao_Paulo',
};
