// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

import "./AcademicTypes.sol";
//import {AcademicUtils} from "./AcademicUtils.sol"; //PRECISA SER INSERIDO EM OUTRO CONTRATO
import "./IAlunoContract.sol";

/**
 * @title Academic
 * @dev Academic system contract
 */
contract Academic {

   Periodo public etapa;
   
   address _alunoContractAddr;
   address owner;
   
   constructor(){
       etapa = Periodo.INSCRICAO_ALUNOS;
       owner = msg.sender;
   }

   modifier onlyOwner(){
       require(msg.sender == owner, "Nao autorizado");
       _;
   }

    
    function setAlunoContractAddress(address alunoContractAddr) public{
       _alunoContractAddr = alunoContractAddr;
    }


   function abrirLancamentoNota() onlyOwner public {
       etapa = Periodo.LANCAMENTO_NOTAS;
   }
   



  




}
