import swaggerJSDoc from 'swagger-jsdoc';

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'COVID 19 Statistics API',
    version: '1.0.0',
    description:
      'Covid 19 Statistics api provides data about the progress of the coronavirus around the world.',

    contact: {
      name: 'Sergio Ordoñez',
    },
  },
  servers: [
    {
      url: 'http://localhost:4000/api',
      description: 'Development server',
    },
    {
      url: 'https://covid-19-statistics-api.herokuapp.com/api',
      description: 'Production server',
    },
  ],
};

const options = {
  swaggerDefinition,

  // Path to the API docs
  apis: ['src/routes/*.ts'],
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
