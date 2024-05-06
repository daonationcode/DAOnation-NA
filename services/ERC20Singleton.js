
import { ethers } from 'ethers';

import erc20 from '../contracts/deployments/moonbase/DAOnation.json';
import UniuqeErc20 from '../contracts/deployments/unique/DAOAuction.json';


export  async function ERC20Singleton() {


	const providerURL = 'https://rpc.api.moonbase.moonbeam.network';
	// Define provider
	const provider = new ethers.providers.JsonRpcProvider(providerURL, {
		chainId: 1287,
		name: 'moonbase-alphanet'
	});
	let signer = provider;
	if (Number(window?.ethereum?.networkVersion) === Number(1287)) {
		const provider = new ethers.providers.Web3Provider(window.ethereum);
		signer = provider.getSigner();
	}
	const contract = new ethers.Contract(erc20.address, erc20.abi, signer)

	return contract
}

export async function ERC20Unique(){
	const providerURL = 'https://rpc-opal.unique.network';
	// Define provider
	const provider = new ethers.providers.JsonRpcProvider(providerURL, {
		chainId: 8882,
		name: 'unique'
	});
	let signer = provider;
	if (Number(window?.ethereum?.networkVersion) === Number(8882)) {
		const provider = new ethers.providers.Web3Provider(window.ethereum);
		signer = provider.getSigner();
	}
	const contract = new ethers.Contract(UniuqeErc20.address, UniuqeErc20.abi, signer)

	return contract
}
