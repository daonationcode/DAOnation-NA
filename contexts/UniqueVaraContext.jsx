'use client';
import { useContext, useEffect, useState } from 'react';
import { createContext } from 'react';
import { ApiPromise, WsProvider, Keyring } from '@polkadot/api';
import varaConfig from './json/vara-config.json';

const AppContext = createContext({
  varaApi: null,
  GetAllNfts: async () => [],
  GetAllEvents: async () => [],
  updateCurrentUser: () => {},
  userWalletPolkadot:"",

});

export function UniqueVaraProvider({ children }) {
  const [api, setApi] = useState();
  const [userWalletPolkadot, setUserWalletPolkadot] = useState('');
  const [userSigner, setUserSigner] = useState('');

  

  async function updateCurrentUser() {
    const { web3Enable, web3Accounts, web3FromAddress } = require('@polkadot/extension-dapp');

    await web3Enable('DAOnation');
    // let wallet = (await web3Accounts())[0];
    // const injector = await web3FromAddress(wallet.address);

    // setUserSigner(injector.signer);

    // setUserWalletPolkadot(wallet.address);
    // window.signerAddress = wallet.address;
  }

  useEffect(() => {
    (async function () {
      try {
        const wsProvider = new WsProvider(varaConfig.chain_rpc);
        const _api = await ApiPromise.create({ provider: wsProvider });
        await _api.isReady;

        setApi(_api);
        updateCurrentUser();        
        console.log('Vara Done');
      } catch (e) { }
    })();
  }, []);

  async function InsertEventData(totalEventCount, allEvents, prefix) {
    const arr = [];
    for (let i = 0; i < totalEventCount; i++) {
      let object = '';
      let daoId = "";
      let reached = 0;
      if (prefix == 'm_') {
        object = JSON.parse(allEvents[i].event_uri);
        daoId = allEvents[i].dao_id;
      } else {
        if (allEvents[i]?.eventUri) {
          object = JSON.parse(allEvents[i].eventUri?.toString());
          daoId = allEvents[i].daoId.toString();
        }
      }
      reached = allEvents[i].raised;
      let eventId = prefix + i;


      if (object) {
        arr.push({
          //Pushing all data into array
          id: i,
          eventId: eventId,
          daoId: daoId,
          Title: object.properties.Title.description,
          Description: object.properties.Description.description,
          Budget: object.properties.Budget.description,
          End_Date: object.properties.End_Date.description,
          wallet: object.properties.wallet.description,
          UserId: object.properties?.user_id?.description,
          logo: object.properties.logo.description?.url,
          type: prefix == 'm_' ? 'Polkadot' : 'EVM',
          reached: reached,
          amountOfNFTs:0,
        });
      }
    }
    return arr;
  }


  async function fetchPolkadotEventData() {
    //Fetching data from Parachain
    try {
      if (api) {
        let totalEventCount = Number(await api._query.events.eventIds());

        let totalEvent = async () => {
          let arr = [];
          for (let i = 0; i < totalEventCount; i++) {
            const element = await api._query.events.eventById(i);
            let eventURI = element['__internal__raw'];

            arr.push(eventURI);
          }
          return arr;
        };

        let arr = InsertEventData(totalEventCount, await totalEvent(), 'p_');
        return arr;
      }
    } catch (error) { }
    return [];
  }
  async function fetchContractEventData() {
    //Fetching data from Smart contract
    try {
      if (window.contractUnique) {
        const totalEventCount = Number(await contractUnique._event_ids());
        let totalEvent = async () => {
          const arr = [];
          for (let i = 0; i < Number(totalEventCount); i++) {
            const event_info = await contractUnique._event_uris(i);
            arr.push(event_info);
          }
          return arr;
        }
        let arr = InsertEventData(totalEventCount, await totalEvent(), 'm_');
        return arr;

      }
    } catch (error) { }

    return [];
  }
  async function GetAllEvents() {
    let arr = [];
    // arr = arr.concat(await fetchPolkadotEventData());
    arr = arr.concat(await fetchContractEventData());
    return arr;
  }




  async function InsertNftData(totalNftCount, allNfts, prefix) {
    const arr = [];
    for (let i = 0; i < totalNftCount; i++) {
      let object = {};

      if (prefix == 'm_') {
        object = allNfts[i];
      } 
      let nftId = prefix + i;

      arr.push({
        //Pushing all data into array
        id: i,
        nftId: nftId,
        eventid: object.event_id,
        name: object.name,
        url: object.url,
        description: object.description,
        sender_wallet: object.sender_wallet,
        reciever_wallet: object.reciever_wallet,
        highest_amount: object.highest_amount,
        highest_bidder: object.highest_bidder,
        type: prefix == 'm_' ? 'Polkadot' : 'EVM',
        highestBid: [],
        bidHistory: [],
      });
    }
    return arr;
  }

  async function fetchContractNftData() {
    //Fetching data from Smart contract
    try {
      if (window.contractUnique) {
        const totalNftCount = Number(await contractUnique._nft_ids());
        let totalNft = async () => {
          const arr = [];
          for (let i = 0; i < Number(totalNftCount); i++) {
            const nft_info = await contractUnique._nft_uris(i);
            arr.push(nft_info);
          }
          return arr;
        }
        let arr = InsertNftData(totalNftCount, await totalNft(), 'm_');
        return arr;

      }
    } catch (error) { }

    return [];
  }

  async function GetAllNfts() {
    let arr = [];
    // arr = arr.concat(await fetchPolkadotGoalData());
    arr = arr.concat(await fetchContractNftData());
    return arr;
  }


  return <AppContext.Provider value={{varaApi:api,userWalletPolkadot:userWalletPolkadot, GetAllEvents:GetAllEvents,GetAllNfts: GetAllNfts,updateCurrentUser:updateCurrentUser}}>{children}</AppContext.Provider>;
}

export const useUniqueVaraContext = () => useContext(AppContext);
