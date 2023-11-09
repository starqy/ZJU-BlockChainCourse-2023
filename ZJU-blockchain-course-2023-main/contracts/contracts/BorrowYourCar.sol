// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "./MyERC20.sol" ;

// ERC721合约用于发行汽车NFT
contract BorrowYourCar is ERC721 {
    uint256 public tokenIdCounter;
    MyERC20 public myERC20; // 彩票相关的代币合约

    // 汽车结构体
    struct Car {
        address owner; // 汽车主人
        address borrower; // 汽车借用者
        uint256 borrowedTime; // 汽车借用时间
        uint256 borrowedTimeDuration;  //预期借用时长
    }

    mapping(uint256 => Car) private _cars; // 汽车NFT ID到汽车的映射


    constructor() ERC721("Car", "cNFT") {
        myERC20 = new MyERC20("CarNFTToken", "CarNFTTokenSymbol");
        tokenIdCounter = 0;
    }

    function totalSupply() public view returns(uint256){
        return tokenIdCounter;
    }

    function exists(uint256 tokenId) public view returns (bool) {
        return _cars[tokenId].owner != address(0);
    }

    // 发行一辆新的汽车NFT
    function mintCar() public  {
        tokenIdCounter++;
        _mint(msg.sender, tokenIdCounter);
        _cars[tokenIdCounter].owner = msg.sender;
    }

    // 查询某个用户拥有的汽车列表
    function getOwnedCars(address user) external view returns (uint256[] memory) {
        uint256[] memory ownedCars = new uint256[](tokenIdCounter);
        uint256 counter = 0;
        for (uint256 i = 1; i <= tokenIdCounter; i++) {
            if (ownerOf(i) == user) {
                ownedCars[counter] = i;
                counter++;
            }
        }
        return ownedCars;
    }

    // 查询当前还没有被借用的汽车列表
    function getAvailableCars() external view returns (uint256[] memory) {
        uint256[] memory availableCars = new uint256[](tokenIdCounter);
        uint256 counter = 0;
        for (uint256 i = 1; i <= tokenIdCounter; i++) {
            if (_cars[i].borrower == address(0)) {
                availableCars[counter] = i;
                counter++;
            }
        }
        return availableCars;
    }

    // 查询一辆汽车的主人和当前借用者（如果有）
    function getCarInfo(uint256 tokenId) external view returns (address owner, address borrower, uint256 borrowedTime, uint256 borrowedTimeDuration) {
        require(exists(tokenId), "CarNFT: Car does not exist");
        Car storage car = _cars[tokenId];
        return (car.owner, car.borrower, car.borrowedTime, car.borrowedTimeDuration);
    }

    // 借用一辆汽车
    function borrowCar(uint256 tokenId,uint256 WantBorrowTimeDuration) public  {
        require(exists(tokenId), "CarNFT: Car does not exist");
        require(_cars[tokenId].borrower == address(0), "CarNFT: Car is already borrowed");
        require(_cars[tokenId].owner != msg.sender, "CarNFT: You are the owner of the car");
        uint256 amount = WantBorrowTimeDuration;
        require(myERC20.balanceOf(msg.sender) >= amount, "CarNFT: Insufficient token balance");

        _cars[tokenId].borrower = msg.sender;
        _cars[tokenId].borrowedTime = block.timestamp;
        _cars[tokenId].borrowedTimeDuration = WantBorrowTimeDuration;

        myERC20.transferFrom(msg.sender, address(this), amount);
    }

    // 归还一辆汽车并使用积分支付租赁费用
    function returnCar(uint256 tokenId) public {
        require(exists(tokenId), "CarNFT: Car does not exist");
        require(_cars[tokenId].borrower == msg.sender, "CarNFT: You are not the borrower of this car");

        uint256 FactBorrowTime = block.timestamp - _cars[tokenId].borrowedTime;
        if(FactBorrowTime < _cars[tokenId].borrowedTimeDuration){
            uint256 amount = (_cars[tokenId].borrowedTimeDuration - FactBorrowTime);
            myERC20.transfer(msg.sender, amount);
        }else if(FactBorrowTime > _cars[tokenId].borrowedTimeDuration){
            uint256 amount = (FactBorrowTime - _cars[tokenId].borrowedTimeDuration);
            myERC20.transferFrom(msg.sender, address(this), amount);
        }

        myERC20.transfer(_cars[tokenId].owner, FactBorrowTime);
        _cars[tokenId].borrower = address(0);
        _cars[tokenId].borrowedTime = 0;
        _cars[tokenId].borrowedTimeDuration = 0;
    }
}  