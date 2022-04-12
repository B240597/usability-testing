/* jshint indent: 2 */
const functions = require('../../functions');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('tbl_job_grid_columns', {
    job_grid_column_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    grid_columns: {
      type: DataTypes.STRING(15),
      allowNull: false
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
    tableName: 'tbl_job_grid_columns',
    updatedAt: 'modified_date',
    createdAt: 'created_date',
    hooks : {
      beforeValidate : function(instance, options) {
        if(!options.userId)
          return sequelize.Promise.reject("Session expired. Please login again");
        let userId = functions.decrypt(options.userId);
        instance['created_by'] = userId;
        instance['modified_by'] = userId;
      }
    }
  });
};