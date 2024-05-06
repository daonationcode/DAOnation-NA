import { Button, IconButton, Modal } from '@heathmont/moon-core-tw';
import { ControlsClose, ControlsPlus } from '@heathmont/moon-icons-tw';
import { NFTStorage } from 'nft.storage';
import { useEffect, useState } from 'react';
import UseFormInput from '../../components/components/UseFormInput';
import UseFormTextArea from '../../components/components/UseFormTextArea';
import useContract from '../../services/useContract';
import AddImageInput from '../../components/components/AddImageInput';
import ImageListDisplay from '../../components/components/ImageListDisplay';
import { usePolkadotContext } from '../../contexts/PolkadotContext';
import Required from '../../components/components/Required';

import { toast } from 'react-toastify';
import useEnvironment from '../../services/useEnvironment';
import { useUniqueVaraContext } from '../../contexts/UniqueVaraContext';
 declare let window;
let addedDate = false;
export default function CreateEventModal({ open, onClose, daoId }) {
  const [EventImage, setEventImage] = useState([]);
  const [creating, setCreating] = useState(false);
  const { sendTransaction } = useContract();
  const { api, userInfo, showToast, userWalletPolkadot, userSigner, PolkadotLoggedIn } = usePolkadotContext();
  const {createEventInVara,VaraLoggedIn} = useUniqueVaraContext();
  const { isServer } = useEnvironment();

  //Storage API for images and videos
  const NFT_STORAGE_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDJDMDBFOGEzZEEwNzA5ZkI5MUQ1MDVmNDVGNUUwY0Q4YUYyRTMwN0MiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY1NDQ3MTgxOTY2NSwibmFtZSI6IlplbmNvbiJ9.6znEiSkiLKZX-a9q-CKvr4x7HS675EDdaXP622VmYs8';
  const client = new NFTStorage({ token: NFT_STORAGE_TOKEN });

  //Input fields
  const [EventTitle, EventTitleInput] = UseFormInput({
    defaultValue: '',
    type: 'text',
    placeholder: 'Add name',
    id: ''
  });

  const [EventDescription, EventDescriptionInput] = UseFormTextArea({
    defaultValue: '',
    placeholder: 'Add Description',
    id: '',
    rows: 4
  });

  const [EndDate, EndDateInput, setEndDate] = UseFormInput({
    defaultValue: '',
    type: 'date',
    placeholder: 'End date',
    id: 'enddate'
  });

  const [Budget, BudgetInput] = UseFormInput({
    defaultValue: '',
    type: 'number',
    placeholder: '0.00',
    id: 'event'
  });

  async function CheckTransaction() {
    let params = new URL(window.location.href).searchParams;
    if (params.get('transactionHashes') !== null) {
      window.location.href = `/daos`;
    }
  }

  if (!isServer()) {
    // All this kinda stuff should be in useEffects()
    CheckTransaction();
  }

  //Function after clicking Create Event Button
  async function createEvent() {
    setCreating(true);

    const ToastId = toast.loading('Uploading IPFS ...');
    let allFiles = [];
    for (let index = 0; index < EventImage.length; index++) {
      //Gathering all files link
      const element = EventImage[index];
      const metadata = await client.storeBlob(element);
      const urlImageEvent = {
        url: 'https://' + metadata + '.ipfs.nftstorage.link',
        type: element.type
      };
      allFiles.push(urlImageEvent);
    }

    //Creating an object of all information to store in EVM
    const createdObject = {
      title: 'Asset Metadata',
      type: 'object',
      properties: {
        Title: {
          type: 'string',
          description: EventTitle
        },
        Description: {
          type: 'string',
          description: EventDescription
        },
        Budget: {
          type: 'string',
          description: Budget
        },
        End_Date: {
          type: 'string',
          description: EndDate
        },
        user_id: {
          type: 'string',
          description: window.userid
        },
        wallet: {
          type: 'string',
          description: window.signerAddress
        },
        logo: {
          type: 'string',
          description: allFiles[0]
        },
        allFiles
      }
    };
    console.log('======================>Creating Event');
    toast.update(ToastId, { render: 'Creating Event...', isLoading: true });

    let feed = {
      name: userInfo?.fullName,
      daoId: daoId,
      eventid: null,
      budget: Budget
    };

    async function onSuccess() {
      setCreating(false);
      onClose({ success: true });
      window.location.reload();
    }
    if (VaraLoggedIn) {
      // let eventid = Number(await api._query.events.eventIds());
      // feed.eventid = 'p_' + eventid;
      // const txs = [api._extrinsics.events.createEvent(JSON.stringify(createdObject), daoId, Number(window.userid), JSON.stringify(feed)), api._extrinsics.feeds.addFeed(JSON.stringify(feed), 'event', new Date().valueOf())];
      // const transfer = api.tx.utility.batch(txs).signAndSend(userWalletPolkadot, { signer: userSigner }, (status) => {
      //   showToast(status, ToastId, 'Created successfully!', () => {
      //     onSuccess();
      //   });
      // });
      await createEventInVara();
    } else {
      try {
        const eventid = Number(await window.contractUnique._event_ids());
        feed.eventid = eventid;

        // Creating Event in Smart contract
        await sendTransaction(await window.contractUnique.populateTransaction.create_event(JSON.stringify(createdObject),window.selectedAddress, daoId, Number(window.userid), JSON.stringify(feed)));
        toast.update(ToastId, {
          render: 'Created Successfully!',
          type: 'success',
          isLoading: false,
          autoClose: 1000,
          closeButton: true,
          closeOnClick: true,
          draggable: true
        });
        onSuccess();
      } catch (error) {
        setCreating(false);
        console.error(error);

        return;
      }
    }
  }

  function FilehandleChange(event) {
    // If user uploaded images/videos
    var allNames = [];
    for (let index = 0; index < event.target.files.length; index++) {
      const element = event.target.files[index].name;
      allNames.push(element);
    }
    for (let index2 = 0; index2 < event.target.files.length; index2++) {
      setEventImage((pre) => [...pre, event.target.files[index2]]);
    }
  }

  function AddBTNClick(event) {
    //Clicking on +(Add) Function
    var EventImagePic = document.getElementById('EventImage');
    EventImagePic.click();
  }

  function DeleteSelectedImages(imageId) {
    //Deleting the selected image
    var newImages = [];
    var allUploadedImages = document.getElementsByName('deleteBTN');
    for (let index = 0; index < EventImage.length; index++) {
      if (index != imageId) {
        const elementDeleteBTN = allUploadedImages[index];
        elementDeleteBTN.setAttribute('id', newImages.length.toString());
        const element = EventImage[index];
        newImages.push(element);
      }
    }
    setEventImage(newImages);
  }

  function isInvalid() {
    return !(EventTitle && EventDescription && Budget && EndDate && EventImage.length > 0);
  }

  useEffect(() => {
    let dateTime = new Date();
    if (!addedDate) setEndDate(dateTime.toISOString().split('T')[0]);
  }, []);

  return (
    <Modal open={open} onClose={onClose}>
      <Modal.Backdrop />
      <Modal.Panel className="bg-gohan w-[90%] max-w-[600px] max-h-[90vh]">
        <div className={`flex items-center justify-center flex-col`}>
          <div className="flex justify-between items-center w-full border-b border-beerus py-4 px-6">
            <h1 className="text-moon-20 font-semibold">Create event</h1>
            <IconButton className="text-trunks" variant="ghost" icon={<ControlsClose />} onClick={onClose} />
          </div>
          <div className="flex flex-col gap-6 w-full p-6  max-h-[calc(90vh-162px)] overflow-auto">
            <div className="flex flex-col gap-2">
              <h6>
                Event name
                <Required />
              </h6>
              {EventTitleInput}
            </div>

            <div className="flex flex-col gap-2">
              <h6>
                Description
                <Required />
              </h6>
              {EventDescriptionInput}
            </div>
            <div className="flex gap-8 w-full">
              <div className="flex flex-col gap-2 w-full">
                <h6>
                  Fundraise target (in USD)
                  <Required />
                </h6>
                {BudgetInput}
              </div>
            </div>
            <div className="flex gap-8 w-full">
              <div className="flex-1">
                <h6>
                  End Date
                  <Required />
                </h6>
                {EndDateInput}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <h6>
                Image
                <Required />
              </h6>
              <div className="content-start flex flex-row flex-wrap gap-4 justify-start overflow-auto relative text-center text-white w-full">
                <input className="file-input" hidden onChange={FilehandleChange} accept="image/*" id="EventImage" name="EventImage" type="file" />
                <div className="flex flex-col">
                  {EventImage.length < 1 && <AddImageInput onClick={AddBTNClick} />}
                  <ImageListDisplay images={EventImage} onDeleteImage={DeleteSelectedImages} />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-between border-t border-beerus w-full p-6">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button id="CreateEventBTN" animation={creating ? 'progress' : false} disabled={creating || isInvalid()} onClick={createEvent}>
            <ControlsPlus className="text-moon-24" />
            Create event
          </Button>
        </div>
      </Modal.Panel>
    </Modal>
  );
}
