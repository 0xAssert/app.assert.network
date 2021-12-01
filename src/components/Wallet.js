import { useEffect, useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import { formatEther } from '@ethersproject/units'

import { useAuth } from 'hooks/useAuth';
import { injected } from 'services/connectors';

function ChainId() {
  const { chainId } = useWeb3React()

  return (
    <>
      <span>Chain Id</span>
      <span role="img" aria-label="chain">
        ⛓
      </span>
      <span>{chainId ?? ''}</span>
    </>
  )
}

function BlockNumber() {
  const { chainId, library } = useWeb3React()

  const [blockNumber, setBlockNumber] = useState()
  useEffect((): any => {
    if (!!library) {
      let stale = false

      library
        .getBlockNumber()
        .then((blockNumber: number) => {
          if (!stale) {
            setBlockNumber(blockNumber)
          }
        })
        .catch(() => {
          if (!stale) {
            setBlockNumber(null)
          }
        })

      const updateBlockNumber = (blockNumber: number) => {
        setBlockNumber(blockNumber)
      }
      library.on('block', updateBlockNumber)

      return () => {
        stale = true
        library.removeListener('block', updateBlockNumber)
        setBlockNumber(undefined)
      }
    }
  }, [library, chainId]) // ensures refresh if referential identity of library doesn't change across chainIds

  return (
    <>
      <span>Block Number</span>
      <span role="img" aria-label="numbers">
        🔢
      </span>
      <span>{blockNumber === null ? 'Error' : blockNumber ?? ''}</span>
    </>
  )
}

function Account() {
  const { account } = useWeb3React()

  return (
    <>
      <span>Account</span>
      <span role="img" aria-label="robot">
        🤖
      </span>
      <span>
        {account === null
          ? '-'
          : account
          ? `${account.substring(0, 6)}...${account.substring(account.length - 4)}`
          : ''}
      </span>
    </>
  )
}

function Balance() {
  const { account, library, chainId } = useWeb3React()

  const [balance, setBalance] = useState()
  useEffect((): any => {
    if (!!account && !!library) {
      let stale = false

      library
        .getBalance(account)
        .then((balance: any) => {
          if (!stale) {
            setBalance(balance)
          }
        })
        .catch(() => {
          if (!stale) {
            setBalance(null)
          }
        })

      return () => {
        stale = true
        setBalance(undefined)
      }
    }
  }, [account, library, chainId]) // ensures refresh if referential identity of library doesn't change across chainIds

  return (
    <>
      <span>Balance</span>
      <span role="img" aria-label="gold">
        💰
      </span>
      <span>{balance === null ? 'Error' : balance ? `Ξ${formatEther(balance)}` : ''}</span>
    </>
  )
}

function Header() {
  const { active, error } = useWeb3React()

  return (
    <>
      <h1 style={{ margin: '1rem', textAlign: 'right' }}>{active ? '🟢' : error ? '🔴' : '🟠'}</h1>
      <h3
        style={{
          display: 'grid',
          gridGap: '1rem',
          gridTemplateColumns: '1fr min-content 1fr',
          maxWidth: '20rem',
          lineHeight: '2rem',
          margin: 'auto'
        }}
      >
        <ChainId />
        <BlockNumber />
        <Account />
        <Balance />
      </h3>
    </>
  )
}

const Wallet = () => {
  const [state, setState] = useState({
    balance: null
  });
  const { active, activate, account, chainId, deactivate, library } = useAuth();
  useEffect(async() => {
    if (!!library && !!account)
    activate(injected);
    /*
    setState({
      ...state,
      balance: await library.getBalance(account) 
    });
    */
  }, [library]);
  if (!active) return (
    <div onClick={() => {
      activate(injected);
      //activate(new InjectedConnector({}));
      //await activate(new InjectedConnector({ supportedChainIds: [1, 42, 1337] }));
    }}>
      <a href="#">Connect Wallet</a>
    </div>
  );
  return(
    <>
      <div>
        <p>You are logged in!</p>
        <p>Account: {account}</p>
        <p>Chain: {chainId}</p>
      </div>    
      {/*
      <BlockNumber />
      <span>Balance</span>
      <span role="img" aria-label="gold">
        💰
      </span>
      <span>{state.balance === null ? 'Error' : state.balance ? `Ξ${formatEther(state.balance)}` : ''}</span>
      */}
      <br/>
      <div onClick={async () => {
        if (!!library && !!account) {
          const signature = await library.getSigner(account).signMessage('👋');
          console.log(signature);
          console.log(await library.listAccounts());
          console.log(formatEther(await library.getBalance(account)));
        } else {
          console.log('no library');
        }
        //console.log(await library.getBalance(account));
        //console.log(await library)
      }}>
        <a href="#">Click me to sign a message</a>
      </div>
      <br/>
      <div onClick={deactivate}>
        <a href="#">Disconnect Wallet</a>
      </div>
    </>
  );
};
export default Wallet;