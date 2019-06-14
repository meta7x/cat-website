---
title: "CI"
---


# Interface & CI
Note: This document might still be subject to change. Check back frequently,
and if your application stops working, check here if some variables have been
changed.

Any service used by your app (Databases, LDAP, etc) are provided by
environment variables. You must not hardcode any values.

## Basic Setup

Usually a sysadmin should create the repository for you in order to provide you 
with the default configuration and setup. If for any reason your project was created
in a different way please follow the steps below. 

1. Request a sysadmin in the `cit_support` channel to "add the `vis-default-runner` to your project". They'll provide you with a so called runner that can execute your build as soon as you pushed to Gitlab.
2. Create a `staging` as well as `production` branch in your repository
3. (optional) set the `staging` branch as "default branch" in your Gitlab repository
4. (optional) set the `production` branch as "protected" in your Gitlab repository
5. (optional) default branches like `master` 
6. Create a Dockerfile for your project. The Dockerfile should contain all dependencies that are needed by your project at runtime. For dependencies during compile time you should check out docker's [Multistage Builds](https://docs.docker.com/develop/develop-images/multistage-build/)
4. Create the `.gitlab-ci.yml` config file. It will be used by `visdev` for developer's testing as well as our automatic deployment system.

In order to configure your repository you have to provide certain information to the 
build system. You can also request resources in the same manner. 

First set the mandatory values:

* `VIS_CI_APP_NAME` an identifying name for your application. Name this after
the git repository unless you have a good reason to deviate. It has to
match `[a-zA-Z][-a-zA-Z0-9]*`
    * Example: `myapp`
* `VIS_CI_DEPLOYMENT_SUBDOMAIN` the name of the subdomain your application is
to be deployed to. This needs to be a valid DNS identifier.
    * Example: `mywebapp`

   Then your app will end up at mywebapp.[s]vis.ethz.ch, depending on staging or
   production.

If you want, set some optional variables:

* `VIS_CI_DEPLOYMENT_PATH`: The path in that the app has to be deployed.
  **This has not been implemented yet.**
    * Default: `/`
* `VIS_CI_REPLICAS`: The number of instances that get crated for this app. You should 
  always have more than one instance running since the production environment has to be 
  able to destroy any running instances of your application at any time in order to 
  perform loadbalancing or updates.
    * Default: 1
* `VIS_CI_ADDITIONAL_DEPLOYMENT_SUBDOMAINS`: Additional subdomains this
  deployment should be deployed to. Must be formatted as a space-separated
  list of subdomains like this: `"sub-1 sub-2 sub3"`.
    * Default: `""`


Your `.gitlab-ci.yml` now at least looks like this:
```yaml
variables:
  VIS_CI_APP_NAME: "myapp"
  VIS_CI_DEPLOYMENT_SUBDOMAIN: "webapp"
```

From now you can start configuring the environment to the needs of your application.

## Base image integration

### Default Environment Variables

The information you provided to the build system will result in certain runtime 
information for your application. 

At runtime you always have the following variables available:

* DEPLOYMENT\_DOMAIN
    * The FQDN of the app
    * ex. DEPLOYMENT\_DOMAIN=myapp.svis.ethz.ch
* DEPLOYMENT\_ENDPOINT
    * Same as VIS\_CI\_DEPLOYMENT\_PATH
* DEPLOYMENT\_NAME
    * Same as VIS\_CI\_APP\_NAME
* DEPLOYMENT\_USER\_GROUP
    * Access control by VIS groups
    * This has not been implemented yet
* RUNTIME\_VIS\_STATIC\_URL
    * The URL of the VIS Content Delivery server
    * ex. `RUNTIME_VIS_STATIC_URL=https://vis-static.vis.ethz.ch`

To enable any of the services below, put the specific variable name into your
`.gitlab-ci.yml` file (below `VIS_CI_APP_NAME`, etc). The provided variables are
then present at runtime.

### PostgreSQL
Requires SysAdmin setup.
You specify `VIS_CI_ENABLE_POSTGRES: "true"`. Note that "true" is a string and needs to be in quotes. We provide:

* `RUNTIME_POSTGRES_DB_SERVER`
    * Hostname of the Postgres DB
    * ex. `RUNTIME_POSTGRES_DB_SERVER=postgres.vis.ethz.ch`
* `RUNTIME_POSTGRES_DB_PORT`
    * Port of the Postgres DB
    * ex. `RUNTIME_POSTGRES_DB_PORT=5432`
* `RUNTIME_POSTGRES_DB_NAME`
    * Name of the Postgres database
    * ex. `RUNTIME_POSTGRES_DB_NAME=vis_myapp_db_prod`
* `RUNTIME_POSTGRES_DB_USER`
    * The User for the Postgres DB
    * ex. `RUNTIME_POSTGRES_DB_USER=docker`
* `RUNTIME_POSTGRES_DB_PW`
    * The password for the Postgres user
    * ex. `RUNTIME_POSTGRES_DB_PW=hunter2`

### MariaDB
Requires SysAdmin setup.
You specify `VIS_CI_ENABLE_MARIADB: "true"`. Note that "true" is a string and needs to be in quotes. We provide:

* `RUNTIME_MARIA_DB_SERVER`
    * Hostname of the MariaDB
    * ex. `RUNTIME_MARIA_DB_SERVER=maria.vis.ethz.ch`
* `RUNTIME_MARIA_DB_PORT`
    * Port of the MariaDB
    * ex. `RUNTIME_MARIA_DB_PORT=3306`
* `RUNTIME_MARIA_DB_NAME`
    * Name of the MariaDB database
    * ex. `RUNTIME_MARIA_DB_NAME=vis_myapp_db_prod`
* `RUNTIME_MARIA_DB_USER`
    * The User for the MariaDB
    * ex. `RUNTIME_MARIA_DB_USER=docker`
* `RUNTIME_MARIA_DB_PW`
    * The password for the mariadb user
    * ex. `RUNTIME_MARIA_DB_PW=hunter2`

### Minio Object Storage
Requires SysAdmin setup.
You specify `VIS_CI_ENABLE_MINIO: "true"`. Note that "true" is a string and needs to be in quotes. We provide:

* `RUNTIME_MINIO_SERVER`
    * Hostname of the object storage
    * ex. `RUNTIME_MINIO_SERVER=minio.vis.ethz.ch`
* `RUNTIME_MINIO_URL`
    * URL of the object storage
    * ex. `RUNTIME_MINIO_URL=https://synology.vis.ethz.ch:9000`
* `RUNTIME_MINIO_BUCKET_NAME`
    * The name of the bucket to use
    * ex. `RUNTIME_MINIO_BUCKET_NAME=vis-myapp-staging`
* `RUNTIME_MINIO_ACCESS_KEY`
    * Access key og the object storage
    * ex. `RUNTIME_MINIO_ACCESS_KEY=BKIKJAA5BMMU2RHO6IBB"`
* `RUNTIME_MINIO_SECRET_KEY`
    * Secret key of the object storage
    * ex. `RUNTIME_MINIO_ACCESS_KEY=V7f1CwQqAcwo80UEIJEjc5gVQUSSx5ohQ9GSrr12"`

### MongoDB
Requires SysAdmin setup.
You specify `VIS_CI_ENABLE_MONGODB: "true"`. Note that "true" is a string and needs to be in quotes. We provide:

* `RUNTIME_MONGO_DB_SERVER`
    * The hostname of the MongoDB
    * ex. `RUNTIME_MONGO_DB_SERVER=db.vis.ethz.ch`
* `RUNTIME_MONGO_DB_PORT`
    * The port of the MongoDB
    * ex. `RUNTIME_MONGO_DB_PORT=1234`
* `RUNTIME_MONGO_DB_NAME`
    * The name of the MongoDB
    * ex. `RUNTIME_MONGO_DB_NAME=docker`
* `RUNTIME_MONGO_DB_USER`
    * The User for the MongoDB
    * ex. `RUNTIME_MONGO_DB_USER=docker`
* `RUNTIME_MONGO_DB_PW`
    * The password for the MongoDB user
    * ex. `RUNTIME_MONGO_DB_PW=hunter2`

### VIS LDAP
Values for the new VIS internal LDAP.
If you specify `VIS_CI_ENABLE_VIS_LDAP: "true"`. Note that "true" is a string and needs to be in quotes. 
We provide

* `RUNTIME_VIS_LDAP_URLS`
    * URL of the ldap servers. Space separated list
    * ex. `RUNTIME_VIS_LDAP_URLS=ldap://ldap-eth-vis-dev`
* `RUNTIME_VIS_LDAP_SERVERS`
    * Hostname of the LDAP servers. Space separated list
    * ex. `RUNTIME_VIS_LDAP_SERVERS=ldap1 ldap2 ldap3`
* `RUNTIME_VIS_LDAP_PORT`
    * Port of the LDAP servers
    * ex. `RUNTIME_VIS_LDAP_PORT=123`
* `RUNTIME_VIS_LDAP_PROTOCOL`
    * LDAP protocol
    * ex. `RUNTIME_VIS_LDAP_PROTOCOL=ldaps`
* `RUNTIME_VIS_LDAP_BIND_DN`
    * The bind DN for the LDAP
    * ex. `RUNTIME_VIS_LDAP_BIND_DN=cn=admin,dc=ldap,dc=vis,dc=eth,dc=ch`
* `RUNTIME_VIS_LDAP_BIND_PW`
    * The password for the LDAP
    * ex. `RUNTIME_VIS_LDAP_BIND_PW=visadmin`
* `RUNTIME_VIS_LDAP_BASE_DN`
    * The ldap base DN
    * ex. `RUNTIME_VIS_LDAP_BASE_DN=dc=ldap,dc=vis,dc=eth,dc=ch`
* `RUNTIME_VIS_LDAP_SEARCH_BASE`
    * The ldap search base
    * ex. `RUNTIME_VIS_LDAP_SEARCH_BASE=ou=stuff,dc=ldap,dc=vis,dc=eth,dc=ch`

### ETH LDAP
Values for the ETH LDAP - highly privileged endpoint - you need good reasons to
use this! You specify `VIS_CI_ENABLE_ETH_LDAP: "true"`. Note that "true" is a string and needs to be in quotes. We provide:

* `RUNTIME_ETH_LDAP_URLS`
    * URL of the eth ldap servers. Space separated list
    * ex. `RUNTIME_ETH_LDAP_URLS=ldap://ldap-eth-vis-dev`
* `RUNTIME_ETH_LDAP_SERVERS`
    * Hostname of the LDAP servers. Space separated list
    * ex. `RUNTIME_ETH_LDAP_SERVERS=ldap1 ldap2 ldap3`
* `RUNTIME_ETH_LDAP_PORT`
    * Port of the LDAP servers
    * ex. `RUNTIME_ETH_LDAP_PORT=123`
* `RUNTIME_ETH_LDAP_PROTOCOL`
    * LDAP protocol
    * ex. `RUNTIME_ETH_LDAP_PROTOCOL=ldaps`
* `RUNTIME_ETH_LDAP_BIND_DN`
    * The bind DN for the LDAP
    * ex. `RUNTIME_ETH_LDAP_BIND_DN=cn=admin,dc=ldap,dc=vis,dc=eth,dc=ch`
* `RUNTIME_ETH_LDAP_BIND_PW`
    * The password for the LDAP
    * ex. `RUNTIME_ETH_LDAP_BIND_PW=visadmin`
* `RUNTIME_ETH_LDAP_SEARCH_BASE`
    * The ldap search base
    * ex. `RUNTIME_ETH_LDAP_SEARCH_BASE=dc=docker,dc=ldap,dc=vis,dc=eth,dc=ch`

### Mail Transmission
Requires SysAdmin setup. Access to the VIS Mail server.
Please provide a good reason to use this instead of the API.
You specify `VIS_CI_ENABLE_SMTP: "true"`. Note that "true" is a string and needs to be in quotes. We provide:

* `RUNTIME_SMTP_SERVER`
    * The hostname of the Mail server.
    * ex. `RUNTIME_SMTP_SERVER=mail.vis.ethz.ch`
* `RUNTIME_SMTPS_PORT`
    * The SMTPS port for the mail server
    * ex. `RUNTIME_SMTPS_PORT=465`
* `RUNTIME_SMTP_STARTTLS_PORT`
    * The STARTTLS port for the mail server
    * ex. `RUNTIME_SMTP_STARTTLS_PORT=587`
* `RUNTIME_SMTP_USER`
    * The SMTP user that has to be used for login.
    * ex. `RUNTIME_SMTP_USER=gitlab`
* `RUNTIME_SMTP_PW`
    * The imap password that has to be used for login.
    * ex. `RUNTIME_SMTP_PW=1234`

The mail server enforces rate limits on the number of sent messages:

* Max. 30 mails per minute

* Max. 10 recipients (including CC and BCC) per mail

### Mail Recival
Requires SysAdmin setup. Access to the VIS Mail server.
Please provide a good reason to use this instead of the API.
You specify `VIS_CI_ENABLE_IMAP: "true"`. Note that "true" is a string and needs to be in quotes. We provide:

* `RUNTIME_IMAP_SERVER`
    * The hostname of the Mail server.
    * ex. `RUNTIME_IMAP_SERVER=mail.vis.ethz.ch`
* `RUNTIME_IMAPS_PORT`
    * The IMAP port for the mail server
    * ex. `RUNTIME_IMAP_PORT=465`
* `RUNTIME_IMAP_STARTTLS_PORT`
    * The STARTTLS port for the mail server
    * ex. `RUNTIME_IMAP_PORT=465`
* `RUNTIME_IMAP_USER`
    * The imap user that has to be used for login.
    * ex. `RUNTIME_IMAP_USER=gitlab`
* `RUNTIME_IMAP_PW`
    * The imap password that has to be used for login.
    * ex. `RUNTIME_IMAP_PW=1234`

### Auth proxy

Only allow active VIS members to access your app. If you enable the proxy we
will show a login window before allowing access to your app. Your app then only
receives requests from authenticated VIS actives. A header with their username
and groups is added to each request (see [auth-proxy
documentation](https://gitlab.ethz.ch/vis/cit/auth-proxy) for more
information).

You can configure the proxy using the following CI variables:

* `VIS_CI_ENABLE_PROXY`
    * Enables the proxy for your app
* `VIS_CI_PROXY_ACCEPTED_GROUPS`
    * Restrict access to your app only to users in the list of space-separated groups

When these are set, any authenticated request will contain these headers:

* `X-Vis-Username` is set the username of the authenticated person
* `X-Vis-Groups` is set multiple times, once for each group the user is in

### Persistent Volumes
Requires SysAdmin setup. Get a persistent volume mounted
into your container.  If you specify `VIS_CI_ENABLE_VOLUME: "true"`, we will
mount a volume at `/data` which you can use to store files persistently. Note
that "true" is a string and needs to be in quotes.  The default storage
capacity is 100 Mi, to increase it specify `VIS_CI_VOLUME_CAPACITY: "200Mi"`.

### Vislib
Access to the legacy vislib. Usage requires sysadmin approval. If you
specify `VIS_CI_ENABLE_VISLIB` we provide:

* `RUNTIME_VISLIB_MARIADB_HOST`
* `RUNTIME_VISLIB_PEOPLE_DB_USER`
* `RUNTIME_VISLIB_PEOPLE_DB_NAME`
* `RUNTIME_VISLIB_PEOPLE_DB_PW`
* `RUNTIME_VISLIB_TRANSLATIONS_DB_USER`
* `RUNTIME_VISLIB_TRANSLATIONS_DB_NAME`
* `RUNTIME_VISLIB_TRANSLATIONS_DB_PW`
* `RUNTIME_VISLIB_INFORUM_DB_USER`
* `RUNTIME_VISLIB_INFORUM_DB_NAME`
* `RUNTIME_VISLIB_INFORUM_DB_PW`
* `RUNTIME_VISLIB_INFORUMSTATS_DB_USER`
* `RUNTIME_VISLIB_INFORUMSTATS_DB_NAME`
* `RUNTIME_VISLIB_INFORUMSTATS_DB_PW`
* `RUNTIME_VISLIB_VISAPI_DB_USER`
* `RUNTIME_VISLIB_VISAPI_DB_NAME`
* `RUNTIME_VISLIB_VISAPI_DB_PW`

### Probes
Your container will constantly be monitored by the system. As soon as it is not
longer returning a  HTTP status code of `200 - OK` it will be restarted.
**Watch out:** If your root URL (`/`) specifies something like a
`301 - Moved Permanently` the probe will fail and your container will
be restarted.

There are two kinds of probes:

* Readiness: executed once to verify the successfull startup of your container.
* Liveness: executed every few seconds in order to check the container status.

It's a good idea to remove the path of the liveness probe from access logs and
so on.

* `VIS_CI_READINESS_PROBE_PATH`: The relative path that will be used for the
  readiness probe (if the path does not respond with HTTP status code 200 the
  container will be restarted. Default in staging: "/"
* `VIS_CI_READINESS_PROBE_INITIAL_DELAY`: The timeout for the first readiness
  probe in seconds. You should increase this value if you have a long setup
  phase in the container. Default in staging: "10"
* `VIS_CI_LIVENESS_PROBE_PATH`: The relative path that will be used for the
  liveness probe (if the path does not respond with HTTP status code 200 the
  container will be restarted. Default in staging: "/"
* `VIS_CI_LIVENESS_PROBE_INITIAL_DELAY`: The timeout for the first liveness
  probe in seconds. You should increase this value if you have a long setup
  phase in the container. Default in staging: "20"

### Additional options
Please only change those values if your really know what you're doing.

* `VIS_CI_REPLICAS`: The number of containers that get created for your app.
  Default: "1"
* `VIS_CI_MAX_MEMORY`: The maximum memory in megabyte that the app is allowed
  to allocate. Default: "256"
* `VIS_CI_CPU_SHARES`: Number of cores reserved for the app in per mille.
  Default: "100"
* `VIS_CI_MAX_CPU_SHARES`: Number of cores the app may use at maximum in per
  mille. Default: "200"
* `VIS_CI_HAVE_MOD_NGINX`: Export nginx metrics via prometheus. Default: "false"
* `VIS_CI_DOCKER_CACHE`: Don't use the Docker cache for building this image.
  Watch out this should only be used when you have a good reason since it
  significantly increases the build time.

## Servis

[Servis](https://ser.vis.ethz.ch) is the VIS specific microservice registry. It
provides an overview over the various GRPC-APIs you can use for application
development. 

You can use servis as a consumer (connect to existing VIS APIs), or as a
provider (host a new VIS API). To integrate servis in your project you use
various variables. There's more info on the servis tab.

## Configure the Pipeline

The pipeline defines how your app is build and different steps can be added e.g. 
in order test your Application. 

Usually you should have a example pipeline in your repository (if a sysadmin 
configured it for you).
For an example pipeline you can copy the following code to your `.gitlab-ci.yml` 
below the variables you have already set:

```yaml
stages:
  - build
  - deploy
  - cleanup

build:
  tags:
    - docker-runner
  stage: build
  script:
    - do_default_build
  only:
    refs:
      - staging
      - production

deploy:
  tags:
    - docker-runner
  stage: deploy
  environment:
    name: $VIS_CI_APP_NAME-$CI_COMMIT_REF_NAME
    url: https://$VIS_CI_DEPLOYMENT_SUBDOMAIN.$VIS_CI_DEPLOYMENT_DOMAIN
  script:
    - do_deployment
  only:
    refs:
      - staging
      - production

cleanup:
  tags:
    - docker-runner
  stage: cleanup
  script:
    - do_cleanup
  when: manual
  only:
    refs:
      - staging
      - production

.auto_devops: &auto_devops |
  git clone --depth 1 git@gitlab.ethz.ch:vis/cit/ci-framework.git
  source ci-framework/ciscript.sh

before_script:
  - docker info
  - *auto_devops
```
To learn what the functions `do_default_build`, `do_deployment`, etc. are doing
have a look at
[here](https://gitlab.ethz.ch/vis/cit/ci-framework/blob/master/ciscript.sh)
where all the functions are defined. If you have to package your app
differently, replace `do_default_build` by your commands. This is discouraged
because your app won't be fixed if the build commands change.

## Deprecated / risky variables

You usually don't need to set any of those variables. However we provide you
with some information about them in case you find them "in the wild".

* `VIS_CI_IMAGE_NAME`: The name that the Docker Image for your application will
  have, prefixed with `cit_cat/`. Choose the same name as your git repository
  unless you have a very good reason to deviate.
    * Example: `cit_cat/myapp`
* `VIS_CI_DEPLOYMENT_DOMAIN`: The domain in which the app should be defined.
    * Default `svis.ethz.ch`
* `VIS_CI_DEPLOYMENT_ENVIRONMENT`: The enviroment in which the app shall be
  deployed.
    * Default: `staging`

## Special Configurations
Your app might need some special environment variables. You can provide them by
assigning values to the envVariables array. **Do not store secrets in your
repository!**. If you need secret variables request their creation in the
`cit_support` channel.

An envVariables array has to be placed in the `.auto_devops` part of the CI and could look something like this:

```
.auto_devops: &auto_devops |
  export VIS_CI_HELM_EXTRA_ARGS="\
    --set envVariables[0].name=EXAMPLE_VARIABLE \
    --set envVariables[0].value=yes \
    --set envVariables[1].name=EXAMPLE_SECRET \
    --set envVariables[1].secretName=my-funny-secret \
    --set envVariables[1].secretKey=value \
    "

  git clone --depth 1 git@gitlab.ethz.ch:vis/cit/ci-framework.git
  ....
```

Afterwards the normal git clone is executed.
