const pm2 = require('pm2');
const fs = require("fs-extra");
const simpleGit = require('simple-git');
const spawnAsync = require("await-spawn");

const path  = require("path");

const git = simpleGit();

const cwd = process.cwd();
const libPath = path.join(cwd, "lib");

function stopServices() {
  return new Promise((resolve) => {
    pm2.stop("client", () => {
      pm2.stop("api", () => resolve());
    })
  });
}

function startServices() {
  return new Promise((resolve) => {
    pm2.start("api", () => {
      pm2.start("client", () => resolve());
    })
  });
}

function createBackups() {
  fs.copySync(libPath, path.join(cwd, "lib.bkp"));
}

function restoreBackups() {
  fs.removeSync(libPath);
  fs.moveSync(path.join(cwd, "lib.bkp"), libPath);
}

function deleteBackups() {
  fs.removeSync(path.join(cwd, "lib.bkp"));
}

async function downloadNewVersion() {
  await git.clone("https://github.com/Cleiton-D/sema-monorepo.git", path.join(cwd, "new-app"));
}

async function installDependencies(production = false) {
  const baseDir = production ? path.resolve(cwd, "lib") : path.resolve(cwd, "new-app", "lib");

  const additionalArgs = production ? ["--production"] : [];

  await Promise.all([
    spawnAsync("npm", ["install", ...additionalArgs], {
      cwd: path.join(baseDir, "api")
    }),
    spawnAsync("npm", ["install", ...additionalArgs], {
      cwd: path.join(baseDir, "client")
    }),
  ]);
}

async function buildApps() {
  const baseDir = path.resolve(cwd, "new-app", "lib");

  await Promise.all([
    spawnAsync("npm", ["run", "build"], {
      cwd: path.join(baseDir, "api")
    }),
    spawnAsync("npm", ["run", "build"], {
      cwd: path.join(baseDir, "client")
    }),
  ]);
}

async function copyNewVersion() {
  const baseDir = path.resolve(cwd, "new-app", "lib");
  const apiPath = path.join(baseDir, "api");
  const clientPath = path.join(baseDir, "client");

  // api
  fs.removeSync(path.join(libPath, "api", "dist"));
  fs.removeSync(path.join(libPath, "api", "package.json"));
  fs.removeSync(path.join(libPath, "api", "init.sh"));
  fs.removeSync(path.join(libPath, "api", "node_modules"));

  fs.copySync(path.join(apiPath, "dist"), path.join(libPath, "api", "dist"));
  fs.copyFileSync(path.join(apiPath, "package.json"), path.join(libPath, "api", "package.json"));
  fs.copyFileSync(path.join(apiPath, "init.sh"), path.join(libPath, "api", "init.sh"));


  // client
  fs.removeSync(path.join(libPath, "client", ".next"));
  fs.removeSync(path.join(libPath, "client", "package.json"));
  fs.removeSync(path.join(libPath, "client", "node_modules"));

  fs.copySync(path.join(clientPath, ".next"), path.join(libPath, "client", ".next"));
  fs.copyFileSync(path.join(clientPath, "package.json"), path.join(libPath, "client", "package.json"));

  console.log("new version copied");

  await installDependencies(true);
  console.log("installed production dependencies");
}


async function buildNewVersion() {
  await downloadNewVersion();
  console.log("new version downloaded");

  await installDependencies();
  console.log("installed dependencies");

  await buildApps();
  console.log("built applications");
}


pm2.connect(async () => {
  deleteBackups();
  console.log("deprecated backups removed");

  createBackups();
  console.log("backup created");

  try {
    await buildNewVersion();
    console.log("new version downloaded");

    await stopServices();
    console.log("application stopped");

    await copyNewVersion();
    fs.removeSync(path.resolve(cwd, "new-app"));
  } catch {
    restoreBackups();
  }

  await startServices();
  console.log("servicos iniciados")

  pm2.disconnect();
})

