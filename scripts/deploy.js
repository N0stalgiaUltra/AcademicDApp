// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {

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
 
  // Registrando alunos 
  await alunoContract.inserirAluno(1, "Pedro", "0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65"); //account #4
  await alunoContract.inserirAluno(2, "Gabriel", "0x70997970C51812dc3A010C7d01b50e0d17dc79C8"); //account #1
  
  const aluno = await alunoContract.getAlunoById(1);
  const aluno2 = await alunoContract.getAlunoById(2);

  console.log(`Aluno Registrado: ${aluno}`);
  console.log(`Aluno Registrado: ${aluno2}`);

  // Registrando professor
  await professorContract.inserirProfessor(1, 'Diogo', '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'); //account #0
  const prof = await professorContract.getProfessorById(1);
  console.log(`Professor Registrado: ${prof}`);
  
  //contrato professor
  const newAddressSigner = await ethers.getSigner('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266')
  const contratoProfessor1 = professorContract.connect(newAddressSigner);
  

  // Registrando disciplina

  await disciplinaContract.inserirDisciplina(1, "Blockchain", contratoProfessor1.address);
  const disciplina = await disciplinaContract.getDisciplinaByID(1);
  console.log(`Disciplina Registrada: ${disciplina}`);

  // Abrir inscrição de alunos 
  await academic.abrirInscricoes();

  await alunoContract.inscreverDisciplina(1,1);
  await alunoContract.inscreverDisciplina(2,1);
  
  console.log(`Alunos na disciplina: ${await disciplinaContract.getAlunosByDisciplina(1)}`);

  //abrir lançamento de notas

  await academic.abrirLancamentoNota();

  await professorContract.inserirNota(1, 1, 10);
  await professorContract.inserirNota(2, 1, 5);

  const [alunos, notas] = await professorContract.listarNotasDisciplina(1)
  console.log(`notas na disciplina: ${notas}`);

  await academic.fecharPeriodo()
  console.log(`Fim do Periodo`);


}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
