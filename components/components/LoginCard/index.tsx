import Image from 'next/legacy/image';
import Card from '../Card';
import { Button } from '@heathmont/moon-core-tw';
import { SoftwareLogin } from '@heathmont/moon-icons-tw';
import UseFormInput from '../UseFormInput';
import { usePolkadotContext } from '../../../contexts/PolkadotContext';
import { toast } from 'react-toastify';

const LoginCard = ({ step, onConnectMetamask, onConnectPolkadot, setStep }) => {
  const { api, deriveAcc, showToast, EasyToast } = usePolkadotContext();

  const [Email, EmailInput] = UseFormInput({
    defaultValue: '',
    type: 'text',
    placeholder: 'Email',
    id: ''
  });

  const [Password, PasswordInput] = UseFormInput({
    defaultValue: '',
    type: 'password',
    placeholder: 'Password',
    id: ''
  });

  async function OnClickLoginStep1() {
    const ToastId = toast.loading('Logging in  ...');
    let totalUserCount = Number(await api._query.users.userIds());
    var found = false;
    for (let i = 0; i < totalUserCount; i++) {
      const element = await api._query.users.userById(i);
      if (element.email.toString() == Email && element.password.toString() == Password) {
        found = true;
        localStorage.setItem('user_id', i.toString());
        EasyToast('Logged in Successfully!', 'success', true, ToastId.toString());

        setStep(2);
        return;
      } else {
        found = false;
      }
    }
    if (!found) {
      EasyToast('Incorrect email or password!', 'error', true, ToastId.toString());
    }
  }

  function isDisabled() {
    return !(Email && Password);
  }

  const LoginForm = () => (
    <Card className="max-w-[480px]">
      <div className="flex w-full flex-col gap-10">
        <div className="flex flex-1 justify-between items-center relative text-moon-16">
          <div className="flex flex-col gap-6 w-full">
            <div className="flex flex-col gap-2">
              <h6>Email</h6>
              {EmailInput}
            </div>
            <div className="flex flex-col gap-2">
              <h6>Password</h6>
              {PasswordInput}
            </div>
          </div>
        </div>
        <div className="flex w-full justify-end">
          <Button onClick={OnClickLoginStep1} disabled={isDisabled()}>
            Next
          </Button>
        </div>
      </div>
    </Card>
  );

  const ConnectMetamaskButton = () => (
    <Card className="max-w-[480px]">
      <div className="flex w-full flex-col gap-10">
        <div className="flex items-center w-full justify-between">
          <div className="rounded-moon-s-md border border-beerus p-2 mr-6 min-w-[84px]">
            <Image height={64} width={64} src="https://metamask.io/images/metamask-logo.png" alt="" />
          </div>
          <div className="flex flex-col justify-between xs:flex-row xs:w-full">
            <p className="font-bold text-moon-20 flex-1">Metamask</p>
            <Button className="min-w-[175px] xs:min-w-0" iconLeft={<SoftwareLogin />} onClick={onConnectMetamask}>
              Connect
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );

  const ConnectPolkadotButton = () => (
    <Card className="max-w-[480px] w-full">
      <div className="flex w-full flex-col gap-10">
        <div className="flex items-center w-full justify-between">
          <div className="rounded-moon-s-md border border-beerus p-2 mr-6 min-w-[84px]">
            <Image height={64} width={64} src="/images/polkadot.svg" alt="" />
          </div>
          <div className="flex flex-col justify-between xs:flex-row xs:w-full">
            <p className="font-bold text-moon-20 flex-1">Polkadot JS</p>
            <Button className="min-w-[175px] xs:min-w-0" iconLeft={<SoftwareLogin />} onClick={onConnectPolkadot}>
              Connect
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );

  const ConnectVaraButton = () => (
    <Card className="max-w-[480px] w-full">
      <div className="flex w-full flex-col gap-10">
        <div className="flex items-center w-full justify-between">
          <div className="rounded-moon-s-md mr-6 min-w-[84px]">
            <Image height={80} width={80} src="/images/vara.svg" alt="" />
          </div>
          <div className="flex flex-col justify-between xs:flex-row xs:w-full">
            <p className="font-bold text-moon-20 flex-1">Vara Network</p>
            <Button disabled className="min-w-[175px] xs:min-w-0" iconLeft={<SoftwareLogin />}>
              Connect
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );

  return (
    <>
      {step == 1 && LoginForm()}
      {step == 2 && (
        <div className="flex flex-col gap-4 w-full items-center">
          {ConnectPolkadotButton()}
          <div>Or</div>
          {ConnectMetamaskButton()}
          <div>Or</div>
          {ConnectVaraButton()}
        </div>
      )}
    </>
  );
};

export default LoginCard;
