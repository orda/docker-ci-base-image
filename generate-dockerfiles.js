const fs = require("fs");
const { promisify } = require("util");
const path = require("path");

const NODE_10_VERSION = "10.16.0";
const NODE_12_VERSION = "12.7.0";
const AWS_EB_CLI_VERSION = "3.15.2";
const AWS_CLI_VERSION = "1.16.207";
const NPM_VERSION = "6.10.2";
const YARN_VERSION = "1.17.3";
const SERVERLESS_CLI_VERSION = "1.48.4";
const ANDROID_SDK_VERSION = "28";

const writeFileAsync = promisify(fs.writeFile);
const mkdirAsync = promisify(fs.mkdir);

const DOCKERFILES_FOLDER = "Dockerfiles";
const DOCKERFILE = "Dockerfile";

const NODE_BASE_PATH = "node-";
const ANDOROID_BASE_IMAGE_PATH = "android";

const NODE_BASE_IMAGE_STEP = "FROM circleci/node:";

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

const androidDockerSteps = `FROM circleci/android:api-${ANDROID_SDK_VERSION}

RUN curl -sL https://deb.nodesource.com/setup_10.x | sudo bash -
RUN sudo apt-get update && \\
  sudo apt-get install nodejs rubygems

RUN gem install bundler

RUN curl -o- -L https://yarnpkg.com/install.sh | bash -s -- --version ${YARN_VERSION} && \\
  sudo ln -fs ~/.yarn/bin/yarn /usr/local/bin/yarn && \\
  sudo ln -fs ~/.yarn/bin/yarn /usr/local/bin/yarnpkg
`;

async function writeDockerFile(steps, folder) {
  const baseFolder = path.join(DOCKERFILES_FOLDER, folder);
  await mkdirAsync(baseFolder, { recursive: true });
  await writeFileAsync(path.join(baseFolder, DOCKERFILE), steps.join("\n"));
}

async function generateNodeBaseDockerfile(version) {
  const steps = [`${NODE_BASE_IMAGE_STEP}${version}`, commonDockerSteps];
  const [nodeMajorVersion] = version.split(".");
  await writeDockerFile(steps, `${NODE_BASE_PATH}${nodeMajorVersion}`);
}

async function generateNodeBrowsersDockerfile(version) {
  const steps = [
    `${NODE_BASE_IMAGE_STEP}${version}-browsers`,
    commonDockerSteps
  ];
  const [nodeMajorVersion] = version.split(".");
  await writeDockerFile(steps, `${NODE_BASE_PATH}${nodeMajorVersion}-browsers`);
}

async function generateAndroidBaseDockerfile() {
  const steps = [androidDockerSteps];
  await writeDockerFile(steps, ANDOROID_BASE_IMAGE_PATH);
}

function generateNodeImages(version) {
  return Promise.all([
    generateNodeBaseDockerfile(version),
    generateNodeBrowsersDockerfile(version)
  ]);
}

async function main() {
  await Promise.all([
    generateNodeImages(NODE_10_VERSION),
    generateNodeImages(NODE_12_VERSION),
    generateAndroidBaseDockerfile()
  ]);
}

if (require.main === module) {
  main().catch(error => {
    // eslint-disable-next-line no-console
    console.error(error);
    process.exit(1);
  });
}
