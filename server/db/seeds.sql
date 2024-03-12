INSERT INTO department (name)
VALUES ("Contractors"),
       ("Accounting");

INSERT INTO role (title, salary, department_id)
VALUES ("General Labourer", 40000.00, 1),
       ("Manager", 65000.00, 1),
       ("Book Keeper", 75000.00, 2);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Mark", "Namesmith", 2, NULL),
("Joe", "Nameth", 3, 2),
	   ("Steve", "Smith", 1, 2),
       ("John", "Stewart", 1, 2);