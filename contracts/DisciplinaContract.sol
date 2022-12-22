// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;
import "./AcademicTypes.sol";
import "./IDisciplinaContract.sol";
import "./IAlunoContract.sol";
import "./Academic.sol";




contract DisciplinaContract is IDisciplinaContract{

    mapping(uint => mapping(uint => uint8)) alunoIdToDisciplinaIdToNota;
    mapping(uint => Disciplina) disciplinaById;
    mapping(uint => uint[]) alunosByDisciplina;

    uint discId;
    string discName;
    address discProf;
    uint discPrice;
    uint public DiscPrice = discPrice; 

    address _alunoContractAddr;


    constructor(){

    }
    /*constructor(uint id, string memory nome, address professor, uint price){
        discId = id;
        discName = nome;        
        discProf = professor;
        discPrice = price;
    }*/
    
   function inserirDisciplina(uint id, string memory nome, address professor)  public {
        disciplinaById[id] = Disciplina(id, nome, professor);
   }


    function getDisciplinaByID(uint id) public view override returns (Disciplina memory){
        return disciplinaById[id];

    }
    
   function listarNotasDisciplina(uint disciplinaId) view public returns(Aluno[] memory, uint8[] memory){
       uint numAlunos = alunosByDisciplina[disciplinaId].length;

       Aluno[] memory alunos = new Aluno[](numAlunos);
       uint8[] memory notas = new uint8[](numAlunos);

       for(uint i = 0; i < numAlunos; i++){
           uint alunoId = alunosByDisciplina[disciplinaId][i];
           
           alunos[i] = IAlunoContract(_alunoContractAddr).getAlunoById(alunoId);
           notas[i] = alunoIdToDisciplinaIdToNota[alunoId][disciplinaId];
       }
       return (alunos, notas);
   }

}