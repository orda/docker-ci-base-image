# docker-ci-base-image

Base image for circleci workflows.

## Image Variants

### Node.js 10

Tags: `latest`, `node-10`

Included software and packages:
* Node.js ^10.0.0
* pip
* awscli
* awsebcli (Elastic Beanstalk CLI)
* npm ^6.0.0
* yarn ^1.0.0
* serverless ^1.0.0

### Node.js 12

Tags: `node-12`

Included software and packages:
* Node.js ^12.0.0
* pip
* awscli
* awsebcli (Elastic Beanstalk CLI)
* npm ^6.0.0
* yarn ^1.0.0
* serverless ^1.0.0


### Node.js 10 with browsers

Tags: `node-10-browsers`

Included software and packages:
* Node.js ^10.0.0
* pip
* awscli
* awsebcli (Elastic Beanstalk CLI)
* npm ^6.0.0
* yarn ^1.0.0
* serverless ^1.0.0
* Chrome
* Firefox
* Java 8*
* Geckodriver

### Node.js 12 with browsers

Tags: `node-12-browsers`

Included software and packages:
* Node.js ^12.0.0
* pip
* awscli
* awsebcli (Elastic Beanstalk CLI)
* npm ^6.0.0
* yarn ^1.0.0
* serverless ^1.0.0
* Chrome
* Firefox
* Java 8*
* Geckodriver

### Android

Tags: `android`

Included software and packages:
* Android SDK 28
* Node.js ^10.0.0
* yarn ^1.0.0
* bundler
* rubygems
