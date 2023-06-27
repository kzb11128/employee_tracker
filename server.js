const inquirer = require('inquirer');
const mysql = require('mysql2');
require('dotenv').config();


const db = mysql.createConnection(
    {
        host: 'localhost',
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    },
    console.log('Connected to the employees_db database.')
);

const showMenu = () => {
inquirer.prompt([
    {
        type: 'list',
        name: 'choice',
        message: 'What would you like to do?',
        choices: [
            'View all departments',
            'View all roles',
            'View all employees',
            'Add a department',
            'Add a role',
            'Add an employee',
            'Update an employee role'
        ]
    }
]).then(answers => {
    const choice = answers.choice
    switch (choice) {
        case 'View all departments':
            departmentTable();
            break;
        case 'View all roles':
            roleTable();
            break;
        case 'View all employees':
            employeeTable();
            break;
        case 'Add a department':
            addDepartment();
            break;
        case 'Add a role':
            addRole();
            break;
        case 'Add an employee':
            addEmployee();
            break;
        case 'Update an employee role':
            updateEmployee();
            break;
    }
});
};

showMenu();

const departmentTable = () => {
    db.query('SELECT * FROM departments ORDER BY id', function (err, results) {
        console.table(results);
        showMenu();
    });
};

const roleTable = () => {
    const query = `
    SELECT roles.id, roles.title, roles.salary, departments.department_name
    FROM roles
    INNER JOIN departments ON roles.department_id = departments.id
    ORDER BY roles.id
  `;
    
    db.query(query, function (err, results) {
        console.table(results);
        showMenu();
    });
};

const employeeTable = () => {
    const query = `
    SELECT employees.id, employees.first_name, employees.last_name, roles.title, departments.department_name, roles.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager
    FROM employees
    INNER JOIN roles ON employees.role_id = roles.id
    INNER JOIN departments ON roles.department_id = departments.id
    LEFT JOIN employees AS manager ON employees.manager_id = manager.id
    ORDER BY employees.id
  `;
    
    db.query(query, function (err, results) {
        console.table(results);
        showMenu();
    });
};

const addDepartment = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'department',
            message: 'What is the department name?'
        }
    ]).then(answers => {
        db.query('INSERT INTO departments (department_name) VALUES (?)', answers.department, function (err, results) {
            console.log(`${answers.department} added to Departments table.`);
            showMenu();
        });
    });
};

const addRole = () => {
    let departmentNames = [];
  
    db.query('SELECT department_name FROM departments', function (err, results) {
      if (err) {
        console.error('Error retrieving department names:', err);
        return;
      }
  
      departmentNames = results.map((row) => row.department_name);
  
      inquirer
        .prompt([
          {
            type: 'input',
            name: 'title',
            message: 'What is the role title?',
          },
          {
            type: 'input',
            name: 'salary',
            message: 'What is the role salary?',
          },
          {
            type: 'list',
            name: 'department_id',
            message: 'Select the department:',
            choices: departmentNames,
          },
        ])
        .then((answers) => {
          db.query(
            'SELECT id FROM departments WHERE department_name = ?',
            answers.department_id,
            function (err, results) {
              if (err) {
                console.error('Error retrieving department id:', err);
                return;
              }
  
              const departmentId = results[0].id;
  
              db.query(
                'INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?)',
                [answers.title, answers.salary, departmentId],
                function (err, results) {
                  console.log(`${answers.title} added to the Roles table.`);
                  showMenu();
                }
              );
            }
          );
        });
    });
  };

  const addEmployee = () => {
    let roleTitles = [];
    let managerNames = [];
  
    db.query('SELECT title FROM roles', function (err, results) {
      if (err) {
        console.error('Error retrieving role titles:', err);
        return;
      }
  
      roleTitles = results.map((row) => row.title);
  
      db.query('SELECT CONCAT(first_name, " ", last_name) AS manager FROM employees', function (err, results) {
        if (err) {
          console.error('Error retrieving manager names:', err);
          return;
        }
  
        managerNames = results.map((row) => row.manager);
  
        inquirer
          .prompt([
            {
              type: 'input',
              name: 'first_name',
              message: 'What is the employee first name?',
            },
            {
              type: 'input',
              name: 'last_name',
              message: 'What is the employee last name?',
            },
            {
              type: 'list',
              name: 'role',
              message: 'Select the employee role:',
              choices: roleTitles,
            },
            {
              type: 'list',
              name: 'manager',
              message: 'Select the employee manager:',
              choices: managerNames,
            },
          ])
          .then((answers) => {
            db.query('SELECT id FROM roles WHERE title = ?', answers.role, function (err, results) {
              if (err) {
                console.error('Error retrieving role id:', err);
                return;
              }
  
              const roleId = results[0].id;
  
              db.query('SELECT id FROM employees WHERE CONCAT(first_name, " ", last_name) = ?', answers.manager, function (
                err,
                results
              ) {
                if (err) {
                  console.error('Error retrieving manager id:', err);
                  return;
                }
  
                const managerId = results[0].id;
  
                db.query(
                  'INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)',
                  [answers.first_name, answers.last_name, roleId, managerId],
                  function (err, results) {
                    if (err) {
                      console.error('Error adding employee:', err);
                    } else {
                      console.log(`${answers.first_name} ${answers.last_name} added to Employees table.`);
                      showMenu();
                    }
                  }
                );
              });
            });
          });
      });
    });
  };

const updateEmployee = () => {
    let employeeNames = [];
    let roleTitles = [];
  
    db.query('SELECT CONCAT(first_name, " ", last_name) AS employee FROM employees', function (err, results) {
      if (err) {
        console.error('Error retrieving employee names:', err);
        return;
      }
  
      employeeNames = results.map((row) => row.employee);
  
      db.query('SELECT title FROM roles', function (err, results) {
        if (err) {
          console.error('Error retrieving role titles:', err);
          return;
        }
  
        roleTitles = results.map((row) => row.title);
  
        inquirer
          .prompt([
            {
              type: 'list',
              name: 'employee',
              message: 'Select the employee to update:',
              choices: employeeNames,
            },
            {
              type: 'list',
              name: 'role',
              message: 'Select the new role for the employee:',
              choices: roleTitles,
            },
          ])
          .then((answers) => {
            db.query('SELECT id FROM roles WHERE title = ?', answers.role, function (err, results) {
              if (err) {
                console.error('Error retrieving role id:', err);
                return;
              }
  
              const roleId = results[0].id;
  
              db.query(
                'UPDATE employees SET role_id = ? WHERE CONCAT(first_name, " ", last_name) = ?',
                [roleId, answers.employee],
                function (err, results) {
                  if (err) {
                    console.error('Error updating employee:', err);
                  } else {
                    console.log(`${answers.employee} updated to ${answers.role} in Employees table.`);
                    showMenu();
                  }
                }
              );
            });
          });
      });
    });
  };

