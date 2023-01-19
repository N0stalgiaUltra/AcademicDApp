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
       
        return {academic, alunoContract, professorContract, disciplinaContract, academicToken, academicCertificate, resultDisciplinaProfessor};
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
        
       

        //caso de teste aluno tentar se inscrever em uma matéria que não existe
        //
        //caso de teste professor inserir nota para um aluno que não existe
    });

    describe("Aluno Contract", function() {

        it("Should not insert a student without ID", async function (){
            const { alunoContract} = await loadFixture(deployContracts);
            
            const signers = await hre.ethers.getSigners();
            const studentAddr = signers[1].address;

            await expect(alunoContract.inserirAluno(0, "Teste Aluno", studentAddr)).to.be.revertedWith("Aluno inexistente");

        });
        
        it("Should not insert student if not in enrollment period", async function(){
            const {academic, alunoContract} = await loadFixture(deployContracts);

            const signers = await hre.ethers.getSigners();
            const studentAddr = await signers[1].address;
            
            await academic.fecharPeriodo();

            await expect(alunoContract.inserirAluno(0, "Teste", studentAddr)).to.be.revertedWith("Fora do periodo de inscricao de aluno");

        });

        it("Should not insert a student to a invalid discipline", async function(){
            const { alunoContract} = await loadFixture(deployContracts);

            const signers = await hre.ethers.getSigners();
            const studentAddr = await signers[1].address;
            await alunoContract.inserirAluno(1, "TesteStudent", studentAddr);
            
            await expect(alunoContract.inscreverDisciplina(1,1)).to.be.revertedWith("Disciplina inexistente.");
        });
    });

    describe("Professor Contract", function(){
        //colocar 2 testes
        it("Should not insert professor if not in enrollment period", async function(){
            const {academic, professorContract} = await loadFixture(deployContracts);

            const signers = await hre.ethers.getSigners();
            const professorAddr = await signers[1].address;
            
            await academic.fecharPeriodo();

            await expect(professorContract.inserirProfessor(0, "TesteProfessor", professorAddr)).to.be.revertedWith("Fora do periodo de inscricao de professores!");

        });
        
        it("Should not insert a grade when period isn't lancamento_notas", async function () {

            const { professorContract, disciplinaContract, alunoContract } = await loadFixture(deployContracts);

            const signers = await hre.ethers.getSigners()
            const professorAddr = signers[19].address
            const alunoAddr = signers[18].address
            await professorContract.inserirProfessor(1, "Diogo", professorAddr);
            await disciplinaContract.inserirDisciplina(1, "Blockchain", professorContract.address);
            await alunoContract.inserirAluno(1, "Vinicius", alunoAddr);

            professorSigner = await ethers.getSigner(professorAddr);

            await expect(professorContract.connect(professorSigner).inserirNota(1,1,8)).to.be.revertedWith('Fora do periodo de lancamento de notas!')
        });

        it("Should not insert grade to a student who´s not in a discipline", async function(){
            const {academic, alunoContract, disciplinaContract, professorContract} = await loadFixture(deployContracts);

            const signers = await hre.ethers.getSigners();
            const professorAddr = await signers[19].address;
            const studentAddr = await signers[2].address;
            
            profSigner = await ethers.getSigner(professorAddr);

            academic.abrirInscricoes();

            await professorContract.inserirProfessor(1, "Professor", professorContract.address);

            await disciplinaContract.inserirDisciplina(1, "TesteDisc", professorContract.address);

            await alunoContract.inserirAluno(1, "", studentAddr);
            academic.abrirLancamentoNota();
            
            await expect(professorContract.connect(profSigner).inserirNota(1,0,10)).to.be.revertedWith("Aluno nao existente!");
        });
        
        
    });

    describe("Discipline Contract", function(){
        //colocar 2 testes
    });
});