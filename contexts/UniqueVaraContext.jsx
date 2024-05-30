'use client';
import { useContext, useEffect, useState } from 'react';
import { createContext } from 'react';
import { ApiPromise, WsProvider, Keyring } from '@polkadot/api';
import varaConfig from './json/vara-config.json';

import { GearApi,getStateMetadata,getProgramMetadata, ProgramMetadata, StateMetadata } from '@gear-js/api';


const AppContext = createContext({
  varaApi: null,
  createEventInVara:async ()=>{},
  GetAllNfts: async () => [],
  GetAllEvents: async () => [],
  updateCurrentUser: () => {},
  userWalletVara:"",
  userSigner:null,
  VaraLoggedIn:false,
});

export function UniqueVaraProvider({ children }) {
  const [api, setApi] = useState();
  const [userWalletVara, setUserWalletVara] = useState('');
  const [VaraLoggedIn, setVaraLoggedIn] = useState(false);
  const [userSigner, setUserSigner] = useState('');

  

  async function updateCurrentUser() {
    const { web3Enable, web3Accounts, web3FromAddress } = require('@polkadot/extension-dapp');

    await web3Enable('DAOnation');
    let wallet = (await web3Accounts())[0];
    const injector = await web3FromAddress(wallet.address);

    setUserSigner(injector.signer);

    setVaraLoggedIn(true);
    setUserWalletVara(wallet.address);
    window.signerAddress = wallet.address;
  }

  useEffect(() => {
    (async function () {
      try {
        const gearApi = await GearApi.create({
          providerAddress: varaConfig.chain_rpc,
        });
        
        await gearApi.isReady;

        setApi(gearApi);
        if (window.localStorage.getItem('login-type') == 'polkadot-vara') {
          updateCurrentUser();
        }
        console.log('Vara Done');
      } catch (e) { }
    })();
  }, []);

  async function createEventInVara(){
    let recipient ='5FRkiMQneH7UF2scafNXFC85QAQ4HWSLxJpM6DVeH2FRfXHq';
    const txs = [api.tx.balances.transferAllowDeath(recipient, `${4 * 1e12}`)];

    const transfer = await api.tx.utility.batch(txs).signAndSend(userWalletVara, { signer: userSigner }, (status) => {
      showToast(status, id, 'Sent successfully!', () => {

      });
    });
console.log(transfer);

  }

  async function InsertEventData(totalEventCount, allEvents, prefix) {
    const arr = [];
    for (let i = 0; i < totalEventCount; i++) {
      let object = '';
      let daoId = "";
      let reached = 0;
      let nft_raised  = 0;
      let totalNfts = 0;
      let eventId = prefix + i;
      
      if (prefix == 'm_') {
        object = JSON.parse(allEvents[i].event_uri);
        daoId = allEvents[i].dao_id;
         nft_raised = Number(await contractUnique.get_event_reached(i));
         totalNfts = Number(await contractUnique.get_event_nft_count(i));
      } else {
        if (allEvents[i]?.eventUri) {
          object = JSON.parse(allEvents[i].eventUri?.toString());
          daoId = allEvents[i].daoId.toString();
        }
      }
      reached =  Number(allEvents[i].raised)/1e18 + nft_raised/1e18 ;
    
      
      if (object) {
        arr.push({
          //Pushing all data into array
          id: i,
          eventId: i,
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
          amountOfNFTs:totalNfts,
          status:allEvents[i].status
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




  async function InsertNftData(totalNftCount, allNfts, prefix,allBids = []) {
    const arr = [];
    for (let i = 0; i < totalNftCount; i++) {
      let object = {};

      if (prefix == 'm_') {
        object = allNfts[i];
      } 
      let nftId = prefix + i;
      let allnftbids = allBids.filter((item)=>item.nftId == Number(i));

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
        highest_amount: Number(object.highest_amount) /1e18,
        highest_bidder: object.highest_bidder,
        highest_bidder_userid: object.highest_bidder_userid,
        type: prefix == 'm_' ? 'Polkadot' : 'EVM',
        highestBid: [],
        bidHistory:allnftbids,
      });
    }
    return arr;
  }

  async function fetchContractNftData(allBids) {
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
        let arr = InsertNftData(totalNftCount, await totalNft(), 'm_',allBids);
        return arr;

      }
    } catch (error) { }

    return [];
  }

  async function GetAllNfts() {
    
    let allBids =await  GetAllBids();
    console.log(allBids);
    let arr = [];
    // arr = arr.concat(await fetchPolkadotGoalData());
    arr = arr.concat(await fetchContractNftData(allBids));
    return arr;
  }



  

  async function InsertBidData(totalBidCount, allBids, prefix) {
    const arr = [];
    for (let i = 0; i < totalBidCount; i++) {
      let object = {};

      if (prefix == 'm_') {
        object = allBids[i];
      } 
      let bidId = prefix + i;

      arr.push({
        //Pushing all data into array
        id: i,
        bidId: bidId,
        nftId: object.nft_id,
        date: object.date,
        walletAddress: object.walletAddress,
        bidder: object.bidder,
        bidder_userid:Number(object.bidder_userid),
        bidAmount:Number(object.bidAmount)/1e18
      });
    }
    return arr;
  }

  async function fetchContractBidData() {
    //Fetching data from Smart contract
    try {
      if (window.contractUnique) {
        const totalBidCount = Number(await contractUnique._bid_ids());
        let totalBid = async () => {
          const arr = [];
          for (let i = 0; i < Number(totalBidCount); i++) {
            const bid_info = await contractUnique._bid_uris(i);
            arr.push(bid_info);
          }
          return arr;
        }
        let arr = InsertBidData(totalBidCount, await totalBid(), 'm_');
        return arr;

      }
    } catch (error) { }

    return [];
  }

  async function GetAllBids(){
    let arr = [];
    // arr = arr.concat(await fetchPolkadotGoalData());
    arr = arr.concat(await fetchContractBidData());
    return arr;
  }


  return <AppContext.Provider value={{varaApi:api,VaraLoggedIn:VaraLoggedIn,userWalletVara:userWalletVara,createEventInVara:createEventInVara,userSigner:userSigner, GetAllEvents:GetAllEvents,GetAllNfts: GetAllNfts,updateCurrentUser:updateCurrentUser}}>{children}</AppContext.Provider>;
}

export const useUniqueVaraContext = () => useContext(AppContext);
