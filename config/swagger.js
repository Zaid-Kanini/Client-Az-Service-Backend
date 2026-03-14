const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'AZ Cake Order Platform API',
      version: '1.0.0',
      description: 'API documentation for the WhatsApp Cake Ordering Platform',
    },
    servers: [
      { url: '/api', description: 'API base path' },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            email: { type: 'string', format: 'email' },
            name: { type: 'string' },
          },
        },
        Cake: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            name: { type: 'string' },
            description: { type: 'string' },
            price: { type: 'number' },
            image: { type: 'string' },
            category: { type: 'string' },
            weightOptions: { type: 'array', items: { type: 'string' } },
            available: { type: 'boolean' },
          },
        },
        OrderItem: {
          type: 'object',
          properties: {
            cakeId: { type: 'string' },
            name: { type: 'string' },
            quantity: { type: 'integer', minimum: 1 },
            weight: { type: 'string' },
            price: { type: 'number' },
          },
        },
        Order: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            customerName: { type: 'string' },
            phone: { type: 'string' },
            address: { type: 'string' },
            items: { type: 'array', items: { $ref: '#/components/schemas/OrderItem' } },
            total: { type: 'number' },
            deliveryDate: { type: 'string', format: 'date-time' },
            customMessage: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
      },
    },
  },
  apis: ['./routes/*.js'],
};

module.exports = swaggerJsdoc(options);
