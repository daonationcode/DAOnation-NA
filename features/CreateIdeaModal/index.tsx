import { Button, IconButton, Modal } from '@heathmont/moon-core-tw';
import { ControlsClose, ControlsPlus } from '@heathmont/moon-icons-tw';
import { NFTStorage } from 'nft.storage';
import React, { useState, useEffect } from 'react';
import UseFormInput from '../../components/components/UseFormInput';
import UseFormTextArea from '../../components/components/UseFormTextArea';
import useContract from '../../services/useContract';
import AddImageInput from '../../components/components/AddImageInput';
import ImageListDisplay from '../../components/components/ImageListDisplay';
import { usePolkadotContext } from '../../contexts/PolkadotContext';
import Required from '../../components/components/Required';

import { toast } from 'react-toastify';
import useEnvironment from '../../services/useEnvironment';

export default function CreateIdeaModal({ show, onClose, daoId, goalId, goalTitle }) {
  const [IdeasImage, setIdeasImage] = useState([]);
  const [creating, setCreating] = useState(false);
  const [RecieveType, setRecieveType] = useState('EVM');

  const { contract, sendTransaction } = useContract();
  const { userInfo, PolkadotLoggedIn, userWalletPolkadot, showToast, userSigner, api } = usePolkadotContext();
  const { isServer } = useEnvironment();

  useEffect(() => {
    if (!PolkadotLoggedIn) {
      setRecieveType('Polkadot');
    } else {
      setRecieveType('EVM');
    }
  }, [PolkadotLoggedIn]);

  if (isServer()) return null;

  //Storage API for images and videos
  const NFT_STORAGE_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDJDMDBFOGEzZEEwNzA5ZkI5MUQ1MDVmNDVGNUUwY0Q4YUYyRTMwN0MiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY1NDQ3MTgxOTY2NSwibmFtZSI6IlplbmNvbiJ9.6znEiSkiLKZX-a9q-CKvr4x7HS675EDdaXP622VmYs8';
  const client = new NFTStorage({ token: NFT_STORAGE_TOKEN });

  //Input fields
  const [IdeasTitle, IdeasTitleInput] = UseFormInput({
    defaultValue: '',
    type: 'text',
    placeholder: 'Ideas name',
    id: ''
  });

  const [RecieveWallet, RecieveWalletInput, setRecieveWallet] = UseFormInput({
    defaultValue: '',
    type: 'text',
    placeholder: `Wallet Address (${RecieveType})`,
    id: 'recipient'
  });
  const [Referenda, ReferendaInput] = UseFormInput({
    defaultValue: '',
    type: 'text',
    placeholder: 'Referenda ID',
    id: ''
  });
  const [IdeasDescription, IdeasDescriptionInput] = UseFormTextArea({
    defaultValue: '',
    placeholder: 'Ideas Description',
    id: '',
    rows: 4
  });

  const [Qoutation1, Qoutation1Input] = UseFormInput({
    defaultValue: '',
    type: 'text',
    placeholder: 'Give link to quotation ',
    id: 'qoutation1'
  });
  const [Qoutation2, Qoutation2Input] = UseFormInput({
    defaultValue: '',
    type: 'text',
    placeholder: 'Give total prize of the quatation',
    id: 'qoutation2'
  });

  let StructureLeft = {
    0: 'Representatives Berlin',
    1: 'Community',
    2: 'Children'
  };
  let StructureRight = {
    0: '20%',
    1: '70%',
    2: '10%'
  };

  //Function after clicking Create Ideas Button
  async function createIdeas() {
    const ToastId = toast.loading('Uploading IPFS ...');
    setCreating(true);

    var CreateIdeasBTN = document.getElementById('CreateIdeasBTN') as HTMLButtonElement;
    CreateIdeasBTN.disabled = true;
    let allFiles = [];
    for (let index = 0; index < IdeasImage.length; index++) {
      //Gathering all files link
      const element = IdeasImage[index];
      const metadata = await client.storeBlob(element);
      const urlImageIdeas = {
        url: 'https://' + metadata + '.ipfs.nftstorage.link',
        type: element.type
      };
      allFiles.push(urlImageIdeas);
    }

    var smart_contracts = [
      JSON.stringify({
        link: Qoutation1,
        prize: Qoutation2
      })
    ];

    //Creating an object of all information to store in EVM
    const createdObject = {
      title: 'Asset Metadata',
      type: 'object',
      properties: {
        Title: {
          type: 'string',
          description: IdeasTitle
        },
        Description: {
          type: 'string',
          description: IdeasDescription
        },
        Referenda: {
          type: 'number',
          description: Number(Referenda)
        },
        StructureLeft: {
          type: 'string',
          description: Object.values(StructureLeft)
        },
        StructureRight: {
          type: 'string',
          description: Object.values(StructureRight)
        },
        Qoutation: {
          link: Qoutation1,
          prize: Qoutation2
        },
        wallet: {
          type: 'string',
          description: window.signerAddress
        },
        recieve_wallet: {
          type: 'string',
          description: RecieveWallet
        },
        user_id: {
          type: 'string',
          description: window.userid
        },
        logo: {
          type: 'string',
          description: allFiles[0]
        },
        allFiles
      }
    };
    console.log('======================>Creating Ideas');
    toast.update(ToastId, { render: 'Creating Ideas...', isLoading: true });

    let feed = {
      name: userInfo?.fullName.toString(),
      goalTitle: goalTitle,
      ideasid: null,
      daoId: daoId
    };

    async function onSuccess() {
      setCreating(false);
      onClose({ success: true });
      window.location.reload();
    }
    if (PolkadotLoggedIn) {
      let ideasId = Number(await api._query.ideas.ideasIds());
      feed.ideasid = 'p_' + ideasId;
      const txs = [api._extrinsics.ideas.createIdeas(JSON.stringify(createdObject), goalId, daoId, window.userid, JSON.stringify(feed)), api._extrinsics.feeds.addFeed(JSON.stringify(feed), 'idea', new Date().valueOf())];

      const transfer = api.tx.utility.batch(txs).signAndSend(userWalletPolkadot, { signer: userSigner }, (status) => {
        showToast(status, ToastId, 'Created successfully!', () => {
          onSuccess();
        });
      });
    } else {
      try {
        const ideasid = Number(await contract._ideas_ids());
        feed.ideasid = 'm_' + ideasid;

        // Creating Ideas in Smart contract
        await sendTransaction(await window.contract.populateTransaction.create_ideas(JSON.stringify(createdObject), goalId, smart_contracts, Number(window.userid), JSON.stringify(feed)));
        toast.update(ToastId, {
          render: 'Created Successfully!',
          type: 'success',
          isLoading: false,
          autoClose: 1000,
          closeButton: true,
          closeOnClick: true,
          draggable: true
        });
        setCreating(false);
        onClose({ success: true });

        window.location.reload();
      } catch (error) {
        console.error(error);
        setCreating(false);

        return;
      }
    }
  }

  function CreateIdeasBTN() {
    return (
      <>
        <div className="flex gap-4 justify-end">
          <Button id="CreateIdeasBTN" animation={creating ? 'progress' : false} disabled={creating || isInvalid()} onClick={createIdeas}>
            <ControlsPlus className="text-moon-24" />
            Create idea
          </Button>
        </div>
      </>
    );
  }
  function FilehandleChange(ideas) {
    // If user uploaded images/videos
    var allNames = [];
    for (let index = 0; index < ideas.target.files.length; index++) {
      const element = ideas.target.files[index].name;
      allNames.push(element);
    }
    for (let index2 = 0; index2 < ideas.target.files.length; index2++) {
      setIdeasImage((pre) => [...pre, ideas.target.files[index2]]);
    }
  }

  async function CheckTransaction() {
    let params = new URL(window.location.href).searchParams;
    if (params.get('transactionHashes') !== null) {
      window.location.href = `daos/dao/goal?[${goalId}]`;
    }
  }

  CheckTransaction();

  function AddBTNClick(ideas) {
    //Clicking on +(Add) Function
    var IdeasImagePic = document.getElementById('IdeasImage');
    IdeasImagePic.click();
  }

  function DeleteSelectedImages(idImage) {
    var newImages = [];
    var allUploadedImages = document.getElementsByName('deleteBTN');
    for (let index = 0; index < IdeasImage.length; index++) {
      if (index != idImage) {
        const elementDeleteBTN = allUploadedImages[index];
        elementDeleteBTN.setAttribute('id', newImages.length.toString());
        const element = IdeasImage[index];
        newImages.push(element);
      }
    }
    setIdeasImage(newImages);
  }

  function isInvalid() {
    return !(IdeasTitle && IdeasDescription && IdeasImage.length > 0);
  }

  return (
    <Modal open={show} onClose={onClose}>
      <Modal.Backdrop />
      <Modal.Panel className="bg-gohan w-[90%] max-w-[600px] max-h-[90vh]">
        <div className="flex items-center justify-center flex-col">
          <div className="flex justify-between items-center w-full border-b border-beerus py-4 px-6">
            <h1 className="text-moon-20 font-semibold">Create idea</h1>
            <IconButton className="text-trunks" variant="ghost" icon={<ControlsClose />} onClick={onClose} />
          </div>
          <div className="flex flex-col gap-6 w-full p-6 max-h-[calc(90vh-162px)] overflow-auto">
            <div className="flex flex-col gap-2">
              <h6>
                Idea name
                <Required />
              </h6>
              {IdeasTitleInput}
            </div>

            <div className="flex flex-col gap-2">
              <h6>
                Description
                <Required />
              </h6>
              {IdeasDescriptionInput}
            </div>
            <div className="flex flex-col gap-2">
              <h6>
                Recipeint
                <Required />
              </h6>
              {RecieveWalletInput}
            </div>
            {/* <div className="flex flex-col gap-2">
              <h6>Referenda (Optional)</h6>
              {ReferendaInput}
            </div> */}

            <div className="flex flex-col gap-2">
              <h6>
                Image
                <Required />
              </h6>
              <div className="content-start flex flex-row flex-wrap gap-4 justify-start overflow-auto p-1 relative text-center text-white w-full">
                <input className="file-input" hidden onChange={FilehandleChange} accept="image/*" id="IdeasImage" name="IdeasImage" type="file" multiple />
                <div className="flex flex-col gap-4">
                  {!IdeasImage.length && <AddImageInput onClick={AddBTNClick} />}
                  <ImageListDisplay images={IdeasImage} onDeleteImage={DeleteSelectedImages} />
                </div>
              </div>
            </div>

            {/* <div className="flex flex-col gap-2">
              <h6>Rules</h6>

              <div className="content-start gap-8 flex flex-row flex-wrap h-full justify-start ">
                <div className="flex gap-8 w-full">
                  <div className="flex-1">{Qoutation1Input}</div>
                  <div className="flex-1">{Qoutation2Input}</div>
                </div>

                <Button>
                  <ControlsPlus className="text-moon-24" />
                  Add smart contract
                </Button>
              </div>
            </div> */}
          </div>
        </div>
        <div className="flex justify-between border-t border-beerus w-full p-6">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <CreateIdeasBTN />
        </div>
      </Modal.Panel>
    </Modal>
  );
}
