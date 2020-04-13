# Contributing

Make sure to checkout the [HospitalRun Contributing Guide](https://github.com/HospitalRun/hospitalrun/blob/master/.github/CONTRIBUTING.md)

## Setting up the Local Development Environment

1. [Fork](https://help.github.com/en/github/getting-started-with-github/fork-a-repo) this repository
2. Open your favorite command line tool and navigate to the directory you wish to clone this repository to: `cd /path/to/clone`
3. [Clone](https://help.github.com/en/github/creating-cloning-and-archiving-repositories/cloning-a-repository) your fork: `git clone git@github.com:{your username}/hospitalrun-frontend.git`
4. Navigate to the hosptialrun-frontend directory: `cd hospitalrun-frontend`
5. Install dependencies: `yarn`
6. Run the application `yarn start`

### Optionally configure HospitalRun Server

In most cases, this is not needed to contribute to the HospitalRun Frontend Repository. The following instructions are for connecting to HospitalRun Server during development and are not intended to be for production use. For production deployments, see the deployment instructions/

1. Configure [HospitalRun Server](https://github.com/HospitalRun/hospitalrun-server)
2. Start the HospitalRun Development Server
3. Copy the `.env.example` file to `.env`
4. Change the `REACT_APP_HOSPITALRUN_API` variable to point to the HospitalRun Development Server.

### Potential Setup Issues

Some developers have reported the following errors and the corresponding fixes

#### Problem with Project Dependency Tree

```
There might be a problem with the project dependency tree.
It is likely not a bug in Create React App, but something you need to fix locally.
The react-scripts package provided by Create React App requires a dependency:
  "babel-loader": "8.1.0"
Don't try to install it manually: your package manager does it automatically.
However, a different version of babel-loader was detected higher up in the tree:
  /path/to/hospitalrun/node_modules/babel-loader (version: 8.0.6)
Manually installing incompatible versions is known to cause hard-to-debug issues.
If you would prefer to ignore this check, add SKIP_PREFLIGHT_CHECK=true to an .env file in your project.
That will permanently disable this message but you might encounter other issues.
To fix the dependency tree, try following the steps below in the exact order:
  1. Delete package-lock.json (not package.json!) and/or yarn.lock in your project folder.
  2. Delete node_modules in your project folder.
  3. Remove "babel-loader" from dependencies and/or devDependencies in the package.json file in your project folder.
  4. Run npm install or yarn, depending on the package manager you use.
```

To fix this issue, add `SKIP_PREFLIGHT_CHECK=true` to the `.env` file.

## Running Tests and Linter

`yarn test:ci` will run the entire test suite

`yarn test` will run the test suite in watch mode

`yarn lint` will run the linter

`yarn lint:fix` will run the linter and fix fixable errors

## Useful Developer Tools

- [VSCode](https://code.visualstudio.com/)
- [VSCode React Extension Pack](https://marketplace.visualstudio.com/items?itemName=jawandarajbir.react-vscode-extension-pack)
- [React Developer Tools](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi?hl=en)
- [Redux Developer Tools](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd?hl=en)