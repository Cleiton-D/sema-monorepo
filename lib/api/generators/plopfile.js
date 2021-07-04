const path = require('path');
const fs = require('fs');

const TEMPLATES_PATH = path.resolve(__dirname, 'templates');
const templates = fs.readdirSync(TEMPLATES_PATH);

module.exports = plop => {
  templates.forEach(template => {
    const templatePath = path.join(TEMPLATES_PATH, template);
    const templatePlopFile = path.join(templatePath, 'plopfile.js');

    if (fs.existsSync(templatePlopFile)) {
      const { name, generator } = require(templatePlopFile);
      plop.setGenerator(name, generator);
    }
  });
};
