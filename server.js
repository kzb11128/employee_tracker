const inquirer = require('inquirer');
const mysql = require('mysql2');
require('dotenv').config();
// const cTable = require('console.table');


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
    db.query('SELECT * FROM roles', function (err, results) {
        console.table(results);
        showMenu();
    });
};

const employeeTable = () => {
    db.query('SELECT * FROM employees', function (err, results) {
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
        db.query('INSERT INTO departments (name) VALUES (?)', answers.department, function (err, results) {
            console.log('Department added.');
            departmentTable();
        });
    });
    showMenu();
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
            console.log('Role added.');
            roleTable();
        });
    });
    showMenu();
};

