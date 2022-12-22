// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

import "./AcademicTypes.sol";

interface IDisciplinaContract{

    function getDisciplinaByID(uint id) external view returns (Disciplina memory);

}
