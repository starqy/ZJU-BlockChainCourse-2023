# ZJU-blockchain-course-2023

⬆ 可以️修改成你自己的项目名。

> 第二次作业要求（以下内容提交时可以删除）：
> 
> 简易汽车借用系统，参与方包括：汽车拥有者，有借用汽车需求的用户
>
> 背景：ERC-4907 基于 ERC-721 做了简单的优化和补充，允许用户对NFT进行租借。
> - 创建一个合约，在合约中发行NFT集合，每个NFT代表一辆汽车。给部分用户测试领取部分汽车NFT，用于后面的测试。
> - 在网站中，默认每个用户的汽车都可以被借用。每个用户可以： 
>    1. 查看自己拥有的汽车列表。查看当前还没有被借用的汽车列表。
>    2. 查询一辆汽车的主人，以及该汽车当前的借用者（如果有）。
>    3. 选择并借用某辆还没有被借用的汽车一定时间。
>    4. 上述过程中借用不需要进行付费。
> 
> - （Bonus）使用自己发行的积分（ERC20）完成付费租赁汽车的流程
> - 请大家专注于功能实现，网站UI美观程度不纳入评分标准，但要让用户能够舒适操作。简便起见，可以在网上找图片代表不同汽车，不需要将图片在链上进行存储。

**以下内容为作业仓库的README.md中需要描述的内容。请根据自己的需要进行修改并提交。**

作业提交方式为：**提交视频文件**和**仓库的链接**到指定邮箱。

## 如何运行

补充如何完整运行你的应用。

1. 在本地启动ganache应用。

2. 在 `./contracts` 中安装需要的依赖，运行如下的命令：
    ```bash
    npm install
    ```
    
3. 在 `./contracts` 中编译合约，运行如下的命令：
    ```bash
    npx hardhat compile
    ```
    
4. 将编译产生的 json 文件分别复制到`frontend/src/utils/abi`中

5. 在`./contracts`中部署合约，获取地址：

    ````
    npx hardhat run ./scripts/deploy.ts --network
    ````

6. 将获取到的合约地址分别复制到`frontend/src/utils/contract-addresses.json`中

7. 在 `./frontend` 中安装需要的依赖，运行如下的命令：

    ```bash
    npm install
    ```

8. 在 `./frontend` 中启动前端程序，运行如下的命令：
    ```bash
    npm run start
    ```

## 功能实现分析

1. 连接Metamask钱包

   > 通过Metamask连接到ganache本地测试网，实现账户的连接以及切换；
   >
   > 通过Metamask进行交易签名，从而完成各个交易功能；

2. 领取租赁汽车积分

   > 引入ERC20合约创建代币——租赁汽车积分；
   >
   > 用户可以领取10000个租赁积分用于完成汽车的租借；
   >
   > 领取时通过Metamask进行交易签名；
   >
   > 在用户的账号下方会显示当前账户的剩余租赁积分

3. 领取CarNFT

   > 基于ERC721合约创建CarNFT；
   >
   > 用户可以通过点击 领取车辆 按钮领取CarNFT；
   >
   > 领取时通过Metamask进行交易签名；
   >
   > 车的结构有四个内容：
   >
   > > 拥有者Owner
   > >
   > > 租用者borrower
   > >
   > > 租用时的区块时间戳borrowTime
   > >
   > > 预期的借用时长borrowTimeduration
   >
   > 在创建CarNFT时设置拥有者，其他均为零；

4. 查询自己拥有的车辆

   > 用户可以点击 我的车 按钮查询自己拥有的车辆；
   >
   > 查询结果首先通过弹窗消息显示，随后会在下方以卡片的形式展示汽车图片以及汽车ID；
   >
   > 查询自己拥有的车辆功能是通过遍历已经创建的CarNFT，判断车的拥有者是否是交易消息的发送者；
   
5. 查询可借用的车辆

   > 用户可以点击 可借用的车 按钮查询当前还未被借用的车
   >
   > 查询结果首先通过弹窗消息显示，随后会在下方以卡片的形式展示汽车图片以及ID
   >
   > 查询可借用的车辆功能是通过遍历已经创建的CarNFT，判断车的借用者是否是address（0），是的话就表示该车未被借用

6. 查询某辆车的信息，包括拥有者，借用者，借用时间以及预期借用的时长

   > 用户可以点击 查询 按钮来查询某辆车信息；
   >
   > 点击按钮之后会出现通过弹窗提示输入要查询的车辆，输入车辆ID点击发送之后就会以弹窗形式显示查询车辆的信息；
   >
   > 查询某辆车信息的功能则就是直接返回车辆结构内的消息实现

7. 借用车辆

   > 用户可以点击 借用 按钮来借用某辆车辆
   >
   > 点击按钮之后会出现弹窗提示输入要借用车辆的ID以及预期借用的时长，输入之后点击发送之后就会通过Metamask进行交易签名；
   >
   > 完成借用流程用户需要签署两笔交易，一笔是授权与预期借用时长相对应的的租赁积分给合约，另一笔则是借用交易的签名，此时会将授权的积分转让给合约；
   >
   > 借用时会进行车辆状态以及用户积分余额的判断，会通过判断借用车辆的借用者是否为address（0）来判断车辆是否被借用，然后还会判断用户的积分余额是否足够借用预期时长；

8. 归还车辆

   > 用户可以点击 归还 按钮来归还借用的车辆；
   >
   > 点击按钮之后会弹窗提示输入要归还车辆的ID，输入之后点击发送就会通过Metamask进行交易签名；
   >
   > 完成归还流程用户需要签署两笔交易，一笔是授权给合同一些租赁积分，另一笔则是归还交易的签名；
   >
   > 归还时会进行车辆借用者是否是发送交易用户判断，随后会对借用的时长进行判断，若借用时长没有超过预期的借用时长，则将归还给用户实际借用时长后剩余的租赁积分，若借用时长超过了预期的借用时长，则将超出时长对应的租赁积分交易给合约，最后，将实际借用时长对应的租赁积分转让给汽车的拥有者来完成整个交易；

## 项目运行截图

放一些项目运行截图。

项目运行成功的关键页面和流程截图。主要包括操作流程以及和区块链交互的截图。

1.编译合约

![compile](.\compile.png)

2.部署合约

![deploy](./deploy.png) 

![deploySuccess](./deploySuccess.png)

3.启动前端

![run](./run.png)

![web10](./web1.png)

4.连接钱包

![linkMetamask](./linkMetamask.png)

5.领取租赁积分

![GetPoint](./GetPoint.png)

![GetPointSuccess](./GetPointSuccess.png)

6.领取车辆

![GetCar](./GetCar.png)

![GetCarSuccess](./GetCarSuccess.png)

7.查询我的车辆

![EnquiryMyCar](./EnquiryMyCar.png)

![EnquiryMyCar](./EnquiryMyCar1.png)

8.查询可借用的车（以下已更换另一账户）

![EnquiryBorrowCar](./EnquiryBorrowCar.png)

![EnquiryBorrowCar](./EnquiryBorrowCar1.png)

9.查询某辆车车辆信息

![EnquiryCar](./Enquirycar.png)

![EnquiryCar](./EnquiryCar1.png)

9.借用车辆

![BorrowCar](./BorrowCar.png)

输入借用车辆ID和预期借用时长

![BorrowCar](./BorrowCar1.png)

授权积分签署

![BorrowCar](./BorrowCar2.png)

借用交易签署

![BorrowCar](./BorrowCar3.png)

借用成功扣除一百积分

![BorrowCar](./BorrowCar5.png)

10.归还车辆

输入归还车辆ID

![ReturnCar](./ReturnCar.png)

授权积分签署

![ReturnCar](./ReturnCar1.png)

归还交易签署

![ReturnCar](./ReturnCar2.png)

归还成功，实际借用时长大于预期借用时长，在此扣除239积分

![ReturnCar](./ReturnCar3.png)

汽车拥有者增加实际借用时长对应积分339

![ReturnCar](./ReturnCar4.png)



以上所有交易的区块：

![contractsAll](./contractsAll.png)

## 参考内容

- 课程的参考Demo见：[DEMOs](https://github.com/LBruyne/blockchain-course-demos)。

- ERC-4907 [参考实现](https://eips.ethereum.org/EIPS/eip-4907)

如果有其它参考的内容，也请在这里陈列。
