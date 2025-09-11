const { runTypeChain, glob } = require("typechain");
const fs = require("fs");

async function main() {
  const cwd = process.cwd();
  const interfaces = fs.readdirSync(`${cwd}/lib/mento-core/contracts/interfaces`);

  const governanceContracts = fs.readdirSync(`${cwd}/lib/mento-core/contracts/governance`);
  const lockingContracts = fs.readdirSync(`${cwd}/lib/mento-core/contracts/governance/locking`);
  const oracleContracts = fs.readdirSync(`${cwd}/lib/mento-core/contracts/oracles`);
  const breakerContracts = fs.readdirSync(`${cwd}/lib/mento-core/contracts/oracles/breakers`);
  const swapContracts = fs.readdirSync(`${cwd}/lib/mento-core/contracts/swap`);

  const allContracts = interfaces
    .concat(governanceContracts)
    .concat(lockingContracts)
    .concat(oracleContracts)
    .concat(breakerContracts)
    .concat(swapContracts);
  const allContractsPath = allContracts.map(contract => `${contract}/${contract.replace(".sol", ".json")}`);

  /// XXX: there's an IBreakerBox in the @celo/contracts package as well so we need a manual shady intervention.
  fs.cpSync(`${cwd}/out/IBreakerBox.sol/IBreakerBox.0.5.17.json`, `${cwd}/out/IBreakerBox.sol/IBreakerBox.json`);

  const allFiles = glob(`${cwd}/out`, allContractsPath)
  await runTypeChain({
    cwd,
    filesToProcess: allFiles,
    allFiles,
    outDir: "src",
    target: "ethers-v5",
  });
}

main().catch(console.error);
