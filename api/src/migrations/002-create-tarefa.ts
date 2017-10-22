export default {
    up: (queryInterface, Sequelize) => {
      return queryInterface.createTable('Tarefas', {
        id: { type: Sequelize.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true },
        active: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true },
        createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
        updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
        usuario_id: { 
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: 'usuarios',
            key: 'id'
          },
          onUpdate: 'cascade',
          onDelete: 'cascade'    
        },
        feita: { type: Sequelize.BOOLEAN, allowNull: false },
        nome: { type: Sequelize.STRING, allowNull: false }
      }).then(() => {
        queryInterface.addIndex('Tarefas', { fields: ['feita', 'nome'] })
      })
    },
    down: (queryInterface, Sequelize) => {
      return queryInterface.dropTable('Tarefas')
    }
  }