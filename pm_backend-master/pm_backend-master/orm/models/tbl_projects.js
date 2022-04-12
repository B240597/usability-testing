/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('tbl_projects', {
    project_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    project_name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    project_code: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    project_type: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    client_name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    client_location: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    project_manager: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'tbl_users',
        key: 'user_id'
      }
    },
    start_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    },
    delivery_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    },
    status: {
      type: DataTypes.INTEGER(1),
      allowNull: false
    },
    is_deleted: {
      type: DataTypes.INTEGER(1),
      allowNull: false,
      defaultValue: '0'
    },
    created_by: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    created_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    },
    modified_by: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    modified_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    tableName: 'tbl_projects',
    updatedAt: 'modified_date',
    createdAt: 'created_date',
    hooks: {
      beforeValidate: function (instance, options) {
        if (!options.userId)
          return sequelize.Promise.reject("Session expired. Please login again");
        let userId = options.userId;
        instance['created_by'] = userId;
        instance['modified_by'] = userId;
      }
    }
  });
};
