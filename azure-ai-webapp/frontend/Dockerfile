FROM node:18-alpine

WORKDIR /app

# Create a new React app within the container
RUN npm install -g create-react-app
RUN create-react-app .

# Make the start command in package.json not use interactive mode
# This ensures npm start works properly in a Docker container
RUN sed -i 's/"start": "react-scripts start"/"start": "react-scripts start --disableHostCheck=true --host 0.0.0.0"/' package.json

# Expose port 3000
EXPOSE 3000

# Command to run when container starts
CMD ["npm", "start"]