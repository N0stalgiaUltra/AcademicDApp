const { expect } = require("chai");
const {
    loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { ethers } = require("hardhat");


describe("Academic", function () {

    async function deployContracts() {
        
        const Academic = await hre.ethers.getContractFactory("Academic");
        const academic = await Academic.deploy();
        await academic.deployed();

        console.log(
            `Academic contract deployed to ${academic.address}`
        );
       
        const DisciplinaContract = await hre.ethers.getContractFactory("DisciplinaContract");
        const disciplinaContract =  await DisciplinaContract.deploy(academic.address);
        await disciplinaContract.deployed();
        console.log(
            `DisciplinaContract contract deployed to ${disciplinaContract.address}`
        );

        const ProfessorContract = await hre.ethers.getContractFactory("ProfessorContract");
        const professorContract = await ProfessorContract.deploy(academic.address);
        await professorContract.deployed();
        console.log(
            `ProfessorContract contract deployed to ${professorContract.address}`
        );

        const AlunoContract = await hre.ethers.getContractFactory("AlunoContract");
        const alunoContract = await AlunoContract.deploy(academic.address);
        await alunoContract.deployed();
        console.log(
            `AlunoContract contract deployed to ${alunoContract.address}`
        );

        const AcademicToken = await hre.ethers.getContractFactory("AcademicToken");
        const academicToken = await AcademicToken.deploy();
        await academicToken.deployed();
        console.log(
            `AcademicToken contract deployed to ${academicToken.address}`
        );

        const AcademicCertificate = await hre.ethers.getContractFactory("AcademicCertificate");
        const academicCertificate = await AcademicCertificate.deploy();
        await academicCertificate.deployed();
        console.log(
            `AcademicCertificate contract deployed to ${academicCertificate.address}`
        );
        
        const result = await academic.setAlunoContractAddress(alunoContract.address);
        await result.wait(1);
        console.log(
            `Aluno Contract deploy finished with success!`
        );
        
        const resultDisciplina = await academic.setDisciplinaContractAddress(disciplinaContract.address);
        await resultDisciplina.wait(1);
        console.log(
            `Changed DisciplinaContract address in Academic with success!`
        );

        const resultProfessor = await academic.setProfessorContractAddress(professorContract.address);
        await resultProfessor.wait(1);
        console.log(
            `Changed ProfessorContract address in Academic with success!`
        );
        
        const resultProfessorAluno = await professorContract.setAlunoContractAddress(alunoContract.address);
        console.log(
            `Changed ProfessorContract address in Aluno with success!`
        );
        await resultProfessorAluno.wait(1);

        const resultProfessorDisciplina = await professorContract.setDisciplinaContractAddress(disciplinaContract.address);
        console.log(
            `Changed disciplina  address in proffessor with success!`
        );
        await resultProfessorDisciplina.wait(1)
        
        const resultAlunoDisciplina = await alunoContract.setDisciplinaContractAddress(disciplinaContract.address);
        console.log(
            `Changed Disciplina address in aluno with success!`
        );
        await resultAlunoDisciplina.wait(1);
        
        const resultDisciplinaProfessor = await disciplinaContract.setProfessorContractAddress(professorContract.address);
        console.log(
            `Changed professor address in disciplina with success!`
        );
        await resultDisciplinaProfessor.wait(1);
      
        const resultDisciplinaAluno = await disciplinaContract.setAlunoContractAddress(alunoContract.address);
        console.log(
            `Changed aluno address in disciplina with success!`
        );
        await resultDisciplinaAluno.wait(1);

        console.log(
            `Deploy finished with success!`
        );
       
        return {academic, alunoContract, professorContract, disciplinaContract, academicToken, academicCertificate};
    }



    describe("Academic Contract", function () {
        
        it("Should not a non-admin register a student", async function () {
            const { academic, alunoContract, disciplinaContract, professorContract } = await loadFixture(deployContracts);

            const signers = await hre.ethers.getSigners();
            const professorAddr = signers[19].address;
            professorSigner = await ethers.getSigner(professorAddr);

            
            await expect(academic.connect(professorSigner).setAlunoContractAddress(alunoContract.address)).to.be.revertedWith('Nao autorizado.'); //aqui entra a mesma mensagem caso o contrato não seja autorizado

            
            await expect(academic.connect(professorSigner).setDisciplinaContractAddress(disciplinaContract.address)).to.be.revertedWith('Nao autorizado.');
            
            await expect(academic.connect(professorSigner).setProfessorContractAddress (professorContract.address)).to.be.revertedWith('Nao autorizado.');
            
            await expect(academic.connect(professorSigner).abrirLancamentoNota()).to.be.revertedWith('Nao autorizado.');
            
            await expect(academic.connect(professorSigner).fecharPeriodo()).to.be.revertedWith('Nao autorizado.');
            
            await expect(academic.connect(professorSigner).abrirInscricoes()).to.be.revertedWith('Nao autorizado.');
        });

        
    });


});