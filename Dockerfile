# Use the official Node.js 16.x image as the base image
FROM node:16 as builder

# Set the working directory to /app
WORKDIR /app

# Copy the package.json and package-lock.json files to the container
COPY package*.json ./

# Install dependencies
RUN npm install
RUN npm install -g @angular/cli
# Copy the remaining application files to the container
COPY . .

# Build the application
RUN npm run build --prod

# Use the official Nginx image as the base image for serving content
FROM nginx:latest

# Remove the default Nginx configuration file
RUN rm /etc/nginx/conf.d/default.conf

# Copy the custom Nginx configuration file to the container
COPY nginx.conf /etc/nginx/conf.d/

# Copy the built Angular app to the Nginx web root directory
COPY --from=builder /app/dist/my-app /usr/share/nginx/html

# Expose port 80 for the Nginx web server
EXPOSE 80

# Start the Nginx web server in the foreground
CMD ["nginx", "-g", "daemon off;"]
