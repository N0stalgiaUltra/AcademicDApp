// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;
import "./AcademicTypes.sol";
import "./IDisciplinaContract.sol";
import "./IAlunoContract.sol";
import {Academic} from "./Academic.sol";


contract ProfessorContract{

    address _academicContractAddr;
    address _alunoContractAddr;

    mapping(uint => Disciplina) disciplinaById;
    mapping(uint => uint[]) alunosByDisciplina;
    mapping(uint => mapping(uint => uint8)) alunoIdToDisciplinaIdToNota;

    constructor(){}

    modifier onlyProfessor(uint disciplinaId){
        Disciplina memory d = disciplinaById[disciplinaId];
        require(d.professor != address(0), "Disciplina sem professor");
        require(msg.sender == d.professor, "Nao autorizado");
        _;
    }


     function inserirNota(uint alunoId, uint disciplinaId, uint8 nota) onlyProfessor(disciplinaId) public {
       require(bytes(IAlunoContract(_alunoContractAddr).getAlunoById(alunoId).nome).length != 0, "Aluno nao existente");
       require(Academic(_academicContractAddr).etapa() == Periodo.LANCAMENTO_NOTAS, "Fora do periodo de lancamento de notas");
       //if(bytes(alunoById[alunoId].nome).length == 0){
       //   revert("Aluno nao existente");
       //}
       
       //assert(bytes(alunoById[alunoId].nome).length != 0);

       alunoIdToDisciplinaIdToNota[alunoId][disciplinaId] = nota;
       alunosByDisciplina[disciplinaId].push(alunoId);

       //AcademicUtils.soma(1, 2);
   }
}