#!/bin/bash
#This script installs all deps. It can be ran in a virtualenv

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null && pwd )"
cd "$DIR"
cd ..

if [[ -z "${MODEL_PATH}" ]]; then
  MODEL_PATH="$(pwd)/model.bin"
fi
#download model
if [ ! -f "$MODEL_PATH" ]; then
    wget -O "$MODEL_PATH" https://github.com/freethenation/sentimental_nlp/releases/download/v0.1.0/model.bin
fi
