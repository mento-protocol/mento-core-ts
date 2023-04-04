const { runTypeChain, glob } = require("typechain");
const fs = require("fs");

async function main() {
  const cwd = process.cwd()
  const interfaces = fs.readdirSync(
    `${cwd}/lib/mento-core/contracts/interfaces`
  );
  // We generate types for some of the core contracts because they are
  // useful in other packages, for example in the sdk.
  const coreContracts = ['Broker.sol', 'BiPoolManager.sol']
  const allContracts = interfaces.concat(coreContracts)
  const allContractsPath = allContracts.map(
    (contract) => `${contract}/${contract.replace('.sol', '.json')}`
  )

  const allFiles = glob(`${cwd}/out`, allContractsPath);
  await runTypeChain({
    cwd,
    filesToProcess: allFiles,
    allFiles,
    outDir: "src",
    target: "ethers-v5",
  });
}

main().catch(console.error);
