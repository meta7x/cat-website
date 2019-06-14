---
title: Introduction
---

# VIS App Integration Guide

This guide informs you about how to build apps that integrate well with
the existing VIS infrastructure. If you have any questions, ask
@veenj or put your questions into the `cit_support` channel on the internal VIS Chat.

## Usage
Throughout all guides we will assume that you know the basics of docker.

In the VIS infastructure, we want every app to be based on the same base
image, `base`. The container is currently based on Debian stretch. It
enforces that you specify certain environment variables and allow the Computer
Infractructure Team to deploy certain changes to all containers.

We also provide specialised base images, see the respective repositories for
a detailed documentation. Available images are:

* `base`: Base image without any specialisation

* `nginx`: Custom self-compiled nginx with easy configuration

* `python`: Python 3 runtime

* `gitbook`: Static [website builder](https://www.gitbook.com) using Markdown

See the [VIS Base](/vis-base.md) document on how to interact with the base
image.

## Conventions

### Files

If you want to run your application in production, it will have to satisfy
some constraints.

    fancy_app
    ├── Dockerfile
    ├── README.md
    ├── .gitlab-ci.yml
    ├── src
    │   └── CAT_source.stuff
    └── test-data
        ├── maria.in
        ├── mongo.in
        └── postgres.in

This is the structure that every VIS app should have in order to be able to
run in production and to be easily maintained by VIS members of the future.

Also, you will have to specify certain environment variables and you will get
information on the DB location, deployment path, passwords etc. via environment
variables. These variables are specified below. NEVER hardcode their values.

#### README.md
Document assumptions, deviations from our usual conventions and things that a
sysadmin or fellow developer should know before reading any other of your files.

#### Dockerfile
Package your app. Depend on the latest version of the base image which is
`charlie`. **Do not** specify either `ENTRYPOINT` or `CMD`. Use
[cinit](https://documentation.vis.ethz.ch/cinit.html) to hook your programs into
the container

#### .gitlab-ci.yml
Specify a pipeline to automatically build and deploy the app. See the CI-guide for
the configuration.

#### src
Your actual application should be in the `src/` directory. This is completely
your domain.

#### test-data
You can provide some test data for your application in the directory
test-data/. The given data will be loaded into the databases. See `visdev` repo
for more information on that.

### Branches
These branches should be present:

* `production`: This branch carries the code running in production.
* `staging`: This branch carries the code running in staging.

Apart from this there are no constraints.

### Docker tags
The `production` branch is built into the Docker image tagged `production`.
Analogously for `staging`. There are no other constraints.
