# Blog API Documentation

This document provides a comprehensive overview of the Blog API, its endpoints, functionality, and implementation details.

## Table of Contents
1. [Setup](#setup)
2. [Authentication](#authentication)
3. [Posts](#posts)
4. [Security](#security)
5. [Error Handling](#error-handling)

## Setup

The API is built using Express.js and MongoDB. To run the server:

1. Ensure MongoDB is installed and running or get connection string from mongodb atlas.
2. Set up environment variables in a `.env` file:
   - `DATABASE_URL`: MongoDB connection string
   - `PORT`: Server port (defaults to 3000 if not specified)
   - `JWT_SECRET`: Secret key for JWT signing (not visible in provided code, but necessary for JWT operations must have 32 characters)
3. Run `npm install` to install dependencies.
4. Start the server with `node index.js` or `npm run dev`.

The server uses middleware such as `cookie-parser` for handling cookies and `helmet` for enhanced security.

## Authentication

Authentication is handled using JSON Web Tokens (JWT). The implementation is in `src/middleware/jwt.js` and `src/controllers/authController.js`.

### How to Register and Login

1. To register a new account:
   - Send a POST request to `/api/auth/signup` with your user details (e.g., username, email, password).
   - The server will create a new user account and return a success message.

2. To login:
   - Send a POST request to `/api/auth/login` with your credentials (e.g., email and password).
   - If successful, the server will return a JWT token, typically stored in an HTTP-only cookie.

### Accessing Posts

After successful authentication, you can access the post routes. However, if you're not authenticated, you won't be able to access any post routes. This is because:

1. The post routes are protected by the `verifyToken` middleware (as seen in `index.js`).
2. This middleware checks for a valid JWT token in the request.
3. If no token is present or the token is invalid, the middleware will return an error, preventing access to the post routes.

This ensures that only authenticated users can view, create, update, or delete posts, maintaining the security and privacy of the blog content.

### Endpoints:

- `POST /api/auth/signup`: Create a new user account.
- `POST /api/auth/login`: Log in and receive a JWT.
- `POST /api/auth/logout`: Log out (invalidate the JWT).

The JWT is stored in an HTTP-only cookie for security (based on the use of `cookie-parser`).

## Posts

Posts can be created, read, updated, and deleted. All post operations require authentication, which is enforced by the `verifyToken` middleware.

### Endpoints:

- `GET /api/post`: Retrieve all posts, sorted by creation date (newest first). Supports optional query parameters for filtering:
  - `category`: Filter posts by category (e.g., `?category=SPORTS`)
  - `author`: Filter posts by author ID (e.g., `?author=123456789`)
- `GET /api/post/:id`: Retrieve a single post by ID.
- `POST /api/post`: Create a new post.
- `PUT /api/post/:id`: Update an existing post.
- `DELETE /api/post/:id`: Delete a post.

### Post Schema:

- `title`: String (required)
- `content`: String (required)
- `category`: String (enum: "SPORTS", "POLITICS", "ENTERTAINMENT", "GENERAL", "FOREIGN", "FOOD", "FASHION", default: "GENERAL")
- `author`: ObjectId (reference to User model, required)
- `timestamps`: Automatically managed createdAt and updatedAt fields

### Search Queries:

The `GET /api/post` endpoint supports search queries to filter posts:

1. Category Filter:
   - Use `?category=CATEGORY_NAME` to filter posts by category.
   - The category name is case-insensitive and will be converted to uppercase.
   - Example: `GET /api/post?category=sports` will return all posts in the SPORTS category.

2. Author Filter:
   - Use `?author=AUTHOR_ID` to filter posts by the author's ID.
   - Example: `GET /api/post?author=123456789` will return all posts by the author with ID 123456789.

3. Combined Filters:
   - You can combine both filters using the `&` operator.
   - Example: `GET /api/post?category=politics&author=123456789` will return all POLITICS posts by the author with ID 123456789.

The search results are always sorted by creation date, with the newest posts appearing first.

Note: Only the author of a post can update or delete it. This is enforced in the controller functions.

## Security

1. JWT for authentication
2. HTTP-only cookies (used for storing JWT)
3. Helmet middleware for setting various HTTP headers
4. MongoDB connection uses `useNewUrlParser` and `useUnifiedTopology` options for up-to-date and reliable connection method
5. Rate limiting middleware to prevent abuse:
   - Implemented using `express-rate-limit`
   - Limits signup requests to 5 per 15 minutes from a single IP address
   - Helps prevent brute force attacks and protects against potential DoS attacks

## Error Handling

The API includes error handling for various scenarios:

- Invalid requests (e.g., missing required fields)
- Unauthorized access attempts
- Not found errors (e.g., post not found)
- Internal server errors

Errors are logged to the console and appropriate error responses are sent to the client.

For more detailed information on request/response formats and specific error handling, please refer to the source code in the `controllers` and `routes` directories.

## Additional Notes

- The API follows RESTful conventions for endpoint naming and HTTP method usage.
- Mongoose is used as an ODM (Object Document Mapper) for MongoDB, providing schema validation and query building.
- The codebase is organized into separate files for routes, controllers, and models, promoting modularity and maintainability.
