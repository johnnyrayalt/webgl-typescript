#!/bin/bash

set -e

"$(npm bin)/tsc" --noEmit --watch &
parcel ./src/index.html --target=browser