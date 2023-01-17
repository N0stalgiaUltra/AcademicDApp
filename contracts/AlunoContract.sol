// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

import "./AcademicTypes.sol";
import "./Academic.sol";
import "./IAlunoContract.sol";

contract AlunoContract is IAlunoContract{

    mapping(uint => Aluno) alunoById;

    address owner;

    address private _academicContractAddr;
    address private _disciplinaContractAddr;


    modifier onlyOwner(){
       require(msg.sender == owner, "Nao autorizado");
       _;
    }

    constructor(address academicContractAddr){
       _academicContractAddr = academicContractAddr;
       owner = msg.sender;
    }

    function getAlunoById(uint id) public view override returns (Aluno memory){
        return alunoById[id];
    }

    function inserirAluno(uint id, string memory nome, address alunoAddr) onlyOwner public override{
       require(Academic(_academicContractAddr).etapa() == Periodo.INSCRICAO, "Fora do periodo de inscricao de aluno");
       require(id != 0, "Aluno inexistente");
       alunoById[id] = Aluno(id, nome, alunoAddr);
    }

    function inscreverDisciplina(uint alunoId, uint disciplinaId) onlyOwner public override{
      require(bytes(IDisciplinaContract(_disciplinaContractAddr).getDisciplinaByID(disciplinaId).nome).length != 0, "Disciplina inexistente.");
      
      require(bytes(getAlunoById(alunoId).nome).length != 0, "Aluno nao existente.");
      
      IDisciplinaContract(_disciplinaContractAddr).pushAlunoToDisciplina(alunoId, disciplinaId);
    }
    
    function setDisciplinaContractAddress(address disciplinaContractAddr) onlyOwner public
    {
        _disciplinaContractAddr = disciplinaContractAddr;
    }


}

