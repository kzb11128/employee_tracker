const inquirer = require('inquirer');
const mysql = require('mysql2');
const { last } = require('rxjs');
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
    db.query('SELECT * FROM departments', function (err, results) {
        console.table(results);
        showMenu();
    });
};

const roleTable = () => {
    const query = `
    SELECT roles.id, roles.title, roles.salary, departments.department_name
    FROM roles
    INNER JOIN departments ON roles.department_id = departments.id
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
        });
    });
};

const addRole = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'title',
            message: 'What is the role title?'
        },
        {
            type: 'input',
            name: 'salary',
            message: 'What is the role salary?'
        },
        {
            type: 'input',
            name: 'department_id',
            message: 'What is the department id?'
        }
    ]).then(answers => {
        db.query('INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?)', [answers.title, answers.salary, answers.department_id], function (err, results) {
            console.log(`${answers.title} added to the Roles table.`);
        });
    });
};

const addEmployee = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'first_name',
            message: 'What is the employee first name?'
        },
        {
            type: 'input',
            name: 'last_name',
            message: 'What is the employee last name?'
        },
        {
            type: 'input',
            name: 'title',
            message: 'What is the employee title?'
        },
        {
            type: 'input',
            name: 'manager',
            message: 'What is the employee manager?'
        }
    ]).then(answers => {
        db.query('INSERT INTO employees (first_name, last_name, title, manager_id) VALUES (?, ?, ?, ?)', [answers.first_name, answers.last_name, answers.role, answers.manager], function (err, results) {
            console.log(`${answers.first_name} ${answers.last.name} added to Employees table.`);
        });
    })
};


