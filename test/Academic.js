const { expect } = require("chai");
const {
    loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");

describe("Academic", function () {

    async function deployContracts() {
        const AcademicUtils = await hre.ethers.getContractFactory("AcademicUtils");
        const academicUtils = await AcademicUtils.deploy();
        await academicUtils.deployed();
        console.log(
            `AcademicUtils contract deployed to ${academicUtils.address}`
        );

        /*const Academic = await hre.ethers.getContractFactory("Academic", {
            libraries: {
            AcademicUtils: academicUtils.address,
            },
        });*/
        const Academic = await hre.ethers.getContractFactory("Academic");
        const academic = await Academic.deploy();
        await academic.deployed();

        console.log(
            `Academic contract deployed to ${academic.address}`
        );
       
        const DisciplinaContract = await hre.ethers.getContractFactory("DisciplinaContract");
        const disciplinaContract =  await DisciplinaContract.deploy();
        await disciplinaContract.deployed();
        console.log(
            `DisciplinaContract contract deployed to ${disciplinaContract.address}`
        );

        const ProfessorContract = await hre.ethers.getContractFactory("ProfessorContract");
        const professorContract = await ProfessorContract.deploy();
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

        const result = await academic.setAlunoContractAddress(alunoContract.address);
        await result.wait(1);
        console.log(
            `Deploy finished with success!`
        );

        return {academic, alunoContract, disciplinaContract, professorContract};
    }



    describe("Academic Contract", function () {

        it("Inserir Aluno should revert for a discipline without a professor", async function () {
            const { professorContract } = await loadFixture(deployContracts);

            await expect(professorContract.inserirNota(0, 0, 0)).to.be.revertedWith(
                "Disciplina sem professor"
            );
        });

        it("Should a professor be able to insert a grade", async function () {
            const { academic, alunoContract, professorContract, disciplinaContract } = await loadFixture(deployContracts);
            const [owner, professor, otherAccount] = await hre.ethers.getSigners();

            await disciplinaContract.inserirDisciplina(1, "Blockchain", professorContract.address);
            
            await alunoContract.inserirAluno(1, "Diogo");
            
            await academic.abrirLancamentoNota();
            
            await professorContract.inserirNota(1, 1, 8);
            
            const [alunos, notas] = await disciplinaContract.listarNotasDisciplina(1);
            expect(alunos[0].nome).to.equal("Diogo");
            expect(notas[0]).to.equal(8);

        });


        

    });


    /*describe("Aluno Contract", function () {

        it("Should register a valid student", async function () {
            const { alunoContract } = await loadFixture(deployContracts);

            await alunoContract.inserirAluno(1, "Diogo");
            const aluno = await alunoContract.getAlunoById(1);
            expect(aluno.nome).to.equal("Diogo");
            expect(aluno.id).to.equal(1)
        });

    });*/

});