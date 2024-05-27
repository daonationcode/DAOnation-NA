const hre = require("hardhat");

// Just a standard hardhat-deploy deployment definition file!
async function main() {
	const { deployments, getNamedAccounts } = hre;
	const { deploy } = deployments;
	const { deployer } = await getNamedAccounts();


	await deploy('DAOAuction', {
		from: deployer,
		log: true,
	});

	var fs = require('fs');
	var json = JSON.parse(fs.readFileSync('./deployments/unique/DAOAuction.json', 'utf8'));

	fs.writeFileSync("address-unique.txt", json.address, {
		encoding: 'utf8',
		flag: 'w'
	  });
	  print("Deployed Successful")
	
};

main();