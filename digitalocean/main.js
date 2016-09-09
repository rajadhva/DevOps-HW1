var needle = require("needle");
var os   = require("os");
var fs = require("fs");
var config = {};

config.token = "0db1d2985ade99211f64eb9b317d3d9d992adbda785ff9021fadad6fd738ea5a";

var sleep = require('sleep');

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

	getDropletIp: function( onResponse )
	{
		needle.get("https://api.digitalocean.com/v2/droplets/25215189", {headers:headers}, onResponse)
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
// #1 Print out a list of available regions
// Comment out when completed.
// https://developers.digitalocean.com/documentation/v2/#list-all-regions
// use 'slug' property
// client.listRegions(function(error, response)
// {
// 	var data = response.body;
// 	// console.log( JSON.stringify(response.body) );

// 	if( response.headers )
// 	{
// 		console.log( "Calls remaining", response.headers["ratelimit-remaining"] );
// 	}

// 	if( data.regions )
// 	{
// 		console.log("List of datacentres")
// 		for(var i=0; i<data.regions.length; i++)
// 		{
// 			console.log(data.regions[i].slug);
// 		}
// 	}
// });


// #############################################
// #2 Extend the client object to have a listImages method
// Comment out when completed.
// https://developers.digitalocean.com/documentation/v2/#images
// - Print out a list of available system images, that are AVAILABLE in a specified region.
// - use 'slug' property

// client.listImages(function(error, response)
// {
// 	var data = response.body;
// 	// console.log( JSON.stringify(response.body) );

// 	if( response.headers )
// 	{
// 		console.log( "Calls remaining", response.headers["ratelimit-remaining"] );
// 	}

// 	if( data.images )
// 	{
// 		console.log("List of images")
// 		for(var i=0; i<data.images.length; i++)
// 		{
// 			console.log(data.images[i].slug);
// 		}
// 	}
// });

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

 	if(!err && resp.statusCode == 202)	{
 		console.log("Creating droplet")
		console.log( JSON.stringify( body, null, 3 ) );
 	}
});

// #############################################
// #4 Extend the client to retrieve information about a specified droplet.
// Comment out when done.
// https://developers.digitalocean.com/documentation/v2/#retrieve-an-existing-droplet-by-id
// REMEMBER POST != GET
// Most importantly, print out IP address!
// var dropletId = "23687602";

client.getDropletIp(function(error, response)
{
	var data = response.body;
	console.log( JSON.stringify(response.body) );

	if( response.headers )
	{
		console.log( "Calls remaining", response.headers["ratelimit-remaining"] );
	}
	{
	console.log("Now sleeping for 40 secs")
	sleep.sleep(40)	
	console.log("Now opening for 40 secs")
	if( data.droplet )
	{
		console.log("IP address")
		console.log(data.droplet.networks.v4[0]["ip_address"]);
		fs.appendFile(__dirname + "/../ansible/inventory", "digitalocean ansible_ssh_host=" + data.droplet.networks.v4[0]["ip_address"] + " ansible_ssh_user=root ansible_ssh_private_key_file=~/.ssh/id_rsa" + "\n")		
	}
		}
});

// #############################################
// #5 In the command line, ping your server, make sure it is alive!
// ping xx.xx.xx.xx

// #############################################
// #6 Extend the client to DESTROY the specified droplet.
// Comment out when done.
// https://developers.digitalocean.com/documentation/v2/#delete-a-droplet
// HINT, use the DELETE verb.
// HINT #2, needle.delete(url, data, options, callback), data needs passed as null.
// No response body will be sent back, but the response code will indicate success.
// Specifically, the response code will be a 204, which means that the action was successful with no returned body data.
	
		
  // in this case, data may be null, but you need to explicity pass it. 
// client.deleteDroplet(function(err, response)
// {
// 	  	console.log( JSON.stringify(response.body) );
// 	  	if(!err && response.statusCode == 204)
// 		{
// 			console.log("Deleted!");
// 		}
// 	});
	

// #############################################
// #7 In the command line, ping your server, make sure it is dead!
// ping xx.xx.xx.xx
// It could be possible that digitalocean reallocated your IP address to another server, so don't fret it is still pinging.
