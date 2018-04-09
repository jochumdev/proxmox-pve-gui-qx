async function compile(data, callback) {
    /**
   * Adds sass support for current project.
   * Needed for qx.mobile projects.
   *
   * PreReqs:
   *    - add dependency to project package.json: "runscript": "^1.3.0"
   *    - run npm install in project dir.
   *
   * @param {*} data       : config data from compile.json
   * @param {*} callback   : callback for qxcli.
   */
    debugger;
    const runscript = require('runscript');
    const util = require('util');
    runScript = async function (cmd) {
      return new Promise((resolve) => runscript(cmd, {
          stdio: 'pipe'
        })
        .then(stdio => {
          console.log('Run "%s"', cmd);
          if (stdio.stdout)
            console.log(stdio.stdout.toString());
          if (stdio.stderr)
            console.log(stdio.stderr.toString());
          resolve();
        })
        .catch(err => {
          console.error(err.toString());
          if (err.stdio.stdout)
            console.error(err.stdio.stdout.toString());
          if (err.stdio.stderr)
            console.error(err.stdio.stderr.toString());
          resolve();
        }));
    }
    let cmd = 'sass -C -t compressed -I %1/source/resource/qx/mobile/scss -I %1/source/resource/qx/scss --%3 source/theme/proxmox.ve.mobile/scss:source/resource/proxmox.ve.mobile/css';
    cmd = qx.lang.String.format(cmd, [data.libraries[0], data.applications[0].name]);
    if (!this.argv.watch) {
       cmd = qx.lang.String.format(cmd, ["", "", "update"]);
       await runScript(cmd);
    } else {
      cmd = qx.lang.String.format(cmd, ["", "", "watch"]);
      runScript(cmd);
    }
    callback(null, data);
}