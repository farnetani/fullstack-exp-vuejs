export default {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Usuarios', {
      id: { type: Sequelize.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true },
      active: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
      nome: { type: Sequelize.STRING, allowNull: false },
      email: { type: Sequelize.STRING, allowNull: false, unique: true },
      senha: { type: Sequelize.STRING, allowNull: false }
    }).then(() => {
      queryInterface.addIndex('Usuarios', { fields: ['nome', 'email'] })
    })
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Usuarios')
  }
}