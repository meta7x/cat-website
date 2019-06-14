# VIS Base Image

This is the base image of all VIS apps. We use [`cinit`](https://gitlab.ethz.ch/vis/cit/cinit/),
a customly developped tool to start programs in a container, see [here](https://documentation.vis.ethz.ch/cinit.html)

## Best Practices

cinit is the program taking care of all programs you want to run inside the
container. In addition to the general usage in the documentation linked above,
also keep this in mind:

* Don't specify any `CMD` or `ENTRYPOINT` inside the Dockerfile.

* Don't run `apt update` or `apt upgrade` during setup.

* Run all services as non-privileged user. `base` provides the user and group
  `app-user` for this purpose. `root` is only acceptable for short-term setup
  tools.

* Your service program will most likely need the capability
  `CAP_NET_BIND_SERVICE` which allows your unprivileged user to open the network
  port 80. See
  [capabilities](http://man7.org/linux/man-pages/man7/capabilities.7.html) for
  details.


## Migration Guide

### Charlie

* We base on Debian Stretch. Make sure you move all Ubuntu related code.

* We now use an init daemon called [`cinit`](https://gitlab.ethz.ch/vis/cit/cinit/).
  Find the documentation of it in the [documentation](https://documentation.vis.ethz.ch/cinit.html).

* Your app is not supposed to run as user `root` any more. Instead you should
  use `cinit` to spawn your server as user and group `app-user`. If you need root
  privileges set the appropriate [capabilities](http://man7.org/linux/man-pages/man7/capabilities.7.html)
  which is much more fine-grained than root.

* Don't provide either `ENTRYPOINT` (nothing new) or `CMD` (this is new) in your
  Dockerfile. Write a `cinit` config file instead and place it in /etc/cinit.d/
  to have your app registered.

* Don't use bash scripts to run your programs. Bash scripts are great to perform
  simple file moving and text manipulation. Tasks running for longer than a few
  seconds, deserve their own entry as cinit program.

* Remove any `apt update` or `apt upgrade` commands. You are provided with apt
  lists from `base` and are supposed to use those lists.

* The timezone is now `Europe/Zurich` instead of UTC.
