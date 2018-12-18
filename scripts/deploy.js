const fs = require("fs-extra");
const util = require("util");
const exec = util.promisify(require("child_process").exec);

console.log("Done bundling. Now deploying...");

const baseBranch = "vhub-react";

exec("git branch --list")
  .then(({ stdout, stderr }) => {
    if (stdout.includes("vhub-react-deploy")) {
      return exec("git branch -D vhub-react-deploy");
    }
    return Promise.resolve();
  })
  .then(() => exec("git checkout -b vhub-react-deploy"))
  .then(() => fs.readdir("."))
  .then(items =>
    items
      .filter(
        file =>
          !(
            file.endsWith(".php") ||
            file.startsWith("build") ||
            file.startsWith(".htaccess") ||
            file.startsWith(".git") ||
            file.startsWith("package.json") ||
            file.startsWith("yarn.lock") ||
            file.startsWith("node_modules") ||
            file.startsWith("scripts")
          )
      )
      .map(file => fs.remove(file))
  )
  .then(() => fs.remove("index.html"))
  .then(() => fs.readdir("build"))
  .then(items => Promise.all(items.map(item => fs.copy(`build/${item}`, item))))
  // .then(() => fs.remove("index.php"))
  // .then(() => fs.move("index.html", "index.php"))
  .then(() => exec("git add -A ."))
  .then(() => exec('git commit -m "Deployment."'))
  .then(() => exec("git push --set-upstream origin vhub-react-deploy -f"))
  .then(() => exec("git checkout vhub-react"))
  .catch(err => console.log(err));
