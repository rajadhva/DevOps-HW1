# DevOps-HW1

##Instructions to provsion and configure the servers on DigitalOcean and AWS

1. git clone http://github.com/rajadhva/DevOps-HW1.git

2. Run <pre>./dependencies.sh</pre> to install all the node dependencies. The other softwares that are required are mentioned in the requirements.txt file. 

3. Generate the ssh keys using the foolowing command <pre>ssh-keygen -t rsa</pre> . Go ahed and add the ppublic key to the digital ocean profile.

4. Run the command <pre>curl -X GET -H 'Content-Type: application/json' -H 'Authorization: Bearer <Your Access token>' "https://api.digitalocean.com/v2/account/keys"</pre> to get the ssh id . Add the config token and the ssh id into the droplet.js file. Also modify the path to the key file in the line where details are getting appended to nventory file. 

5. For the EC2 instance you will have to generate the key pair from the console. You will be given the access key id,secret key which you add to createEC2.js . Also download the pem file and add the path for the same in createEC2.js . 

7. Log in to the EC2 console to ensure that the security configuration rules are set to accept input and putput traffic from anywhere. 

8. run the run.sh script which will create the droplet and the EC2 instance on the digitalocean and EC2 consoles respectively . Also it will run the ansible-playbook to install the nginx server on both the instances.

8. You can go into the ansible directory and check the contents of the inventory file. You should be able to see the credentials required to ssh into the instances.

9. You can also check that both the instacnes are reachable using the ping command. <pre> ansible all -i inventory -m ping</pre> 

11. You can key in the ip addreses of the instances in the browser and you should be able to see the welcome page for niginx webserver in both the cases.

## Here is a link to the demo
[HW1-Demo](https://youtu.be/RM8gsKKgv2U)

##Amazon EC2
Amazon's EC2 web service provides resizable capacity in the cloud. EC2 provides you complete control of the ocmputing environment and lets you boot new server intances in minutes. It also allows to scale up and down as per requirements with relative ease. It lets you pay only for the capacity that you are using.A lot of developer tools exist which help in building fault resilient systems. The scaling and load balancing is seamless and automatic.
