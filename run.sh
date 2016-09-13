#! /bin/bash

cd digitalocean
node droplet.js

cd ../aws
node createEC2.js

cd ../ansible

sleep 10

ansible-playbook -i inventory nginx.yml
