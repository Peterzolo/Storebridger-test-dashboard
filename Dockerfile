FROM node:16

# Create app directory
WORKDIR /usr/src/app

RUN npm install --location=global yarn --force

COPY package*.json ./

RUN yarn install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .

EXPOSE 4000
CMD [ "yarn", "start" ]