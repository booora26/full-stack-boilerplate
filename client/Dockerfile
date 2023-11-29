###################
# BUILD FOR LOCAL DEVELOPMENT
###################

FROM node:18.16-alpine As build

# Create app directory
WORKDIR /app

# Copy application dependency manifests to the container image.
# A wildcard is used to ensure copying both package.json AND package-lock.json (when available).
# Copying this first prevents re-running npm install on every code change.
COPY --chown=node:node package*.json ./


# Install app dependencies using the `npm ci` command instead of `npm install`
RUN npm ci

COPY . .


RUN npm run build

###################
# BUILD FOR PRODUCTION
###################

FROM nginx:1.21-alpine as production

ENV NODE_ENV production

COPY  --from=build /app/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]