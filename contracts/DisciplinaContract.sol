// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

import "./AcademicTypes.sol";
import "./Academic.sol";
import "./IDisciplinaContract.sol";
import "./ProfessorContract.sol";

contract DisciplinaContract is IDisciplinaContract{

    mapping(uint => Disciplina) disciplinaById;
    mapping(uint => uint[]) alunosByDisciplina;

    address public owner;

    
    address _alunoContractAddr;
    address _academicContractAddr;
    address _professorContractAddr;

    modifier onlyOwner(){
       require(msg.sender == owner, "Nao autorizado.");
       _;
    }
    
    constructor(address academicContractAddr){
        _academicContractAddr = academicContractAddr;
    }

   function inserirDisciplina(uint id, string memory nome, address professor)  public onlyOwner{
    
    require(Academic(_academicContractAddr).etapa() == Periodo.INSCRICAO, "Fora do periodo de inscricao de aluno");
     require(address(IProfessorContract(_professorContractAddr)) == address(professor),
            "Professor nao existe");
    disciplinaById[id] = Disciplina(id, nome, professor);

    }


    function getDisciplinaByID(uint id) public view override returns (Disciplina memory){
        return disciplinaById[id];

    }
    
    function pushAlunoToDisciplina(uint idAluno, uint idDisciplina) public override
    {
        require(bytes(IAlunoContract(_alunoContractAddr).getAlunoById(idAluno).nome).length!=0,
            "Aluno nao existente!"
        );
        require(bytes(getDisciplinaByID(idDisciplina).nome).length != 0,"Disciplina nao existente!"
        );
        alunosByDisciplina[idDisciplina].push(idAluno);

    }

    function getAlunosByDisciplina(uint idDisciplina) external view returns (uint256[] memory){
        return alunosByDisciplina[idDisciplina];
    }

    function setAlunoContractAddress(address alunoContractAddr)  public
    {
        _alunoContractAddr = alunoContractAddr;
    }

    function setProfessorContractAddress(address professorContractAddr) public   
    {
        _professorContractAddr = professorContractAddr;
    }
}