FROM circleci/node:10.15.3-browsers

RUN sudo apt-get update && \
  sudo apt-get install python3-dev

# Install pip
RUN curl https://bootstrap.pypa.io/get-pip.py -o ~/get-pip.py && \
  python3 ~/get-pip.py --user && \
  rm ~/get-pip.py && \
  sudo ln -s ~/.local/bin/pip /usr/local/bin/pip

# Install AWS EB CLI
RUN pip install awsebcli==3.15.0 --user && sudo ln -s ~/.local/bin/eb /usr/local/bin/eb

# Install AWS cli
RUN pip install awscli==1.16.140 --user && sudo ln -s ~/.local/bin/aws /usr/local/bin/aws

# Update npm
RUN sudo npm i -g npm@6.9.0

# Update yarn
RUN curl -o- -L https://yarnpkg.com/install.sh | bash -s -- --version 1.15.2 && \
  sudo ln -fs ~/.yarn/bin/yarn /usr/local/bin/yarn && \
  sudo ln -fs ~/.yarn/bin/yarn /usr/local/bin/yarnpkg

# Install serverless-cli
RUN sudo npm i -g serverless@1.40.0
