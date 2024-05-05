
import { ethers } from 'ethers';
import { SignTypedDataVersion } from '@metamask/eth-sig-util';
import DAOnation from '../contracts/deployments/moonbase/DAOnation.json';
import CallPermitABI from '../contracts/artifacts/contracts/precompiles/CallPermit.sol/CallPermit.json';

export default async function CallPermit(methodWithSignature) {

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    const from = (await signer.getAddress())?.toString();
    let signature;
    const to = DAOnation.address;
    const value = 0;
    const data = methodWithSignature.data;

    const gaslimit = 1000000000;
    const deadline = Math.round(new Date().getTime() / 1000) + 500;
    const Call_Permit_address = '0x000000000000000000000000000000000000080a'

    const CallPermitContact = new ethers.Contract(Call_Permit_address, CallPermitABI.abi, signer)


    const nonce =await CallPermitContact.nonces(from);



    // Message to Sign
    const message = {
        from: from,
        to: to,
        value: value,
        data: data,
        gaslimit: gaslimit,
        nonce: nonce,
        deadline: deadline,
    };

    let domain =  {
        name: 'Call Permit Precompile',
        version: '1',
        chainId: 1287,
        verifyingContract: '0x000000000000000000000000000000000000080a',
    }
    let types = {
        
        CallPermit: [
            {
                name: 'from',
                type: 'address',
            },
            {
                name: 'to',
                type: 'address',
            },
            {
                name: 'value',
                type: 'uint256',
            },
            {
                name: 'data',
                type: 'bytes',
            },
            {
                name: 'gaslimit',
                type: 'uint64',
            },
            {
                name: 'nonce',
                type: 'uint256',
            },
            {
                name: 'deadline',
                type: 'uint256',
            },
        ],
    }
    const typedData = ({
        types: types,
        primaryType: 'CallPermit',
        domain:domain,
        message: message,
    });



    const signData = async () => {


    
        try {
            const rawSig = await signer._signTypedData(domain, types, message);


            signature = ethers.utils.splitSignature(rawSig);

            return ({
                from: from,
                to: to,
                value: value,
                data: data,
                gasLimit: gaslimit,
                deadline: deadline,
                r: signature.r,
                s: signature.s,
                v: signature.v.toString(),
            });
        
        } catch (err) {
        console.error(err);
    }
};

let sig = await signData();
console.log(sig);
// Making Call Permit Dispatch

let output = await CallPermitContact.dispatch(from, to, 0, data, gaslimit, deadline, signature.v, signature.r, signature.s.toString(),{
    gasLimit:gaslimit
})



console.log(output);
}

