//
// contracts/Version1.sol
//
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

contract Version1 is Initializable {
    uint32 public counter;
    function __Version1_init() internal onlyInitializing {
        __Version1_init_unchained();
    }
    function __Version1_init_unchained() internal onlyInitializing {
        counter = 100;
    }
    function initialize() initializer public {
        __Version1_init();
    }

    function setCounter(uint32 counter_) public {
        counter = counter_;
    }
    function getCounter() view public returns(uint32) {
        return counter;
    }

    /**
     * @dev This empty reserved space is put in place to allow future versions to add new
     * variables without shifting down storage in the inheritance chain.
     * See https://docs.openzeppelin.com/contracts/4.x/upgradeable#storage_gaps
     */
    uint256[45] private __gap;
}