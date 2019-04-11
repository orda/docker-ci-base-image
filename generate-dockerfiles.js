const fs = require("fs");
const { promisify } = require("util");
const path = require("path");

const NODE_10_VERSION = "10.15.3";
const AWS_EB_CLI_VERSION = "3.15.0";
const AWS_CLI_VERSION = "1.16.140";
const NPM_VERSION = "6.9.0";
const YARN_VERSION = "1.15.2";
const SERVERLESS_CLI_VERSION = "1.40.0";

const writeFileAsync = promisify(fs.writeFile);
const mkdirAsync = promisify(fs.mkdir);

const DOCKERFILE = "Dockerfile";
const NODE_10_BASE_PATH = "node-10";
const NODE_10_BROWERS_PATH = `${NODE_10_BASE_PATH}-browsers`;

const NODE_10_BASE_IMAGE_STEP = `FROM circleci/node:${NODE_10_VERSION}`;
const NODE_10_BROWSERS_IMAGE_STEP = `${NODE_10_BASE_IMAGE_STEP}-browsers`;

const commonDockerSteps = `
RUN sudo apt-get update && \\
  sudo apt-get install python3-dev

# Install pip
RUN curl https://bootstrap.pypa.io/get-pip.py -o ~/get-pip.py && \\
  python3 ~/get-pip.py --user && \\
  rm ~/get-pip.py && \\
  sudo ln -s ~/.local/bin/pip /usr/local/bin/pip

# Install AWS EB CLI
RUN pip install awsebcli==${AWS_EB_CLI_VERSION} --user && \\
  sudo ln -s ~/.local/bin/eb /usr/local/bin/eb

# Install AWS cli
RUN pip install awscli==${AWS_CLI_VERSION} --user && \\
  sudo ln -s ~/.local/bin/aws /usr/local/bin/aws

# Update npm
RUN sudo npm i -g npm@${NPM_VERSION}

# Update yarn
RUN curl -o- -L https://yarnpkg.com/install.sh | bash -s -- --version ${YARN_VERSION} && \\
  sudo ln -fs ~/.yarn/bin/yarn /usr/local/bin/yarn && \\
  sudo ln -fs ~/.yarn/bin/yarn /usr/local/bin/yarnpkg

# Install serverless-cli
RUN sudo npm i -g serverless@${SERVERLESS_CLI_VERSION}
`;

async function writeDockerFile(steps, folder) {
  await mkdirAsync(folder, { recursive: true });
  await writeFileAsync(path.join(folder, DOCKERFILE), steps.join("\n"));
}

async function generateNode10BaseDockerfile() {
  const steps = [NODE_10_BASE_IMAGE_STEP, commonDockerSteps];
  await writeDockerFile(steps, NODE_10_BASE_PATH);
}

async function generateNode10BrowsersDockerfile() {
  const steps = [NODE_10_BROWSERS_IMAGE_STEP, commonDockerSteps];
  await writeDockerFile(steps, NODE_10_BROWERS_PATH);
}

async function main() {
  await Promise.all([
    generateNode10BaseDockerfile(),
    generateNode10BrowsersDockerfile()
  ]);
}

if (require.main === module) {
  main().catch(error => {
    // eslint-disable-next-line no-console
    console.error(error);
    process.exit(1);
  });
}
