#!/bin/bash
source /home/ubuntu/.profile
. ~/.nvm/nvm.sh


# navigate into working directory of project
echo "Starting application..."
cd /home/ubuntu/storebridger-backend

# install node modules
npm install

# create dist build
# npm run build

# start app
pm2 start pm2/production.json
