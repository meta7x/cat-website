# Visdev

Visdev is a utility that should help you develop applications for VIS by
simulating the production environment.

Visdev was mainly developed to be used as a CLI tool, but it can also be used as
a python library. It functions as a wrapper for the Docker CLI.

## Installation

### Requirements

We assume that you have already installed docker (If not, see
https://docs.docker.com/engine/installation/ to install docker-ce). Also we
assume you are running Linux. The user running the tool is assumed to have
access to docker. This means either adding your user to the `docker` group or
running the tool as user `root`.

For the user-wide and system-wide installation one also needs to have python3
setuptools installed. On Debian or Ubuntu(-based) systems these are available
in the package `python3-setuptools`.

If you plan to run visdev as root, you should use the system-wide installation.
You may get a `pkg_resources.DistributionNotFound` error when running
`sudo visdev` if you do the user-wide installation.

### Clone Repository

You will first need to clone this repository.

    git clone git@gitlab.ethz.ch:vis/cat/visdev.git

The following commands assume that you are in the cloned directory.


### Virtualenv Installation

The recommended setup for visdev is a virtual environment.
Run the instructions as the user with docker access.
To set it up once:

```bash
virtualenv -p /usr/bin/python3 .venv
. .venv/bin/activate
pip3 install --upgrade .
```
This installs visdev inside your virtual environment.

To start developing, activate your virtual environment (do this every time):

```bash
. .venv/bin/activate
```

When stopping to work with visdev, exit your virtual environment:

```bash
deactivate
```

To install changes from the visdev developers, run the following commands with
your virtual environment activated:
```bash
git pull
pip3 install --upgrade .
```

### User-wide Installation

We recommend installing this to the per-user `site-packages` directory. To do
this, move to this directory (same level as `setup.py`) and run the following
command:

    pip3 install --user --upgrade .

This will install this package and its requirements to
`~/.local/lib/pythonX.X/site-packages/.` It will also add an executable to
`~/.local/bin/` that works as a CLI. If you haven't already, we recommend adding
`~/.local/bin` to your `$PATH` by adding the following to your `.bashrc` (or
equivalent).

    export PATH=$PATH:$HOME/.local/bin

From now on, the visdev command is available everywhere on your system.

(The `--upgrade` flag makes sure to always install the version of visdev you've
currently checked out, even if you've already installed another (probably older)
version and we didn't change the version number since then.)

**Note for Mac users:** If you're running visdev on macOS, the package may be
installed in a different location, so you will probably have to add something
else to your `$PATH`:

With a Homebrew-installed Python 3, the package appears to be installed at
`~/Library/Python/X.Y/lib/python/site-packages/` and the executable ends up in
`~/Library/Python/X.Y/bin/`.

(At the time of writing, X.Y == 3.6)

### System-wide Installation

This is not the preferred method of installation. It may be a good choice if you
run visdev as root though.

From the visdev directory (like for user-wide), run:

```bash
sudo pip3 install --upgrade .
```

Unlike user-wide, you shouldn't need to add anything to your `PATH`.

## CLI Usage

We'll be going through the commands of visdev.

    visdev test <project> [--volume <volume>]... [--detach] [-e <variable>]...

This is the most important command. This will build a container based on a vis
project; see [here](https://gitlab.ethz.ch/vis/cit/documentation)
for a guide on what that is. It will start the needed
database containers and inject the necessary environment variables.

    visdev init

This will start the entire test environment.

    visdev build <dockerfile> [--tag <image_name>] [--build-arg <K=V,K2=V2>]

This will build a container according to a Dockerfile.

    visdev start <container_name> [--detach]

This will start an exiting container that was created using visdev (that has the
correct prefix). If no container name is specified, all stopped containers in
the test environment (with the correct prefix) will be started. The detach flag
will start the container in detached mode,

    visdev run <image_name> [--project <project>] [--name <container_name>] [--volume <volume>]... [--detach] [-e <variable>]...

This will run a container based on an image, inject the necessary environment
variables and link it to the test environment. You can optionally give it a
special name, mount volumes or run it in detach mode.

    visdev stop <container_name>

This will stop a container started by visdev. If no container name is specified,
all running containers in the environment will be stopped.

    visdev rm <container_name>

This will remove a container started by visdev. If no container name is
specified, all stopped containers in the environment will be removed.

    visdev connect <container_name>

This will spawn a bash session in the specified container.

    visdev logs <container_name>

This will show the recent output of the specified container.

    visdev ls [-a]

This will list all running containers started by visdev. If the -a flag is set,
it will also show all stopped containers.

## Relevant local endpoints

- Your app : http://localhost:8080
- phpMyAdmin: http://localhost:8008/phpmyadmin
- phpPGAdmin: http://localhost:8888
- MailHog: http://localhost:8025
- rocketchat-fake: http://localhost:8088

## Environment Variables

visdev provides you with an environment matching the staging and production
environments in the cluster. Moreover, it relies on some variables being set in
the `.gitlab-ci.yml` file. For a reference of the interface, please refer to
[the documentation](https://gitlab.ethz.ch/vis/cit/documentation)