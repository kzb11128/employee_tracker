INSERT INTO departments (department_name)
VALUES
('Sales'),
('Marketing'),
('Finance'),
('Legal');

INSERT INTO roles (title, salary, department_id)
VALUES
('Sales Manager', 100000, 1),
('Salesperson', 50000, 1),
('Marketing Lead', 100000, 2),
('Chief Marketing Officer', 150000, 2),
('Controller', 100000, 3),
('Finance Analyst', 75000, 3),
('Chief Financial Officer', 225000, 3),
('Legal Counsel', 140000, 4),
('General Counsel', 250000, 4);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES
('Ronald', 'Cunningham', 1, NULL),
('Christine', 'Roberts', 4, NULL),
('Dennis', 'Flores', 7, NULL),
('Diane', 'Hughes', 9, NULL),
('James', 'Jennings', 2, 1),
('Paula', 'Roberts', 3, 2),
('Tina', 'Adams', 5, 4),
('Diane', 'Hughes', 6, 5),
('Todd', 'Gordon', 8, 9);