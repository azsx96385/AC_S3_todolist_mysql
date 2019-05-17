"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addConstraint("Todos", ["user_id"], {
      type: "foreign key",
      name: "todos_fkey_constraint_user",
      references: {
        //Required field
        table: "Users",
        field: "id"
      },
      onDelete: "cascade",
      onUpdate: "cascade"
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeConstraint(
      "Todos",
      "todos_fkey_constraint_user"
    );
  }
};
