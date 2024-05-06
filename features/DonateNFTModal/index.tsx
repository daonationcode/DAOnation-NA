import { useEffect, useState } from 'react';
import { Button, Dropdown, IconButton, MenuItem, Modal } from '@heathmont/moon-core-tw';
import { ControlsClose } from '@heathmont/moon-icons-tw';
import UseFormInput from '../../components/components/UseFormInput';
import useEnvironment from '../../services/useEnvironment';
import UseFormTextArea from '../../components/components/UseFormTextArea';
import Required from '../../components/components/Required';
import Image from 'next/image';
import { toast } from 'react-toastify';
import { usePolkadotContext } from '../../contexts/PolkadotContext';
import useContract from '../../services/useContract';
declare let window;

export default function DonateNFTModal({ open, onClose, eventName, eventid }) {
  const { userInfo, PolkadotLoggedIn } = usePolkadotContext();
  const { sendTransaction } = useContract();
  const [RecieveType, setRecieveType] = useState('Unqiue');

  const [Balance, setBalance] = useState();
  const [coin, setCoin] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { getCurrency } = useEnvironment();

  //Input fields
  const [link, LinkInput] = UseFormInput({
    defaultValue: '',
    type: 'text',
    placeholder: 'Add link',
    id: 'url',
    className: 'rounded-b-none'
  });

  const [name, NameInput] = UseFormInput({
    defaultValue: '',
    type: 'text',
    placeholder: 'Add name',
    id: ''
  });

  const [description, DescriptionInput] = UseFormTextArea({
    defaultValue: '',
    placeholder: 'Add Description',
    id: 'description',
    rows: 4
  });

  const [price, PriceInput] = UseFormInput({
    defaultValue: '',
    type: 'number',
    placeholder: 'Add amount',
    id: 'price',
    className: 'max-w-[344px]'
  });

  async function DonateNFT() {
    setIsLoading(true);

    console.log('======================>Donating NFT');
    const ToastId = toast.loading('Donating NFT ...');



    async function onSuccess() {
      setIsLoading(false);
      onClose({ success: true });
      window.location.reload();
    }
    let feed = {
      name: userInfo?.fullName,
      eventid: eventid,
      nftid: null,
    };
    try {
      const nftid = Number(await window.contractUnique._nft_ids());
      feed.nftid = 'm_' + nftid;

      // Creating Event in Smart contract
      await sendTransaction(await window.contractUnique.populateTransaction.donate_nft(eventid, name, link, description, window.selectedAddress, new Date().toLocaleDateString(), (price * 1e18).toString(), Number(window.userid), userInfo?.fullName?.toString(), JSON.stringify(feed)));
      toast.update(ToastId, {
        render: 'Donated Successfully!',
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

  async function LoadData() { }

  useEffect(() => {
    LoadData();
  }, [open]);

  return (
    <Modal open={open} onClose={onClose}>
      <Modal.Backdrop />
      <Modal.Panel className="bg-gohan w-[90%] max-w-[760px] max-h-[90vh]">
        <div className={`flex items-center justify-center flex-col`}>
          <div className="flex justify-between items-center w-full border-b border-beerus py-4 px-6">
            <h1 className="text-moon-20 font-semibold">Donate NFT to {eventName}</h1>
            <IconButton className="text-trunks" variant="ghost" icon={<ControlsClose />} onClick={onClose} />
          </div>
          <form autoComplete="off" className="w-full">
            <div className="flex flex-col gap-6 w-full max-h-[calc(90vh-162px)] p-6">
              <div className="flex flex-col gap-2">
                <h6>
                  NFT URL
                  <Required />
                </h6>
                {LinkInput}
                <div className="relative h-[150px] w-full border border-beerus bg-goku -mt-2 border-t-0 rounded-b-lg">{link ? <Image unoptimized={true} src={link} alt="" objectFit="contain" layout="fill" /> : <div>No Image placeholder</div>}</div>
              </div>
              <div className="flex flex-col gap-2">
                <h6>
                  NFT name
                  <Required />
                </h6>
                {NameInput}
              </div>

              <div className="flex flex-col gap-2">
                <h6>
                  Description
                  <Required />
                </h6>
                {DescriptionInput}
              </div>
              <div className="flex flex-col gap-2">
                <h6>
                  Opening price in {getCurrency()}
                  <Required />
                </h6>
                {PriceInput}
                {price && <span className="text-moon-12 text-trunks">Equal to {price * 0.006938}$</span>}
              </div>
              
            </div>
          </form>

          <div className="flex justify-between border-t border-beerus w-full p-6">
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button animation={isLoading ? 'progress' : false} disabled={isLoading} onClick={DonateNFT}>
              Donate
            </Button>
          </div>
        </div>
      </Modal.Panel>
    </Modal>
  );
}
