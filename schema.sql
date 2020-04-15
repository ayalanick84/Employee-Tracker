DROP DATABASE IF EXISTS employee_trackerDB;
CREATE database employee_trackerDB;
USE employee_trackerDB;

CREATE TABLE department (
     position INT NOT NULL,
     name VARCHAR(30),
     PRIMARY KEY (position)

);
CREATE TABLE role (
     position INT NOT NULL,
     title VARCHAR(30),
     salary DECIMAL(10,4),
     dep_id INT,
     PRIMARY KEY (position),
     FOREIGN KEY(dep_id) REFERENCES department(position)

);
CREATE TABLE employee (
     position INT NOT NULL,
     first_name VARCHAR(30),
     last_name VARCHAR(30),
     role_id INT,
     manager_id INT,
     PRIMARY KEY (position),
     FOREIGN KEY(role_id) REFERENCES role(position),
     FOREIGN KEY(manager_id) REFERENCES employee(position)

)