#!/bin/bash
NODE_VERSION=${NODE_VERSION:-21.7.1}
# easily run node commands through docker
docker run --user $(id -u):$(id -g) --rm -it -v .:/app -w /app --env-file <(env) "node:${NODE_VERSION}-alpine" "$@"