#!/usr/bin/env bash
# Builds lambda.zip: the API and its dependencies, packaged for AWS Lambda
# (Python 3.12 on Linux x86_64). Run from anywhere: scripts/build_lambda.sh
set -euo pipefail
cd "$(dirname "$0")/.."

rm -rf build lambda.zip
mkdir build

# wheels built for Lambda's Linux, not for this computer
python3 -m pip install -r requirements.txt \
    --platform manylinux2014_x86_64 --only-binary=:all: \
    --python-version 3.12 --implementation cp \
    --target build/ --quiet

# the application code, without Python's local caches
cp -r app build/
find build -name "__pycache__" -type d -prune -exec rm -rf {} +

# zip the contents of build/, not the folder itself
(cd build && zip -qr ../lambda.zip .)

echo "lambda.zip: $(du -h lambda.zip | cut -f1) zipped, $(du -sh build | cut -f1) unzipped"
