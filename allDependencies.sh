#! /bin/bash

sudo apt-get update
sudo apt-get install nodejs
sudo apt-get install make vim python-dev python-pip
git clone git://github.com/ansible/ansible.git --recursive
cd ./ansible
git checkout tags/v1.9.2-1
git submodule update --recursive
source ./hacking/env-setup
