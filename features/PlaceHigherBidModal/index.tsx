import { MouseEventHandler, useEffect, useState } from 'react';
import { Button, Dropdown, IconButton, MenuItem, Modal } from '@heathmont/moon-core-tw';
import { ControlsClose } from '@heathmont/moon-icons-tw';
import UseFormInput from '../../components/components/UseFormInput';
import useEnvironment from '../../services/useEnvironment';
import { NFT } from '../../data-model/nft';

export default function PlaceHigherBidModal({ open, onClose, item }: { open: boolean; onClose: () => void; item: NFT }) {
  const [Balance, setBalance] = useState();
  const [coin, setCoin] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { getCurrency } = useEnvironment();

  const [Amount, AmountInput] = UseFormInput({
    defaultValue: '',
    type: 'number',
    placeholder: '0.00',
    id: 'amount',
    className: 'max-w-[140px]'
  });

  async function placeBidOnNFT() {
    console.log('PLACE BID');
  }

  async function LoadData() {}

  function isInvalid() {
    return !Amount;
  }

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
                  <span className="font-semibold flex-1">Total</span>
                  <div className="max-w-[140px] mr-4"> {AmountInput}</div>
                  <Dropdown value={coin} onChange={setCoin} className="max-w-[100px] ">
                    <Dropdown.Select>{coin}</Dropdown.Select>
                    <Dropdown.Options className="bg-gohan w-48 min-w-0">
                      <Dropdown.Option value="DOT">
                        <MenuItem>DOT</MenuItem>
                      </Dropdown.Option>
                      <Dropdown.Option value="DEV">
                        <MenuItem>DEV</MenuItem>
                      </Dropdown.Option>
                      <Dropdown.Option value="xcvGLMR">
                        <MenuItem>xcvGLMR</MenuItem>
                      </Dropdown.Option>
                      <Dropdown.Option value="tBNB">
                        <MenuItem>BNB</MenuItem>
                      </Dropdown.Option>
                      <Dropdown.Option value="CELO">
                        <MenuItem>CELO</MenuItem>
                      </Dropdown.Option>
                      <Dropdown.Option value="GoerliETH">
                        <MenuItem>ETH</MenuItem>
                      </Dropdown.Option>
                    </Dropdown.Options>
                  </Dropdown>
                </div>

                <p className="text-trunks w-full text-right">Your balance will be {Number(Balance) - AmountInput + ' ' + getCurrency()} </p>
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
