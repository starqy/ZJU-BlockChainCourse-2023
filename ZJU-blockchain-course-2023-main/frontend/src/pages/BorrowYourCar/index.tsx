import {Button, Image} from 'antd';
import React from 'react';
// import {UserOutlined} from "@ant-design/icons";
import {useEffect, useState, ChangeEvent} from 'react';
import { web3,BorrowYourCarContract, myERC20Contract} from "../../utils/contracts";
import './index.css';
import {HexString} from "web3-types/lib/types/primitives_types";

const GanacheTestChainId = '0x539' // Ganache默认的ChainId = 0x539 = Hex(1337)
// TODO change according to your configuration
const GanacheTestChainName = 'Ganache Test Chain'
const GanacheTestChainRpcUrl = 'http://127.0.0.1:8545'



const BorrowYourCarPage = () => {

    const [account, setAccount] = useState('')
    const [accountBalance, setAccountBalance] = useState(0)
    const [OwnerCarArray, setOwnerCarArray] = useState([0])
    const [totalAmount, setTotalAmount] = useState(0)
    const [AvailableCars, setAvailableCars] = useState([0])
    const [ImageArray, setImageArray] = useState([])

    const [message, setMessage] = useState('');
    const [dialogOpen, setDialogOpen] = useState(false);
    const [sendflag, setsendflag] = useState(0);


    useEffect(() => {
        // 初始化检查用户是否已经连接钱包
        // 查看window对象里是否存在ethereum（metamask安装后注入的）对象
        const initCheckAccounts = async () => {
            // @ts-ignore
            const {ethereum} = window;
            if (Boolean(ethereum && ethereum.isMetaMask)) {
                // 尝试获取连接的用户账户
                const accounts = await web3.eth.getAccounts()
                if(accounts && accounts.length) {
                    setAccount(accounts[0])
                }
            }
        }

        initCheckAccounts()
    }, [])

    useEffect(() => {
        const getBorrowYourCarContractInfo = async () => {
            if (BorrowYourCarContract) {
                // const pa = await BorrowYourCarContract.methods.getOwnedCars().call()
                // setOwnerCarArray(pa)
                const ta = await BorrowYourCarContract.methods.totalSupply().call()
                setTotalAmount(ta)
                // const wa = await BorrowYourCarContract.methods.AvailableCars().call()
                // setAvailableCars(wa)
            } else {
                alert('Contract not exists.')
            }
        }

        getBorrowYourCarContractInfo()
    }, [])

    useEffect(() => {
        const getAccountInfo = async () => {
            if (myERC20Contract) {
                const ab = await myERC20Contract.methods.balanceOf(account).call()
                const bc:number = Number (ab)
                setAccountBalance(bc)
                console.log(accountBalance);
                console.log(ab);
            } else {
                alert('Contract not exists.')
            }
        }

        if(account !== '') {
            getAccountInfo()
        }
    }, [account])


    const onClickTokenAirdrop = async () => {
        if(account === '') {
            alert('You have not connected wallet yet.')
            return
        }

        if (myERC20Contract) {
            try {
                const transactionParameters = {
                    from: account,
                    to: myERC20Contract.options.address,
                    data: myERC20Contract.methods.airdrop().encodeABI()
                };
                // 请求 MetaMask 进行事务签名
                const result = await (window as any).ethereum.request({
                    method: 'eth_sendTransaction',
                    params: [transactionParameters],
                });

                console.log(result); // 输出事务哈希

                alert('你已经领取了10000测试积分')
            } catch (error: any) {
                alert(error.message)
            }

        } else {
            alert('Contract not exists.')
        }
    }
    const onClickMintCar = async () => {
        if(account === '') {
            alert('You have not connected wallet yet.')
            return
        }

        if (BorrowYourCarContract) {
            try {
                const transactionParameters = {
                    from: account,
                    to: BorrowYourCarContract.options.address,
                    data: BorrowYourCarContract.methods.mintCar().encodeABI()
                };
                // 请求 MetaMask 进行事务签名
                const result = await (window as any).ethereum.request({
                    method: 'eth_sendTransaction',
                    params: [transactionParameters],
                });

                console.log(result); // 输出事务哈希

                alert('You have a new Car.')
            } catch (error: any) {
                alert(error.message)
            }

        } else {
            alert('Contract not exists.')
        }
    }

    const onClickMyCar = async () => {
        if(account === '') {
            alert('You have not connected wallet yet.')
            return
        }

        if (BorrowYourCarContract) {
            try {
                const ta = await BorrowYourCarContract.methods.getOwnedCars(account).call()
                const tg = ta.filter((element:number) => element != 0)
                setOwnerCarArray(tg)
                setImageArray(tg)
                alert(`你拥有的车有：\n${tg} \n车辆信息和对应ID显示在右方`)

            } catch (error: any) {
                alert(error.message)
            }

        } else {
            alert('Contract not exists.')
        }
    }

    const onClickGetAvailableCars = async () => {
        if(account === '') {
            alert('You have not connected wallet yet.')
            return
        }

        if (BorrowYourCarContract) {
            try {
                const ta = await BorrowYourCarContract.methods.getAvailableCars().call()
                const tg = ta.filter((element:number) => element != 0)
                setAvailableCars(tg)
                setImageArray(tg)
                alert(`尚未被借用的车有\n${tg} (其中包含了自己的车) \n 车辆信息和对应ID显示在下方`)

            } catch (error: any) {
                alert(error.message)
            }

        } else {
            alert('Contract not exists.')
        }
    }

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        setMessage(event.target.value);
    };

    const onClickEnquiry = async () => {
        if(account === '') {
            alert('You have not connected wallet yet.')
            return
        }

        if (BorrowYourCarContract) {
            try {
                handleDialogOpen()
                alert("请在对话框中输入查询车辆的ID")
                setsendflag(1)
            } catch (error: any) {
                alert(error.message)
            }

        } else {
            alert('Contract not exists.')
        }
    }

    const onClickBorrow = async () => {
        if(account === '') {
            alert('You have not connected wallet yet.')
            return
        }

        if (BorrowYourCarContract && myERC20Contract) {
            try {
                handleDialogOpen()
                alert("请在对话框中输入要借用的车辆的ID和借用时间，中间用空格隔开\n例如：1 10")
                setsendflag(2)
            } catch (error: any) {
                alert(error.message)
            }

        } else {
            alert('Contract not exists.')
        }
    }

    const onClickReturn = async () => {
        if(account === '') {
            alert('You have not connected wallet yet.')
            return
        }

        if (BorrowYourCarContract && myERC20Contract) {
            try {
                handleDialogOpen()
                alert("请在对话框中输入要归还车辆的ID")
                setsendflag(3)
            } catch (error: any) {
                alert(error.message)
            }

        } else {
            alert('Contract not exists.')
        }
    }

    const handleDialogOpen = () => {
        setDialogOpen(true);
    };

    const handleDialogClose = () => {
        setDialogOpen(false);
        setMessage('');
    };

    const handleSendMessage =  async () =>  {
        console.log('发送消息:', message);
        const messageAsInt = parseInt(message, 10)
        handleDialogClose();
        switch (sendflag){
            case(1):
                try {
                    const ta = await BorrowYourCarContract.methods.getCarInfo(messageAsInt).call()
                    const message1 = `车辆:${messageAsInt} 的信息如下\n拥有者:${ta[0]}\n当前借用者:${ta[1]}\n借用时间:${ta[2]}\n预期借用时间:${ta[3]}`
                    alert(message1)
                }catch (error: any) {
                    alert(error.message)
                }
                break
            case(2):
                try {
                    const [firstInt, secondInt] = message.split(' ').map(Number);

                    const transactionParameters1 = {
                        from: account,
                        to: myERC20Contract.options.address,
                        data: myERC20Contract.methods.approve(BorrowYourCarContract.options.address, 1000).encodeABI()
                    };
                    // 请求 MetaMask 进行事务签名
                    const result1 = await (window as any).ethereum.request({
                        method: 'eth_sendTransaction',
                        params: [transactionParameters1],
                    });

                    // const result2 = await BorrowYourCarContract.methods.borrowCar(firstInt,secondInt).send({
                    //     from: account
                    // })
                    const transactionParameters2 = {
                        from: account,
                        to: BorrowYourCarContract.options.address,
                        data: BorrowYourCarContract.methods.borrowCar(firstInt,secondInt).encodeABI()
                    };
                    // 请求 MetaMask 进行事务签名
                    const result2 = await (window as any).ethereum.request({
                        method: 'eth_sendTransaction',
                        params: [transactionParameters2],
                    });

                    console.log(result2); // 输出事务哈希
                    console.log(result1); // 输出事务哈希
                    alert('You have borrowed the Car.')

                }catch (error: any) {
                    alert(error.message)
                }
                break
            case(3):
                try {
                    const transactionParameters1 = {
                        from: account,
                        to: myERC20Contract.options.address,
                        data: myERC20Contract.methods.approve(BorrowYourCarContract.options.address, 1000).encodeABI()
                    };
                    // 请求 MetaMask 进行事务签名
                    const result1 = await (window as any).ethereum.request({
                        method: 'eth_sendTransaction',
                        params: [transactionParameters1],
                    });

                    const transactionParameters2 = {
                        from: account,
                        to: BorrowYourCarContract.options.address,
                        data: BorrowYourCarContract.methods.returnCar(messageAsInt).encodeABI()
                    };
                    // 请求 MetaMask 进行事务签名
                    const result2 = await (window as any).ethereum.request({
                        method: 'eth_sendTransaction',
                        params: [transactionParameters2],
                    });

                    console.log(result1); // 输出事务哈希
                    console.log(result2); // 输出事务哈希

                    alert('You have returned the car.')
                }catch (error: any) {
                    alert(error.message)
                }
                break
        }

    };

    const onClickConnectWallet = async () => {
        // 查看window对象里是否存在ethereum（metamask安装后注入的）对象
        // @ts-ignore
        const {ethereum} = window;
        if (!Boolean(ethereum && ethereum.isMetaMask)) {
            alert('MetaMask is not installed!');
            return
        }

        try {
            // 如果当前小狐狸不在本地链上，切换Metamask到本地测试链
            if (ethereum.chainId !== GanacheTestChainId) {
                const chain = {
                    chainId: GanacheTestChainId, // Chain-ID
                    chainName: GanacheTestChainName, // Chain-Name
                    rpcUrls: [GanacheTestChainRpcUrl], // RPC-URL
                };

                try {
                    // 尝试切换到本地网络
                    await ethereum.request({method: "wallet_switchEthereumChain", params: [{chainId: chain.chainId}]})
                } catch (switchError: any) {
                    // 如果本地网络没有添加到Metamask中，添加该网络
                    if (switchError.code === 4902) {
                        await ethereum.request({ method: 'wallet_addEthereumChain', params: [chain]
                        });
                    }
                }
            }

            // 小狐狸成功切换网络了，接下来让小狐狸请求用户的授权
            await ethereum.request({method: 'eth_requestAccounts'});
            // 获取小狐狸拿到的授权用户列表
            const accounts = await ethereum.request({method: 'eth_accounts'});
            // 如果用户存在，展示其account，否则显示错误信息
            setAccount(accounts[0] || 'Not able to get accounts');
        } catch (error: any) {
            alert(error.message)
        }
    }

    interface Image {
        url: string;
        message: string;
    }

    interface CardProps {
        imageUrl: string;
        message: string;
    }

    const Card: React.FC<CardProps> = ({ imageUrl, message }) => (
        <div className="card">
            <div className="image-container">
                <img className="image" src={imageUrl} alt="Image" />
            </div>
            <div className="message1">
                {message}
            </div>
        </div>
    );

    interface CardContainerProps {
        images: Image[];
    }

    const CardContainer: React.FC<CardContainerProps> = ({ images }) => (
        <div className="card-container">
            {images.map((image, index) => (
                <Card key={index} imageUrl={image.url} message={image.message} />
            ))}
        </div>
    );

    const images = generateImagesFromArray(ImageArray)

    return (
        <div className='container'>
            <div className='sidebar'>
                <div className='account'>
                    {account === '' && <Button onClick={onClickConnectWallet}>连接钱包</Button>}
                    <div>当前用户：{account === '' ? '无用户连接' : account}</div>
                    <Button onClick={onClickTokenAirdrop}>领取租赁积分</Button>
                    <div>当前用户拥有租赁积分：{account === '' ? 0 : accountBalance}</div>
                </div>
                <Button style={{width: '200px'}} onClick={onClickMintCar}>领取车辆</Button>
                <Button style={{width: '200px'}} onClick={onClickMyCar}>我的车</Button>
                <Button style={{width: '200px'}} onClick={onClickGetAvailableCars}>可借用的车</Button>
                <Button style={{width: '200px'}} onClick={onClickEnquiry}>查询</Button>
                {dialogOpen && (sendflag === 1) && (
                    <div>
                        <input type="text" value={message} onChange={handleInputChange} />
                        <button onClick={handleSendMessage}>发送</button>
                        <button onClick={handleDialogClose}>取消</button>
                    </div>
                )}
                <Button style={{width: '200px'}} onClick={onClickBorrow}>借用</Button>
                {dialogOpen && (sendflag === 2) && (
                    <div>
                        <input type="text" value={message} onChange={handleInputChange} />
                        <button onClick={handleSendMessage}>发送</button>
                        <button onClick={handleDialogClose}>取消</button>
                    </div>
                )}
                <Button style={{width: '200px'}} onClick={onClickReturn}>归还</Button>
                {dialogOpen && (sendflag === 3) &&(
                    <div>
                        <input type="text" value={message} onChange={handleInputChange} />
                        <button onClick={handleSendMessage}>发送</button>
                        <button onClick={handleDialogClose}>取消</button>
                    </div>
                )}
            </div>
            <div className='content'>
                <div className="card-container">
                    <div>
                        <CardContainer images={images} />
                    </div>
                </div>
            </div>
        </div>
    );
}


function generateImagesFromArray(array:number[]) {
    const images = array.map((element, index) => ({
        url: `${element}.jpg`,
        message: element.toString(),
    }));

    return images;
}

export default BorrowYourCarPage