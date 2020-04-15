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
  database: "top_songsDB"
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
      .then(ans => {
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