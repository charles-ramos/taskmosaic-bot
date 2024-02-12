FROM node:18-alpine

RUN mkdir -p /usr/src/app/bot
# Create app directory
WORKDIR /usr/src/app

ENV TG_BOT_TOKEN=6781477012:AAHkAjA--S0k9TvlaTQMYSGU4RA1OOXSNvU
ENV BACK4APP_ID=F4ZrOoYJ1C7k1DGpIz8VxokPM1WDYs8GoY0CqBOt
ENV BACK4APP_JS_KEY=i0KOk8Njs9BQaTWCyG3xEWMoVJDo8zSPWFGdzkIS
ENV BACK4APP_MASTER_KEY=qbQkVvzGCr60O5aZeMhG0K7IQKrcCk29tuRuGlWV

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# COPY package*.json ./
COPY . .

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .


EXPOSE 3000

CMD [ "node", "./bot/index.js" ]