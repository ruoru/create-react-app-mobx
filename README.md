# create-react-app-mobx

use create-react-app for build mobx project.

## What did I do？
1. add mobx in project.
2. let vscode edit mobx code no waring.
3. add antd, async/await, scss loader, and my environment.
4. import outside /src files

## Issue
If you are interested in this project, you can give me feedback in the issue.
如果你有任何疑问，请在 issue 提交给我，我会尽心帮你解答。

## How to get decorators in create-react-app

Ok, so here’s what you do when setting up a new React app:

1. Run create-react-app. This creates a new app with the official configuration.

2. Run npm run eject. This moves files around and makes your app’s configuration accessible.

3. Run npm install --saveDev babel-plugin-transform-decorators-legacy. This installs the Babel plugin for decorators. It’s called legacy even though it’s a feature from the far future.

4. Open package.json, find the "babel" section (line 78 for me), and add 4 lines so it looks like this:

```json
//package.json
"babel": {
  "plugins": [
    "transform-decorators-legacy"
  ],
  "presets": [
    "react-app"
  ]
}
```

5. Run npm install --save mobx mobx-react. This installs MobX.

You’re ready to go. Happy hacking! ?

## ExperimentalDecorators not recognized in vscode

Steps to Reproduce:

1. Create Typescript file with decorators (like mobx).

2. Enable experimentalDecorators in tsconfig.json.

```json
{
  "compilerOptions": {
    "experimentalDecorators": true
  }
}
```


