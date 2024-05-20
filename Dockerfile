FROM node:20

WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the app directory
COPY package*.json ./

RUN npm install
RUN npm install -g nodemon

# Copy the rest of the application code to the app directory
COPY . .

# Expose the port the app runs on
EXPOSE ${PORT}

# Command to run the application
CMD ["nodemon", "index.js"]
