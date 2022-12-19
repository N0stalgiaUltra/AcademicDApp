// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;
import "./AcademicTypes.sol";

contract DisciplinaContract{

    uint discId;
    string discName;
    address discProf;

    mapping(uint => uint[]) alunosInscritos;

    uint discPrice;
    uint public DiscPrice = discPrice; 

    constructor(uint id, string memory nome, address professor, uint price){
        discId = id;
        discName = nome;        
        discProf = professor;
        discPrice = price;
    }


}