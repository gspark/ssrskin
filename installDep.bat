CALL npm install --save-dev electron electron-builder electron-devtools-installer electron-rebuild ajv

CALL npm install --save-dev babel-core babel-register babel-plugin-flow-runtime babel-plugin-add-module-exports babel-plugin-dev-expression babel-plugin-transform-class-properties babel-plugin-transform-es2015-classes babel-preset-env babel-preset-stage-0 babel-preset-react babel-preset-react-optimize

CALL npm install --save-dev flow-bin flow-runtime flow-typed

CALL npm install --save-dev webpack webpack-cli webpack-dev-server webpack-merge extract-text-webpack-plugin@next

:: prod
CALL npm install --save-dev webpack-bundle-analyzer

CALL npm install --save-dev concurrently cross-env chalk rimraf detect-port redux-logger style-loader css-loader url-loader file-loader

CALL npm install --save react react-dom react-router-dom react-hot-loader react-redux react-router-redux redux redux-thunk

CALL npm install --save electron-debug font-awesome

CALL npm install --save material-ui@next material-ui-icons
