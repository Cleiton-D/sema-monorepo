const path = require('path');
const fs = require('fs');
const Handlebars = require('handlebars');

Handlebars.registerHelper('camelCase', function(str) {
  return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function(word, index) {
    return index === 0 ? word.toLowerCase() : word.toUpperCase();
  }).replace(/\s+/g, '');
});

const moduleDir = "../../../src/modules/{{camelCase name}}";

const directories = [
  "dtos/",
  "infra/",
  "infra/http",
  "infra/http/controllers",
  "infra/http/routes",
  "infra/typeorm",
  "infra/typeorm/entities",
  "infra/typeorm/repositories",
  "repositories",
  "repositories/fakes",
  "services",
]

module.exports = {
  name: "module",
  generator: {
    prompts: [
      {
        type: "input",
        name: "name",
        message: "What is the name of the module?"
      }
    ],
    actions: [
      function createDirs(answers) {
        const template = Handlebars.compile(moduleDir);
        const moduleDirCompiled = template(answers);
        const modulepath = path.resolve(__dirname, ...moduleDirCompiled.split("/"));

        if (fs.existsSync(modulepath)) {
          console.log("This module already exists!");
          return;
        }

        fs.mkdirSync(modulepath);
        console.log("+ " + modulepath);

        directories.forEach(directory => {
          const dirPath = path.join(modulepath, ...directory.split("/"));
          fs.mkdirSync(dirPath);
          console.log("+ " + dirPath);
        });

        console.log("Module created successfully!!");
      }
    ]
  }
}
