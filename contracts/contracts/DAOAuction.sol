// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import '@openzeppelin/contracts/utils/Strings.sol';
import '@openzeppelin/contracts/token/ERC20/ERC20.sol';

contract DAOAuction {
  struct event_uri_struct {
    string dao_id;
    uint256 user_id;
    string event_uri;
    address event_wallet;
    uint256 raised;
    string status;
  }
  struct nft_uri_struct {
    uint256 event_id;
    string name;
    string date;
    string url;
    string description;
    address sender_wallet;
    uint256 highest_amount;
    uint256 highest_bidder_userid;
    string highest_bidder;
  }
  struct bid_uri_struct {
    uint256 nft_id;
    string date;
     address  walletAddress;
    string bidder;
    uint256 bidder_userid;
    uint256 bidAmount;
  }

  struct feed_struct {
    uint256 feed_id;
    uint256 date;
    string Type;
    string data;
  }

  uint256 public _event_ids;
  uint256 public _nft_ids;
  uint256 public _bid_ids;
  uint256 public _feed_ids;

  mapping(uint256 => event_uri_struct) public _event_uris; //_event_ids                  => (Event)                    event uri struct
  mapping(uint256 => nft_uri_struct) public _nft_uris; //_nft_ids                  => (NFT)                    nft uri struct
  mapping(uint256 => bid_uri_struct) public _bid_uris; //_bid_ids                  => (NFT)                    bid uri struct
  mapping(uint256 => feed_struct) public _feeds; //_feed_ids            => (feed_struct)

  //Events
  function create_event(string memory _event_uri, address _event_wallet, string memory _dao_id, uint256 _user_id, string memory _feed) public returns (uint256) {
    //Create Event into _event_uris
    _event_uris[_event_ids] = event_uri_struct(_dao_id, _user_id, _event_uri, _event_wallet, 0, '0');

    _event_ids++;

    add_Feed(_feed, 'event');
    return _event_ids;
  }

  function donate_nft(uint256 event_id, string memory name, string memory url, string memory description, address sender_wallet,  string memory date, uint256 amount,uint256 userid, string memory highest_bidder, string memory _feed) public  returns (uint256) {
    //Create Event into _event_uris
    _nft_uris[_nft_ids] = nft_uri_struct(event_id, name,date, url, description, sender_wallet, amount, userid,highest_bidder);

    _nft_ids++;

    add_Feed(_feed, 'donate_nft');
    return _nft_ids;
  }

  function add_donation(uint256  _event_id, uint256 _doantion, string memory _feed) public payable {
    add_Feed(_feed, 'donation');

    _event_uris[_event_id].raised += _doantion;
  }
  

  function bid_nft(uint256 nft_id, string memory date, address walletAddress,   string memory bidder,uint256 bidder_userid,uint256 amount, string memory _feed) public payable  returns (uint256) {
    //Bid NFT
    _bid_uris[_bid_ids] = bid_uri_struct(nft_id,  date, walletAddress,bidder,bidder_userid, amount);
    _nft_uris[nft_id].highest_amount = amount;
    _nft_uris[nft_id].highest_bidder_userid = bidder_userid;
    _nft_uris[nft_id].highest_bidder = bidder;

    _bid_ids++;

    add_Feed(_feed, 'bid_nft');
    return _bid_ids;
  }

  function get_event_reached(uint256 event_id) public view returns(uint256){
    uint256 total = 0;
    for (uint256 i = 0; i < _nft_ids; i++) {
       nft_uri_struct memory nft = _nft_uris[i];
      if (nft.event_id == event_id){
        total += nft.highest_amount;
      }
    }
    return total;
  }

  function get_event_nft_count(uint256 event_id) public view returns(uint256){
    uint256 total = 0;
    for (uint256 i = 0; i < _nft_ids; i++) {
       nft_uri_struct memory nft = _nft_uris[i];
      if (nft.event_id ==event_id){
        total += 1;
      }
    }
    return total;
  }

  function distribute_nft_to_highest_bidder(uint256 event_id)public payable{
      for (uint256 i = 0; i < _bid_ids; i++) {
         bid_uri_struct memory biduri = _bid_uris[i];
         nft_uri_struct memory nft = _nft_uris[biduri.nft_id];
        if (nft.event_id == event_id){
          if (biduri.bidder_userid == nft.highest_bidder_userid){
            // Highest Bidder of the nft
            // Send the money to event wallet
            address eventWallet = biduri.walletAddress;
           payable(eventWallet).transfer(biduri.bidAmount);

            // Send nft to highest bidder 
            
            _nft_uris[biduri.nft_id].sender_wallet = biduri.walletAddress;

          }else{
            // Lowest bidders of the nft
            // Send the money to bidders
            address nftWallet = biduri.walletAddress;
            payable(nftWallet).transfer(biduri.bidAmount);
          }
        }
      }
      _event_uris[event_id].status = "ended";
  }



  function add_Feed(string memory feed_text, string memory _type) public {
    _feeds[_feed_ids] = feed_struct(_feed_ids, block.timestamp, _type, feed_text);
    _feed_ids++;
  }
}
