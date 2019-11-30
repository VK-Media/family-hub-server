import * as Sequelize from 'sequelize'

let sequelize;

export const databaseSetup = (): void => {
    const nodeEnvironment = process.env.NODE_ENV.toUpperCase()

    const databaseConnectionString =
        process.env['DATABASE_URL_' + nodeEnvironment]

    sequelize = new Sequelize(databaseConnectionString);
    
    connect(databaseConnectionString, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false
    })
}

