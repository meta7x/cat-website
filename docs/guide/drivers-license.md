---
title: "Driver's License"
---

# CIT Driver's License

This guide will give you an overview of the CIT infrastructure - hopefully enough to get you started working with the CIT. You are going to deploy a simple Hello World application onto our staging infrastructure. That in itself is a simple task, but this guide will also provide a lot of background information on what happens "under the hood" as you do your deployment. So please do read everything rather than just copy-pasting the commands over.

You should use this guide together with the [VIS App Integration Guide](https://documentation.vis.ethz.ch/), which covers the exact same steps, but with less detail on what actually happens behind the curtains.

If you get stuck at any time, don't hesitate to ask us CIT members for help - either via RocketChat or in person. :)

## Some useful terms

* **CI**: Continuous Integration - a fancy term for the concept of automatically running builds and tests on your code every time you push to a repository.
* **CI Pipeline**: The actual "builds and tests" that are run on your code every time you push to a repository. The VIS CI Pipeline will not only build and test your app, but also deploy it to staging so you can directly test it live.
* **Deploy**: To bring your app into effective action. When your app is deployed, you can actually access it online, it is then live.
* **Deployment Pipeline**: A pipeline (sequence of steps) performed to deploy an app. In our case, the CI pipeline is also a deployment pipeline, so these terms are sometimes used interchangeably. If you want to be super specific, it's actually a CI/CD pipeline.
* **CD**: Continuous Deployment - a fancy term for the concept of automatically running the deployment pipeline every time you push to a repository
* **Production Environment**, or Prod: A "section" of our infrastructure where the actual VIS apps live (the ones that are used by our end-users)
* **Staging Environment**: A different section of our infrastructure that looks just like production, and also runs all the apps, but those are not used by the end-users. Staging is used for testing apps (or new versions thereof) without risking the actual app (that runs in Prod) to stop working.

## Prepare your app

This guide starts at the point where you have finished coding your app and have set it up running with Docker - all that's left to do is to deploy it and get it live. So, build a simple web app (something that replies with "Hello World" to HTTP requests will do fine) and prepare a Dockerfile for it. **Don't push your app to gitlab just yet - we'll do that later.**

If you're lazy, you can also use this [example project](https://gitlab.ethz.ch/vis/cit/cit-drivers-license-test-project) we prepared for you. Please don't commit into the example project repo - create your own repo instead.

Make sure your project sticks to the specifications in the App Integration Guide. Since all VIS Apps are automatically built and deployed straight from the code in the gitlab repository, some constraints have to be met for that process to work smoothly. Our deployment infrastructure makes some assumptions on what branches are present in the repo, for instance. Read the App Integration Guide (the section on "Conventions") and build your example app accordingly. **Leave the `.gitlab-ci.yml` file be for now - we will look at that in a minute.**

In case you are not familiar with docker and don't know how to write a Dockerfile for your application, we recommend you read the official [Docker guide](https://docs.docker.com/get-started/) (sections 1 and 2 should suffice for now). Note that you won't need to share your docker image into any public registry - our CI pipeline will automatically save it in our own Docker registry.

## Set your app up for CI

We now move on to the [CI Guide](https://documentation.vis.ethz.ch/ci.html), which tells you in detail how to prepare your app to work with our CI Pipeline.

The first section, "Basic Setup", tells you how you should set up your gitlab repository. It essentially tells you that a sysadmin will take care of that - but since you want to be a sysadmin, this guide contains an explanation of what needs to be done, and why.

We use Gitlab CI to run our CI pipeline. This is a feature of Gitlab itself. Your Gitlab Project needs to be configured to use a "Gitlab Runner" - a separate server that executes the actual CI pipeline. The VIS runs such a runner, the `vis-default-runner`, and that needs to be added to the project. Once that is done, every time you push code to the project, Gitlab will send a CI job over to the runner. The runner, upon receiving this job, will run the CI pipeline.

The CI pipeline makes some assumption on what the repository looks like. That is why there has to be a Dockerfile, and specific branches need to be present.

### Creating the Gitlab Project

We have prepared a [python script](https://gitlab.ethz.ch/vis/cit/ci-framework/tree/master/create_repo) to automatically create a Gitlab project that fulfills all these requirements. You can use this script to create your test project, too. Note that your Gitlab user needs to be in the vis/cit group, and you need a [Gitlab API token](https://gitlab.ethz.ch/profile/personal_access_tokens) in order to use the script.

Clone the [ci-framework](https://gitlab.ethz.ch/vis/cit/ci-framework) repository, which contains the script. Install the requirements (protip: you can install them in a [python venv](https://cewing.github.io/training.python_web/html/presentations/venv_intro.html) to not pollute your system with random python packages), and run it. You will be prompted for some information about your project. Make it a personal project - you should be able to answer all other questions at this point.

The default project will already contain a default Dockerfile and `.gitlab-ci.yml`. You can delete them for now, you will replace them with your own versions. Clone your new Gitlab repo, move your code over to it, and then continue with the guide.

### The CI Pipeline

In principle, there is no "fixed" CI pipeline that all apps have to use. With Gitlab CI, each app can define its own pipeline. That is done with the `.gitlab-ci.yml` config file. If Gitlab sees such a file inside your project root directory, it will run CI for your project according to the configuration inside that file. If that file is missing, no CI will be run at all.

In the case of the VIS, all apps use more or less the same CI pipeline. If you read the CI Guide, you will see that in the end you simply copy-paste the content of the `.gitlab-ci.yml` file over to your project. The only thing that differs between two VIS apps are the variables set at the beginning of that file.

The yaml file you see in the section "Configure the Pipeline" in the CI Guide defines the entire CI Pipeline necessary to build and deploy a VIS app. However, most of the magic is hidden away. The CI configuration just specifies that specific commands are to be run on the gitlab runner. These commands - e.g. the `do_deployment` command - are just plain bash commands that will be run on the runner. `do_deployment` is a command we defined ourselves - it can be found in our [CI script](https://gitlab.ethz.ch/vis/cit/ci-framework/blob/master/ciscript.sh), which was written and is maintained by the CIT.

So, to summarize, the `.gitlab-ci.yml` file tells Gitlab to do CI for your code. Gitlab sends the whole pipeline off to the configured `vis-default-runner`, which runs the commands specified in `.gitlab-ci.yml`. These commands are defined in the CI script, which is installed on the `vis-default-runner`, and the runner then runs these commands to build and deploy your app - every time you push to the repo.

If you want to know more about Gitlab CI, you can for example check out [this guide](https://www.digitalocean.com/community/tutorials/how-to-set-up-continuous-integration-pipelines-with-gitlab-ci-on-ubuntu-16-04), which also explains how you could run your own Gitlab runners for your personal projects if you want.

### Influencing the Pipeline

If you go back to the [CI Guide](https://documentation.vis.ethz.ch/ci.html), you will find that it contains a huge list of variables that you can set in your `.gitlab-ci.yml` file that influence your deployment. When you put these variables into the `.gitlab-ci.yml` file, they will be present as environment variables on the gitlab runner. The CI script, which runs on the runner, will read these variables and act accordingly. For example, if you specify `VIS_CI_ENABLE_PROXY: "true"` in your `.gitlab-ci.yml`, then the CI script will do some magic to your app so that only logged-in VIS members can access it. How exactly that is done will be explained later.

Some of the variables require SysAdmin setup. For example, if you put `VIS_CI_ENABLE_POSTGRES: "true"` in your `.gitlab-ci.yml`, you will not magically get access to a database. Someone - and that means one of the CIT Göttis - will have to go in and create that database for you first. The CI script will then merely make sure that your app can connect to the database. It does so by providing environment variables to your app at runtime - meaning that when your app runs on the VIS infrastructure, the environment variables will be there, and through them you can find out your database server address, username and password. How exactly that is done will also be explained later.

## How your app is built

The first step in the CI Pipeline is to build your app. This is fairly straightforward, the CI script will simply `docker build` your app and tag it properly.

## How your app is deployed

This step is more interesting. The VIS apps run in *Kubernetes*, a container management system that automatically deploys and maintains docker containers. Kubernetes is open-source software, and the VIS runs it on our own infrastructure. 

In order to run a docker image in Kubernetes, a config file (called manifest) has to be provided which describes what the so-called *deployment* should look like. This contains information on which docker images should be running (an app can consist of multiple docker containers, Kubernetes will then run all of them), which ports should be exposed, which environment variables should be present inside the containers, how many replicas of the app should be run, at which subdomain the app should be accessible, and quite a number of other things.

Inside Kubernetes, each app has its own *deployment manifest* (config file). However, since all VIS apps work somewhat similarly, their manifests look similar as well. So, to make life easier, we use Helm to maintain these manifests. We have written a *Helm chart*, which is like a template for Kubernetes manifests. The CI script uses this Helm chart together with the information you provide in the `.gitlab-ci.yml` file in order to generate a deployment manifest for your app. That manifest is then sent to Kubernetes.

Kubernetes will then automatically download all the docker images needed and run your app. Kubernetes also injects the environment variables you need into your container - the environment variables that are required are all written down in the manifest, which was generated by the CI script using the Helm chart and the variables you set in `.gitlab-ci.yml`.

Kubernetes can also do more stuff - for example, if you specified `VIS_CI_ENABLE_PROXY: "true"` in your `.gitlab-ci.yml`, then the manifest generated by the CI script will tell Kubernetes to also spin up a second container for your app. This second container provides authentication - so the users will first "talk to" the second container, which gives them a login interface, and only if the user is authenticated, his requests are forwarded to your app. Your app will only ever get requests from logged in users, and you didn't have to write any code to make sure of that.

As you see, Kubernetes is an extremely powerful tool. If you want to learn how to use it, we suggest [this tutorial](https://kubernetes.io/docs/tutorials/kubernetes-basics/) that will explain how Kubernetes works in more detail, and teach you how to write your own deployment manifests to run your apps.

The CI script will deploy your app to our staging environment. In the VIS infrastructure, both staging and prod live inside the same Kubernetes cluster. The deployment manifest file contains the information on which environment the app should be deployed to. Kubernetes takes care of the rest.

If you want, you can check out our Kubernetes dashboard. [Here](https://kube.vis.ethz.ch/k8s/ns/vis-staging/deployments) you can see all the apps currently running in staging (log in with LDAP and your VIS credentials). After having deployed your app, find it there and check out the manifest that was generated for it.

## Watch the magic happen

You now know the process of getting your app from code in a Gitlab Repo to an actual running app on the VIS infrastructure. Now you just need to watch it happen. Set up your `.gitlab-ci.yml` according to the [CI Guide](https://documentation.vis.ethz.ch/ci.html) and push your code to your Gitlab repository. The pipeline will start running automatically and you can check its progress in the Gitlab web interface. You can even watch the log output of the pipeline live - see if you can find out which step of the pipeline is currently running ;)

Once everything ran through, you should be able to access your app at the subdomain you specified in `.gitlab-ci.yml`. Congratulations - you just deployed your first app, and you learned about the VIS infrastructure!

And, last but not least, since your app is just a test app you should also delete it after you're done. Your `.gitlab-ci.yml` file should also contain a "cleanup" step, which will trigger a command that deletes all the resources created for your app in Kubernetes. The cleanup step is only run manually, so you can do that now (via the Gitlab web interface).

Now you've made it! You're well on your way to become a cool sysadmin now ;)
