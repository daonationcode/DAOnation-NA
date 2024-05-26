// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import '@openzeppelin/contracts/utils/Strings.sol';
import '@openzeppelin/contracts/token/ERC20/ERC20.sol';

contract DAOAuction {
    struct event_uri_struct {
    string dao_id;  
    uint256 user_id;
    string event_uri;
    string event_wallet;
    string raised;
    string status;
  }

  struct feed_struct {
    uint256 feed_id;
    uint256 date;
    string Type;
    string data;
  }

  uint256 public _event_ids;
  uint256 public _feed_ids;

  mapping(uint256 => event_uri_struct) public _event_uris; //_event_ids                  => (Event)                    event uri struct
  mapping(uint256 => feed_struct) public _feeds; //_feed_ids            => (feed_struct)
  

  //Events
  function create_event(string memory _event_uri, string memory _event_wallet,string memory _dao_id, uint256 _user_id, string memory _feed) public returns (uint256) {
    //Create Event into _event_uris
    _event_uris[_event_ids] = event_uri_struct(_dao_id,_user_id,_event_uri,_event_wallet,'0','0');
   
    _event_ids++;

    add_Feed(_feed, 'event');
    return _event_ids;
  }

  function add_Feed(string memory feed_text, string memory _type) public {
    _feeds[_feed_ids] = feed_struct(_feed_ids, block.timestamp, _type, feed_text);
    _feed_ids++;
  }


}
