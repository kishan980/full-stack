## Deployment Prod

```
docker build -t artyst-frontend-container .

aws lightsail push-container-image \
--region ap-southeast-2 \
--service-name artyst-web \
--label artyst-frontend-container \
--image artyst-frontend-container:latest

docker build -t artyst-nginx-container ./nginx

aws lightsail push-container-image \ 
--region ap-southeast-2 \
--service-name artyst-web \
--label artyst-nginx-container \
--image artyst-nginx-container:latest

aws lightsail create-container-service-deployment \
--region ap-southeast-2 \
--service-name artyst-web \
--containers file://containers.json \
--public-endpoint file://public-endpoint.json
```


## Deployment Dev

```
docker build -t artyst-frontend-container .

aws lightsail push-container-image \
--profile artyst-dev \
--region ap-southeast-2 \
--service-name artyst-development-web-frontend-service \
--label artyst-frontend-container \
--image artyst-frontend-container:latest

docker build -t artyst-nginx-container ./nginx

aws lightsail push-container-image \
--profile artyst-dev \
--region ap-southeast-2 \
--service-name artyst-development-web-frontend-service \
--label artyst-nginx-container \
--image artyst-nginx-container:latest

aws lightsail create-container-service-deployment \
--profile artyst-dev \
--region ap-southeast-2 \
--service-name artyst-development-web-frontend-service \
--containers file://containers-dev.json \
--public-endpoint file://public-endpoint.json
```

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app), using the [Redux](https://redux.js.org/) and [Redux Toolkit](https://redux-toolkit.js.org/) template.

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (Webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
