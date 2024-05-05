import { Contract, PopulatedTransaction } from 'ethers';
import { BrowserProvider, Eip1193Provider } from 'ethers/types/providers';
import Web3 from 'web3';

declare global {
  interface Window {
    userid: string;
    contract: Contract;
    sendTransaction: (transaction: PopulatedTransaction) => void;
    ethereum: Eip1193Provider & BrowserProvider;
    signerAddress: string;
    editorGJ: any;
    injectedWeb3: Web3;
  }
}
export {};
