FROM debian:10 as bundler

WORKDIR /app
ENV NODE_ENV production

ENV NODE_VERSION=14.15.3
RUN apt-get update && apt-get install -y curl python3 g++ make python3-pip
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
ENV NVM_DIR=/root/.nvm
RUN . "$NVM_DIR/nvm.sh" && nvm install ${NODE_VERSION}
RUN . "$NVM_DIR/nvm.sh" && nvm use v${NODE_VERSION}
RUN . "$NVM_DIR/nvm.sh" && nvm alias default v${NODE_VERSION}
ENV PATH="/root/.nvm/versions/node/v${NODE_VERSION}/bin/:${PATH}"

RUN npm install -g yarn
RUN yarn global add pkg
# RUN yarn global add nexe

CMD ["/bin/bash"]
EXPOSE 3000
