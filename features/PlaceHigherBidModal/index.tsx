import { MouseEventHandler, useEffect, useState } from 'react';
import { Button, Dropdown, IconButton, MenuItem, Modal } from '@heathmont/moon-core-tw';
import { ControlsClose } from '@heathmont/moon-icons-tw';
import UseFormInput from '../../components/components/UseFormInput';
import useEnvironment from '../../services/useEnvironment';
import { NFT } from '../../data-model/nft';
import { useUniqueVaraContext } from '../../contexts/UniqueVaraContext';
import { useUtilsContext } from '../../contexts/UtilsContext';
import { toast } from 'react-toastify';
import { usePolkadotContext } from '../../contexts/PolkadotContext';
import useContract from '../../services/useContract';

declare let window;
export default function PlaceHigherBidModal({ open, onClose, item }: { open: boolean; onClose: () => void; item: NFT }) {
  const { sendTransaction } = useContract();

  const { userInfo, PolkadotLoggedIn } = usePolkadotContext();
  const [BalanceAmount, setBalanceAmount] = useState(0);
  const [Coin, setCoin] = useState('UNQ');
  const [isLoading, setIsLoading] = useState(false);
  const { VaraLoggedIn, varaApi, userWalletVara } = useUniqueVaraContext()
  const { switchNetworkByToken }: { switchNetworkByToken: Function } = useUtilsContext();

  const { getCurrency } = useEnvironment();

  const [Amount, AmountInput] = UseFormInput({
    defaultValue: '',
    type: 'number',
    placeholder: '0.00',
    id: 'amount',
    className: 'max-w-[140px]'
  });

  async function placeBidOnNFT() {
    if (item.highest_amount < Amount) {
      setIsLoading(true);

      console.log('======================>Bidding NFT');
      const ToastId = toast.loading('Bidding NFT ...');


      async function onSuccess() {
        setIsLoading(false);
        onClose();
        window.location.reload();
      }
      let feed = {
        name: userInfo?.fullName,
        nftid: item.id,
        bidid: null
      };

      try {
        const bidid = Number(await window.contractUnique._bid_ids());
        feed.bidid = 'm_' + bidid;

        // Creating Event in Smart contract
        const methodWithSignature = (await window.contractUnique.populateTransaction.bid_nft(Number(item.id), new Date().toLocaleDateString(), window.selectedAddress, userInfo?.fullName?.toString(), Number(window.userid), (Amount * 1e18).toString(), JSON.stringify(feed)));
        const tx = {
          ...methodWithSignature,
          value: (Amount * 1e18).toString(),
        }
        await (await window.signer.sendTransaction(tx)).wait();
        toast.update(ToastId, {
          render: 'Bid Successful!',
          type: 'success',
          isLoading: false,
          autoClose: 1000,
          closeButton: true,
          closeOnClick: true,
          draggable: true
        });
        onSuccess();
      } catch (error) {
        setIsLoading(false);
        console.error(error);

        return;
      }

    }
  }

  async function LoadData(currencyChanged = false) {
    async function setPolkadotVara() {
      if (Coin !== 'VARA') setCoin('VARA');
      const { nonce, data: balance } = await varaApi.query.system.account(userWalletVara);

      setBalanceAmount(Number(balance.free.toString()) / 1e12);
    }

    async function setMetamask() {
      try {
        const Web3 = require('web3');
        const web3 = new Web3(window.ethereum);
        let Balance = await web3.eth.getBalance(window?.selectedAddress);

        setBalanceAmount(Number(Balance) / 1e18);

      } catch (e) { }
    }

    if (VaraLoggedIn && currencyChanged == false && Coin == '') {

      setPolkadotVara();
    } else if (currencyChanged == true && Coin == 'VARA') {
      switchNetworkByToken("VARA")
      setPolkadotVara();
    } else if (Coin !== 'VARA' && Coin !== '') {
      switchNetworkByToken("UNQ")
      setMetamask();
    }
  }

  function isInvalid() {
    return !Amount || (item?.highest_amount >= Amount);
  }
  useEffect(() => {
    if (Coin !== '') LoadData(true);
  }, [Coin]);

  useEffect(() => {
    LoadData();
  }, [open]);

  return (
    <Modal open={open} onClose={onClose}>
      <Modal.Backdrop />
      <Modal.Panel className="min-w-[480px] bg-gohan">
        <div className="flex items-center justify-center flex-col">
          <div className="flex justify-between items-center w-full border-b border-beerus py-4 px-6">
            <h1 className="text-moon-20 font-semibold">Place bid on {item?.name}</h1>
            <IconButton className="text-trunks" variant="ghost" icon={<ControlsClose />} onClick={onClose} />
          </div>
          <div className="flex flex-col gap-6 w-full max-h-[calc(90vh-162px)]">
            <form id="doanteForm" autoComplete="off">
              <div className="flex flex-col gap-2 py-16 px-6">
                <div className="flex items-center ">
                  <span className="font-semibold flex-1">Highest Bid Amount</span>
                  <div className="max-w-[140px] mr-4">{Coin} {item?.highest_amount ?? 0}</div>
                </div>
                <div className="flex items-center ">
                  <span className="font-semibold flex-1">Total</span>
                  <div className="max-w-[140px] mr-4"> {AmountInput}</div>
                  <Dropdown value={Coin} onChange={setCoin} className="max-w-[100px] ">
                    <Dropdown.Select>{Coin}</Dropdown.Select>
                    <Dropdown.Options className="bg-gohan w-48 min-w-0">
                      <Dropdown.Option value="UNQ">
                        <MenuItem>UNQ</MenuItem>
                      </Dropdown.Option>
                      <Dropdown.Option value="VARA">
                        <MenuItem>VARA</MenuItem>
                      </Dropdown.Option>

                    </Dropdown.Options>
                  </Dropdown>
                </div>
                {Coin != "" ? <>
                  {Number(BalanceAmount) - Amount < 1 ? <>
                    <p className=" w-full text-right text-chichi">Insufficent Balance </p>

                  </> : <>
                    <p className="text-trunks w-full text-right">Your balance will be {Number(BalanceAmount) - Amount + ' ' + Coin} </p>
                  </>}
                </> : <></>

                }

              </div>
            </form>
            <div className="flex justify-between border-t border-beerus w-full p-6">
              <Button variant="ghost" onClick={onClose}>
                Cancel
              </Button>
              <Button animation={isLoading ? 'progress' : false} disabled={isLoading || isInvalid()} onClick={placeBidOnNFT}>
                Confirm
              </Button>
            </div>
          </div>
        </div>
      </Modal.Panel>
    </Modal>
  );
}

