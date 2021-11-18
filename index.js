// requires
const inquirer = require("inquirer");
const mysql = require("mysql2");
require("dotenv").config();

// Connection
const connect = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password:'Password123',
  database:'employee_db'

});

// // Department table
function deptTable() {
  console.log('departments')
  connect.query(
    "SELECT * FROM departments ORDER BY departments.id",
    function (err, data) {
      if (err) {
        console.log(err);
        return;
      }
      console.table(data);
      start();
      return;
    }
  );
}

// // Role Table
function roleTable() {
  const sql =
    "SELECT salary, title, departments.name FROM departments INNER JOIN roles ON roles.department_id = departments.id ORDER BY roles.id";
  connect.query(sql, (err, data) => {
    if (err) {
      console.log(err);
      return;
    } else {
      console.table(data);
      start();
      return;
    }
  });
}

// // Employee table 
function empTable() {
  const sql = `
  SELECT
  employees.first_name AS First_Name,
  roles.title as Title,
  departments.name AS Department,
  roles.salary AS Salary,
  CONCAT(managers.first_name, " ", managers.last_name) as Manager
  FROM employees
  INNER JOIN roles
  ON employees.role_id = roles.id
  INNER JOIN departments
  ON roles.department_id = departments.id
  LEFT OUTER JOIN employees AS Managers
  ON employees.manager_id = managers.id
  ORDER BY employees.id  
  `;
  connect.query(sql, (err, data) => {
    if (err) {
      console.log(err);
      return;
    } else {
      console.table(data);
      start();
      return;
    }
  });
}

// // add departments

function deptAdd() {
  inquirer
    .prompt([
      {
        type: "input",
        name: "deptName",
        message: "State the name of the department",
      },
    ])
    .then((deptAdd) => {
      const sql = `
                INSERT INTO departments (name)
                VALUES ("${deptAdd.deptName}")`;
      connect.query(sql, (err, data) => {
        if (err) {
          console.log(err);
          return;
        }
        start();
      });
    });
}
// Add role
function addRole() {
  let depts = [];

  connect.query(`SELECT * from departments`, function (err, data) {
    if (err) throw err;

    for (let i = 0; i < data.length; i++) {
      var deptsObject = {
        name: data[i].name,
        value: data[i].id,
      };

      depts.push(deptsObject);
    }
    console.log(depts)

    inquirer
      .prompt([
        {
          name: "role_title",
          type: "input",
          message: "State Roles Name",
        },

        {
          name: "dept_name",
          type: "list",
          message: "What is the Department associated with this role?",
          choices: depts,
        },

        {
          name: "role_salary",
          type: "input",
          message: "What is the roles salary?",
        },
      ])
      .then((choice) => {
        console.log(choice)
        const sql = `
                INSERT INTO roles (title, salary, department_id)
                VALUES ("${choice.role_title}", ${choice.role_salary}, ${choice.dept_name})
        `;
        connect.query(sql, (err, res) => {
          if (err) {
            console.log(err);
            return;
          }
          start();
          return;
        });
      });
  });
}

// add employee
function addEmp() {
  const sql = `SELECT * FROM roles`;
  connect.query(sql, (err, resRole) => {
    if (err) {
      console.log(err);
      return;
    }
    const sql = `SELECT * FROM employees`;
    connect.query(sql, (err, resManager) => {
      if (err) {
        console.log(err);
        return;
      }
      inquirer
        .prompt([
          {
            type: "input",
            message: "Employees first name",
            name: "firstName",
          },

          {
            type: "input",
            message: "Employees last name",
            name: "lastName",
          },
          {
            type: "list",
            message: "Select Employees Role",
            name: "role",
            choices: resRole.map((role) => {
              return {
                name: role.title,
                value: role.id,
              };
            }),
          },
          {
            type: "list",
            message: "Select Employees manager",
            name: "manager",
            choices: [
              { name: "None", value: null },
              ...resManager.map((manager) => {
                return {
                  name: manager.first_name + " " + manager.last_name,
                  value: manager.id,
                };
              }),
            ],
          },
        ])
        .then((choice) => {
          let sql = `INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES("${choice.firstName}","${choice.lastName}", ${choice.role}, ${choice.manager})`;
          connect.query(sql, (err, data) => {
            if (err) {
              console.log(err);
              return;
            }
            start();
            return;
          });
        });
    });
  });
}

// Update Employee
function roleUpdate() {
  console.log("role update")
  let roles = [];
  let employeeName = [];
  let sql = `SELECT id, title FROM roles`;
  connect.query(sql, (err, data) => {
    if (err) {
      console.log(err);
      return;
    }
    for (let i = 0; i < data.length; i++) {
      roles.push({
        name: data[i].title,
        value: data[i].id,
      });
    }
    let sql = `SELECT id, first_name, last_name FROM employees`;
    connect.query(sql, (err, data) => {
      if (err) {
        console.log(err);
        return;
      }
      for (let i = 0; i < data.length; i++) {
        employeeName.push({
          name: data[i].first_name + " " + data[i].last_name,
          value: data[i].id,
        });
      }
      inquirer
        .prompt([
          {
            type: "list",
            message: "Select Employee You Wish To Update",
            name: "employeeId",
            choices: employeeName,
          },
          {
            type: "list",
            message: "Select Role You Want To Update To",
            name: "updateRole",
            choices:roles,
          },
        ])
        .then((choice) => {
          let sql = `UPDATE employee SET role_id=? WHERE id`;
          connect.query(
            sql,
            (choice.updateRole, choice.employeeId),
            (err, data) => {
              if (err) {
                console.log(err);
              }
              start();
              return;
            }
          );
        });
    });
  });
}

// Menu
async function start() {
  
  const response =await inquirer.prompt({
        type: "list",
        name: "menu",
        message: "select an option below",
        choices: [
          "View Departments",
          "View Roles",
          "View Employees",
          "Add Department",
          "Add Role",
          "Add Employee",
          "Update Employees Role",
          "All Done",
        ],
      })
    
    let {menu}=response
      if (menu === "View Departments") {
        deptTable();
      } else if (menu === "View Roles") {
        roleTable();
      } else if (menu === "View Employees") {
        empTable();
      } else if (menu === "Add Department") {
        deptAdd();
      } else if (menu === "Add Role") {
        addRole();
      } else if (menu === "Add Employee") {
        addEmp();
      } else if (menu === "Update Employees Role") {
        roleUpdate();
      }
    
  }

start();

