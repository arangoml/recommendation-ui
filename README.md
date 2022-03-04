# watchacados

### Docker
Now dockerized: `docker run -it -p 80:80 --name ArangoFlix cw00dw0rd/arangoml-demo-ui:latest`

### Foxx endpoint is required 
This endpoint will be automatically supplied by Oasis and is using the [movie dataset](https://github.com/arangodb/interactive_tutorials/tree/movie-data) and the [recommendation-demo](https://github.com/arangoml/recommendation-demo) repo for the GraphQL Foxx service.

Once the docker container is running navigate to localhost with your OasisURL supplied as a url parameter, like so:
http://localhost:80/?OasisURL=https://xxxxxxx.arangodb.cloud:8529/_db/movie-demo/ml-demo

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
