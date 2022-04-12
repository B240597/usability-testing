/* jshint indent: 2 */
const functions = require('../../functions');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define('tbl_issues', {
    issues_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    job_id: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    issue_description: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    posted_by: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    issue_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    },
    resolved_by: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    resolved_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    status: {
      type: DataTypes.INTEGER(1),
      allowNull: false,
      defaultValue: '1'
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
    tableName: 'tbl_issues',
    updatedAt: 'modified_date',
    createdAt: 'created_date',
    hooks: {
      beforeValidate: function (instance, options) {
        if (!options.userId)
          return sequelize.Promise.reject("Session expired. Please login again");
        let userId = functions.decrypt(options.userId);
        instance['created_by'] = userId;
        instance['modified_by'] = userId;
      }
    }
  });
};