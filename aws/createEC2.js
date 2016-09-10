var AWS = require('aws-sdk');
var fs = require('fs')

AWS.config.region = 'us-west-2';

var AWSAccessKeyId= process.env.AWSAccessKeyId
var AWSSecretKey= process.env.AWSSecretKey

AWS.config.update({accessKeyId: AWSAccessKeyId, secretAccessKey: AWSSecretKey});

var ec2 = new AWS.EC2();


var params = {
  ImageId: 'ami-d732f0b7', // Amazon Linux AMI x86_64 EBS
  InstanceType: 't2.micro',
  KeyName: 'server_provisioning',
  MinCount: 1, MaxCount: 1
};

// Create the instance
ec2.runInstances(params, function(err, data) {
  if (err) { console.log("Could not create instance", err); return; }
  

  console.log(data)
  var instanceId = data.Instances[0].InstanceId;
  console.log("Created instance", instanceId);
  getIpAddress(instanceId);
  // Add tags to the instance
  params = {Resources: [instanceId], Tags: [
    {Key: 'Name', Value: 'instanceName'}
  ]};
  ec2.createTags(params, function(err) {
    console.log("Tagging instance", err ? "failure" : "success");
  });
});

function getIpAddress(instanceId){
	setTimeout(function(){ 
		ec2.describeInstances({InstanceIds:[instanceId]}, function(err, data) {
      	  	 if(err) {
        		console.log("ERROR - " + err);
     		 	}		
          	 else {
			if(data.Reservations && data.Reservations[0].Instances[0].State.Name == "running"){
		         	var IpAddress =  data.Reservations[0].Instances[0].PublicIpAddress
			 	fs.appendFile(__dirname + "/../ansible/inventory", "aws ansible_ssh_host=" + IpAddress  + " ansible_ssh_user=ec2-user ansible_ssh_private_key_file=~/.ssh/aws.pem" + "\n")
			}
	}

});
},40000);
}
