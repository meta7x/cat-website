---
title: Servis
---

# Servis Documentation

[Servis](ser.vis.ethz.ch) is the VIS specific microservice registry. It provides 
an overview over the various GRPC-APIs you can use for application development. 

The first parts of this guide helps you use existing VIS APIs via servis.  The
second part ("Becoming a provider") explains how to host your own new VIS API
with servis.

## General

Servis and all APIs published by it use GRPC as communication protocol. We
assume you are familiar with GRPC already. 

## Integration

First clarify what servis API you want to use. All example use the hypothetical
`placeholder` API.

* Get the servis binary from [here](https://ser.vis.ethz.ch/static/servis-cli-linux-amd64). 
* Make it executable: `chmod +x ~/Downloads/servis`
* We assume you can run it via `servis` from now on.

* Add the protocol description file to your project by running `servis add placeholder`
inside the project root directory.

* Add `VIS_CI_SERVIS_DEPENDENCIES: "placeholder"` to your .gitlab-ci-yml

* Specify the protobuf compilation path in your .gitlab-ci.yml. **This variable is programming language specific!**
  You should replace `GO` with your target language (for example `PYTHON`, `CPP`,
  `JAVA`, `RUBY`, `CSHARP`, `OBJC` or `PHP`). You can choose any directory instead
  of `./generated`. For most languages, it's nicer if this directory doesn't
  contain handwritten files. For Python, this will probably have to be your main
  source directory for imports to work.
  Examples are: 
    * `VIS_CI_SERVIS_GO_OUT: ./src/some/path`
    * `VIS_CI_SERVIS_PYTHON_OUT: ./src/some/path`

* Now you can generate everything by running `servis generate` from you project
  directory locally (the one with `.gitlab-ci.yml`). You will see the generated files
  under, for example, `./generated/placeholder/placeholder.pb.go`.  We assume the user
  running the command can execute docker commands (otherwise you will have to
  run the command as root or a priviledged user). *Be patient if you run
  `servis generate` for the first time! It will have to download some
  Docker-Images*

* In order to also generate the code files during build add this snippet to
  the build stage of your .gitlab-ci.yml:
```
build:
  ...
  script:                # this is already present
    - do_servis_generate
    - do_default_build   # this is already present
```

* Commit the protocol description and the gitlab-ci.yml files. **Do not commit the
  generated sources.** The generated sources will be re-generated during compile time 
  in order to always facilitate the most recent version of the APIs you want to 
  consume (and break fast in case of incompatible changes).

Now you can integrate the GRPC calls into your project.

## Runtime Environment variables

Adding servis dependencies will give you certain runtime variables. They will 
always contain the name of the consumed servis in them. (In case of this example 
it's `PLACEHOLDER`).

* `RUNTIME_SERVIS_PLACEHOLDER_API_SERVER`
    * The hostname of the API server you will have to connect to during runtime.
    * ex. `RUNTIME_SERVIS_PLACEHOLDER_API_SERVER`=placeholder-api-host
* `RUNTIME_SERVIS_PLACEHOLDER_API_PORT`
    * The port of the API server
    * ex. `RUNTIME_SERVIS_PLACEHOLDER_API_POR`T=1410
* `RUNTIME_SERVIS_PLACEHOLDER_API_KEY`
    * The authorization key for the API
    * ex. `RUNTIME_SERVIS_PLACEHOLDER_API_KEY`=fhjishfauira


### Get an API key

To control which applications can use the API, there are API keys. A key
is just a very long string, like a password. The client has to send this
key along with every request.

To get a key, you need to add the following to your `.gitlab-ci.yml` in the
`variables` section (if you haven't already):

```
VIS_CI_SERVIS_DEPENDENCIES: 'placeholder-api'
```

If you need access to privileged endpoints, add:

```
VIS_CI_SERVIS_PRIVILEGED_DEPENDENCIES: 'placeholder-api'
```

You won't see the key yourself, but your app will receive it in the
`RUNTIME_SERVIS_PLACEHOLDER_API_KEY` environment variable. How you read this
environment variable depends on your programming language. It's usually best to
do this once, when your application starts up.

### Make a request

This varies a bit depending on your generated programming language, but the
rough steps are:

- Install the official GRPC library
- Import the generated code
- Create a connection (something like `insecure_channel` or `Dial`)
- Create a client object (something like `NewPeopleClient` or `PeopleStub`)
- Prepare request metadata with API key
- Make the request (eg. `client.GetETHPerson(...)`) **with metadata**

It's best if all the preparation (creating client, etc.) is done once in your
app (at startup time). That way you need much less code to actually make
requests.

`vis-pizza` is a good example of a real Go app using the people-api
([connection](https://gitlab.ethz.ch/vis/cat/vis-pizza/blob/b1dde1fca6c51f23b57174eaa9d7dc7e5438a522/main.go#L90)
and
[request](https://gitlab.ethz.ch/vis/cat/vis-pizza/blob/b1dde1fca6c51f23b57174eaa9d7dc7e5438a522/main.go#L109)).
For a Python example see
[Alumni App](https://gitlab.ethz.ch/vis/cat/vis-alumni-app/blob/production/alumniapp/vis_servis_backend.py#L8)
(note: in general, it's probably better to do the preparation at startup time,
not before each request).

There are also small stand-alone official GRPC examples for
[Go](https://github.com/grpc/grpc-go/blob/f0a1202acdc5c4702be05098d5ff8e9b3b444442/examples/helloworld/greeter_client/main.go),
[Python](https://github.com/grpc/grpc/blob/848a749f7afb19c79188c328e44f53fc2f7695e2/examples/python/helloworld/greeter_client.py)
and all the other supported languages.

There's also [official documentation](https://grpc.io/docs/), which introduces
the basics of GRPC and explains in detail how to use GRPC services in your
language.

## Becoming a provider

Up to here, this guide has covered how to consume existing APIs via servis. Now
we look at how to publish your own APIs for others to consume. We assume you
and have read everything above and have the servis CLI installed.

When we used `servis add placeholder` previously, it downloaded the proto files for
`placeholder` into `./servis/placeholder/somenameofprotofile.proto`. To be a provider, you
first have to define your own proto files. Assuming your main proto file is called
`example.proto`, you must save it in `./servis/self/example.proto`. `self` is a
special directory for your projects own protos - what's in here is what gets
published.

To publish your project as a provider:

* Save your own protos into `./servis/self/`
* Add `VIS_CI_SERVIS_IS_PROVIDER "true"` to your .gitlab-ci.yml
* Add `do_servis_publish` after `do_default_deploy` in a deploy stage in
`.gitlab-ci.yml`
  * Ensure this only runs on the production branch, **not staging**

You will need `do_servis_generate` in
`.gitlab-ci.yml` too, just like when consuming services.

That's all it takes to publish a minimal service, but there are a few more
things most services will need.

### Enforcing API keys

Your service almost definitely needs its own set of API keys. These are
generated for you and provided in the `RUNTIME_SERVIS_SELF_KEY` environment
variable. It's critical to note that **API keys are not checked for you**. It's
up to you to decide how clients will pass API keys to you, and how you will
check them. Most services expect a key in the gRPC `authorization` metadata
header.

### Privileged keys

If your service has parts with more sensitive data, which most consumers will
never need, you can limit their accessibility by adding a second set of API
keys. For example, you could restrict access to certain fields or write
operations, to clients with privileged keys only. 

By setting `VIS_CI_SERVIS_HAS_PRIVILEGED_MODE: "true"` you receive another
generated key which is stored in `RUNTIME_SERVIS_SELF_PRIVILEGED_KEY`.

If you are considering privileged keys, it's best to **talk to someone from the
CIT** for advice.

### Documenting your service

You should document:
* A paragraph explaining why and how to use the service in your `proto` files
* API contract directly in your `proto` files
  * How to pass API keys
  * What fields are optional
  * Clarify what each `rpc` method does
* Other very general information about your service in `README.md`

It's also highly encouraged to **add a description line in servis**. This is shown
on the list of services. You can set it with the `VIS_CI_SERVIS_DESCRIPTION`
variable in `.gitlab-ci.yml`.