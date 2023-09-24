# Customer API

This project is a simple REST API for managing customer information. It allows for creating, retrieving, and deleting customer records. The API is built using Express for handling HTTP requests, SQLite as an in-memory database, and Axios for making HTTP requests to external APIs.

## Features

- Create, retrieve, and delete customer records.
- (Currently under construction) Retrieve additional business information using an external API when provided with a business ID.

## Getting Started

1. Clone this repository.
2. Navigate to the project directory and run `npm install` to install dependencies.
3. Run `npm start` to start the server. The server will be running on `http://localhost:3000`.

## API Endpoints

- POST `/customers`: Create a new customer.
- GET `/customers`: Retrieve a list of all customers.
- GET `/customers/:id`: Retrieve a specific customer by ID.
- DELETE `/customers/:id`: Delete a specific customer by ID.

## Deployment to AWS (Serverless)

If this application were to be deployed to AWS using serverless resources, several AWS services and considerations would be involved:

### AWS Services:

1. **AWS Lambda**: To host the Express application.
2. **Amazon API Gateway**: To expose the Lambda function as a RESTful API.
3. **AWS DynamoDB**: As a replacement for the in-memory SQLite database, offering persistence and scalability.
4. **AWS IAM**: For setting up the necessary roles and permissions.
5. **AWS CloudWatch**: For logging and monitoring.

### Considerations:

- **Cold Starts**: AWS Lambda functions can experience cold starts, which may introduce latency. Optimization strategies, such as provisioned concurrency, can be considered.
- **Statelessness**: Lambda functions are stateless, so the application should not rely on maintaining state between invocations.
- **Database Connection**: Connection management with DynamoDB would be different compared to SQLite. Connection pooling is not relevant in a serverless environment.
- **Environment Variables**: Environment variables such as API keys and configuration should be managed using AWS Lambda environment variables or AWS Systems Manager Parameter Store.
- **Scaling**: Serverless architecture automatically scales, but attention should be paid to the scaling behavior of DynamoDB and any rate limiting on external APIs.

