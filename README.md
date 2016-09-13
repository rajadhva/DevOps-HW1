# DevOps-HW1

##Instructions to provsion and configure the servers on DigitalOcean and AWS

1. git clone http://github.com/rajadhva/DevOps-HW1.git

2. Run <pre>./dependencies.sh</pre> to install all the required dependencies. 

3. Generate the ssh keys using the foolowing command <pre>ssh-keygen -t rsa</pre> . Go ahed and add the ppublic key to the digital ocean profile.

4. Run the command <pre>curl -X GET -H 'Content-Type: application/json' -H 'Authorization: Bearer <Your Access token>' "https://api.digitalocean.com/v2/account/keys"</pre> to get the ssh id . Add the config token and the ssh id into the droplet.js file. Also modify the path to the key file in the line where details are getting appended to nventory file. 

5. Run <pre> node droplet.js</pre> to create the droplet on digital ocean . If you go and check the ansible directory you can see that an inventory file will be generated with the required credentials.

6. For the EC2 instance you will have to generate the key pair from the console. You will be given the access key id,secret key which you add to createEC2.js . Also download the pem file and add the path for the same in createEC2.js . Run the file using <pre>node createEC2.js</pre>

7. Log in to the EC2 console to ensure that the security configuration rules are set to accept input and putput traffic from anywhere. 

8. cd into the ansible directory and check the contents of the inventory file. You should be able to see the credentials required to ssh into the instances.

9. Check that both the instacnes are reachable using the ping command. <pre> ansible all -i inventory -m ping</pre> 

10. Run the playbook to install the nginx server. <pre>ansible-playbook nginx.yml -i inventory</pre>.

11. You can key in the ip addreses of the instances in the browser and you should be able to see the welcome page for niginx webserver in both the cases.

## Here in a link to the demo
[HW1-Demo](https://youtu.be/E1yeiKIPTOI)
