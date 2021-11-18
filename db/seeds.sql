USE employee_db;
INSERT INTO
    departments (name)
VALUES
    ("Web Developers"),
    ("Engineers"),
    ("Marketing");
INSERT INTO
    roles (title, salary, department_id)
VALUES
    ("Front end", 100000, 1),
    ("Back end", 110000, 1),
    ("Lead Developer", 200000, 1),
    ("Software Engineer", 150000, 2),
    ("Aerospace Engineer", 140000, 2),
    ("Computer Systems Engineer",200000 ,2),
    ("Sales rep", 80000, 3),
    ("Sales lead", 120000, 3),
    ("Marketing Manager", 140000, 3);
INSERT INTO
    employees (first_name, last_name, role_id, manager_id)
VALUES
    ("Michael", "Digi", 1, 1),
    ("Nick", "Demon", 2, 2),
    ("Devon", "Tiger", 3, 3);