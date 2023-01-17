// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

import "./AcademicTypes.sol";
import "./IAlunoContract.sol";
import "./IDisciplinaContract.sol";

import "hardhat/console.sol";


/**
 * @title Academic
 * @dev Academic system contract
 */
contract Academic {

   Periodo public etapa;   
   address public owner;
   
   address _disciplinaContractAddr;
   address _professorContractAddr;
   address _alunoContractAddr;
   
   
   constructor(){
       etapa = Periodo.INSCRICAO;
       owner = msg.sender;
   }

   modifier onlyOwner(){
       require(msg.sender == owner, "Nao autorizado.");
       _;
   }

    
    function setAlunoContractAddress(address alunoContractAddr) public onlyOwner{
       _alunoContractAddr = alunoContractAddr;
    }

   function setDisciplinaContractAddress(address disciplinaContractAddr) public onlyOwner
    {
        _disciplinaContractAddr = disciplinaContractAddr;
    }
    
    function setProfessorContractAddress(address professorContractAddr) public onlyOwner
    {
        _professorContractAddr = professorContractAddr;
    }

    function fecharPeriodo() onlyOwner public  {
        etapa = Periodo.FIM_PERIODO;
    }

    function abrirInscricoes() onlyOwner public  {
        etapa = Periodo.INSCRICAO;
    }
   function abrirLancamentoNota() onlyOwner public {
       etapa = Periodo.LANCAMENTO_NOTAS;
   }
   



  




}
