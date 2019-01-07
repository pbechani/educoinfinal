pragma solidity ^0.4.24;

import "node_modules/openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";
import "node_modules/openzeppelin-solidity/contracts/ownership/Ownable.sol";

/**
 * @title EduCoin ERC20 token
 *
 * @dev Implementation of the basic ERC20 token.
 * This is version 1 of the Educoin 
 */
contract EduCoin is ERC20, Ownable {
    string public name = "EDUCOIN";
    string public symbol = "EDU";
    uint8 public decimals = 18;
    uint public INITIAL_SUPPLY = 50000000000000000000000000;
    //address public owner; 
    uint public exchangeRate = 2;

    //enumerated type to identify the type of school
    enum SchoolType {College, Unversity, PrimarySchool, PreSchool, SecondarySchool}

    //Structure to hold information about a school
    struct School{
       string schoolName; //
       SchoolType schoolType; //specifies if investor is registered, inactive  
       bool registered;
    }
    
    mapping (address=>School) Schools; 

    //Events emitted when different milestones are executed
    event NewSchoolAdded(address _schoolAddress, string _schoolName, SchoolType _type, bool _registered);
    event SchoolRegistrationUpdated(address _schoolAdress, bool _registered);
    event FeesPayed(address _from, address _school, uint _amount, string _reference);

    /**
   * @dev Throws if called by any school is not registered.
   */
    modifier onlyRegisteredSchool() {
        require(msg.sender == owner());
        _;
    }

    /**
    * @dev EduCoin Constructor.
    */
    constructor() public {
        _mint(msg.sender, INITIAL_SUPPLY);
    }

    /**
    * @dev Get the amount of ether the contract has.
    */
    function getContractBalance() public view returns(uint) {
        return address(this).balance;
    }

    /**
    * @dev Allows administartor a Add a new school.
    * @param _schoolAddress The address to of the school
    * @param _schoolName The name of the school
    * @param _type The type of the school
    * @param _registered flag to activating or de-activating a school
    */
    function addSchool(address _schoolAddress, string _schoolName, SchoolType _type, bool _registered) public onlyOwner{
        Schools[_schoolAddress] = School(
            _schoolName,
            _type,
            _registered
        );
        /* Schools[_schoolAddress].schoolName = _schoolName; 
        Schools[_schoolAddress].registered = _registered; 
        Schools[_schoolAddress].schoolType = _type;  */
        emit NewSchoolAdded(_schoolAddress, _schoolName, _type, _registered);
    } 

    /**
    * @dev Allows administrator to make a school active or not.
    * @param _schoolAddress The address to of the school
    * @param _registered flag to activating or de-activating a school
    */
    function registerSchool(address _schoolAddress, bool _registered) public onlyOwner {
        Schools[_schoolAddress].registered = _registered;
        emit SchoolRegistrationUpdated(_schoolAddress, _registered);
    }

    /**
    * @dev Allows user to pay fees to a school.
    * @param _schoolAdd The address to of the school
    * @param _amount The amount the user paying
    * @param _reference The reference required by the schools when paying fees
    */
    function payFees(address _schoolAdd, uint _amount, string _reference) public {
        require(Schools[_schoolAdd].registered == true);
        require(msg.sender != 0x0);
        require(_schoolAdd != 0x0);
        _transfer(msg.sender, _schoolAdd, _amount);
        emit FeesPayed(msg.sender, _schoolAdd, _amount, _reference);
    }

    /**
    * @dev Allows user to buy token using ether. The value is in wei and for testing a hardcorded
    * exchange value is used.
    * The user is then credited with the equivalent value of Tokens.
    */
    function buyToken() public payable {
        require(msg.value > 0);
        uint _tokens = msg.value * exchangeRate;
        _transfer(owner(), msg.sender, _tokens);
    }

    /**
    * @dev Allows user to get information about a school.
    * @param _schoolAdd The address to of the school.
    * @param _schoolName the return name os the school.
    */
    function getSchool(address _schoolAdd) public view returns(string _schoolName, bool _registered) {
        School storage _school = Schools[_schoolAdd];
        return (_school.schoolName, _school.registered);
    }
}