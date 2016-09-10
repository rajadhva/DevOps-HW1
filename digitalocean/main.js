var needle = require("needle");
var os   = require("os");
var fs = require("fs");
var config = {};

config.token = "0db1d2985ade99211f64eb9b317d3d9d992adbda785ff9021fadad6fd738ea5a";

var headers =
{
	'Content-Type':'application/json',
	Authorization: 'Bearer ' + config.token
};

// Documentation for needle:
// https://github.com/tomas/needle

var client =
{
	listRegions: function( onResponse )
	{
		needle.get("https://api.digitalocean.com/v2/regions", {headers:headers}, onResponse)
	},

	listImages: function( onResponse )
	{
		needle.get("https://api.digitalocean.com/v2/images", {headers:headers}, onResponse)
	},

	getDropletIp: function(dropletId, onResponse )
	{
		needle.get("https://api.digitalocean.com/v2/droplets/"+ dropletId, {headers:headers}, onResponse)
	},

	deleteDroplet: function (onResponse)
	{

		needle.delete("https://api.digitalocean.com/v2/droplets/25215189", null, {headers:headers}, onResponse)
	},

	createDroplet: function (dropletName, region, imageName, onResponse)
	{
		var data = 
		{
			"name": dropletName,
			"region":region,
			"size":"512mb",
			"image":imageName,
			// Id to ssh_key already associated with account.
			"ssh_keys":[3346466],
			//"ssh_keys":null,
			"backups":false,
			"ipv6":false,
			"user_data":null,
			"private_networking":null
		};

		console.log("Attempting to create: "+ JSON.stringify(data) );

		needle.post("https://api.digitalocean.com/v2/droplets", data, {headers:headers,json:true}, onResponse );
	}
};

// #############################################
// #3 Create an droplet with the specified name, region, and image
// Comment out when completed. ONLY RUN ONCE!!!!!
// Write down/copy droplet id.
var name = "vrajadh"+os.hostname();
var region = "nyc1"; // Fill one in from #1
var image = "ubuntu-14-04-x64"; // Fill one in from #2
client.createDroplet(name, region, image, function(err, resp, body)
{
 	console.log(body);
 	// StatusCode 202 - Means server accepted request.

	var data = resp.body;
 	if(!err && resp.statusCode == 202){
 		console.log("Creating droplet")
		console.log( JSON.stringify( body, null, 3 ) );
		
		var dropletId = JSON.stringify(data.droplet.id);
		setTimeout(function(){
		client.getDropletIp( dropletId, function(error, response)
		{
			var data = response.body;
			console.log( JSON.stringify(response.body) );
				if( data.droplet )
				{
					console.log(data.droplet.networks.v4[0]["ip_address"]);
//			input = "[servers]\n"+"digitalocean ansible_ssh_host="+data.droplet.networks.v4[0]+ " ansible_ssh_user=root ansible_ssh_private_key_file=~/.ssh/id_rsa\n";
//    		fs.writeFile('../ansible/inventory', input, function(err) {
//    		if(err) {
//        		return console.log(err);
//    			}
//    		});
			fs.appendFile(__dirname + "/../ansible/inventory", "digitalocean ansible_ssh_host=" + data.droplet.networks.v4[0]["ip_address"] + " ansible_ssh_user=root ansible_ssh_private_key_file=~/.ssh/id_rsa" + "\n")		
		}
		});	
		},30000);
		
	}
	});

