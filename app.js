const mysql = require("mysql");
const inquirer = require("inquirer");
const connection = mysql.createConnection({
    host: "localhost",
    // Your port; if not 3306
    port: 3306,
    // Your username
    user: "root",
    // Your password
    password: "password",
    database: "employee_trackerDB"
});
connection.connect(err => {
    if (err) {
        throw err;
    }
    console.log("connected as id " + connection.threadId + "\n");
    nextAction();
});
const nextAction = () => {
    const ADD_DEP = "Add a department";
    const ADD_ROLE = "Add a role";
    const ADD_EMP = "Add an employee";
    const VIEW_DEP = "View departments";
    const VIEW_ROLE = "View roles";
    const VIEW_EMP = "View employees";
    const UPDATE = "Update employee roles"


    return inquirer
        .prompt([
            {
                type: "list",
                message: "What would you like to do?",
                name: "action",
                choices: [
                    ADD_DEP,
                    ADD_EMP,
                    ADD_ROLE,
                    VIEW_DEP,
                    VIEW_EMP,
                    VIEW_ROLE,
                    UPDATE,
                    "EXIT"
                ]
            }
        ])
        .then(answer => {
            switch (answer.action) {
                case ADD_DEP:
                    return addDep();

                case ADD_EMP:
                    return addEmp();

                case ADD_ROLE:
                    return addRole();

                case VIEW_DEP:
                    return viewDep();

                case VIEW_EMP:
                    return viewEmp();

                case VIEW_ROLE:
                    return viewRole();

                case UPDATE:
                    return updateEmp();

                default:
                    connection.end();
            }
        })
        .catch(error => {
            console.log(error);
            process.exit(1);
        });
};
// const deps = [];
// const roles = [];
// const employees = [];
function addDep() {
    return inquirer
        .prompt([
            {
                type: "input",
                message: "What department would you like to add?",
                name: "addDep"
            }
        ])
        .then((answer) => {
            // when finished prompting, insert a new item into the db with that info
            return connection.query(
                "INSERT INTO department SET ?",
                {
                    dep_name: answer.addDep
                },
                function (err, res) {
                    if (err) {
                        throw err;
                    }
                    console.log("Success");
                    // re-prompt the user for if they want to bid or post
                    return nextAction();
                })
        })
}
function addRole() {
    // query the database for all items being auctioned
    return connection.query("SELECT * FROM department", (err, results) => {
        if (err) {
            throw err;
        }
        const depNames = results.map((row) => {
            return {
                name: row.dep_name,
                value: row.position,
            }
        });
        // once you have the items, prompt the user for which they'd like to bid on
        return inquirer
            .prompt([
                {
                    name: "dep",
                    type: "list",
                    choices: depNames,
                    message: "What department is it in?",
                },
                {
                    name: "title",
                    type: "input",
                    message: "What is the name of the role?",
                }, {
                    name: "salary",
                    type: "input",
                    message: "What is the salary"
                }
            ])
            .then((answers) => {
                return connection.query(
                    "INSERT INTO role (dep_id,title, salary) VALUES ( ?, ?, ?)",
                    [answers.dep, answers.title, answers.salary],
                    function (err, res) {
                        if (err) {
                            throw err;
                        }
                        console.log("Success");
                        // re-prompt the user for if they want to bid or post
                        return nextAction();
                    })
            })
    })
}
function addEmp() {
    // query the database for all items being auctioned
    return connection.query("SELECT * FROM role", (err, results) => {
        if (err) {
            throw err;
        }
        const roleNames = results.map((row) => {
            return {
                name: row.title,
                value: row.position,
            }
        });
        connection.query(
            "SELECT CONCAT(employee.first_name, ' ', employee.last_name) AS manager, employee.position FROM employee",
            (err, results) => {
                if (err) {
                    throw err;
                }
                const managers = results.map((row) => {
                    return {
                        name: row.manager,
                        value: row.id
                    };
                });
                managers.push("They have no manager")
                // once you have the items, prompt the user for which they'd like to bid on
                return inquirer
                    .prompt([
                        {
                            name: "role",
                            type: "list",
                            choices: roleNames,
                            message: "What is their role?",
                        },
                        {
                            name: "manager",
                            type: "list",
                            message: "Who is their manager?",
                            choices: managers
                        }, {
                            name: "firstName",
                            type: "input",
                            message: "What is their first name?"
                        }, {
                            name: "lastName",
                            type: "input",
                            message: "What is their last name"
                        }
                    ])
                    .then((answers) => {
                        return connection.query(
                            "INSERT INTO employee (role_id,manager_id,first_name,last_name) VALUES ( ?,?, ?, ?)",
                            [answers.role, , answers.manager, answers.firstName, answers.lastName],
                            function (err, res) {
                                if (err) {
                                    throw err;
                                }
                                console.log("Success");
                                // re-prompt the user for if they want to bid or post
                                return nextAction();
                            })
                    })
            })
    })
}

