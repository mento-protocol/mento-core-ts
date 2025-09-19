const { runTypeChain, glob } = require("typechain");
const fs = require("fs");
const path = require("path");
const cwd = process.cwd();
const execSync = require("child_process").execSync

function readPath(path) {
  const fullPath = `${cwd}/${path}`
  return fs.readdirSync(fullPath).map(c => `${fullPath}/${c}`).filter(c => {
    const stat = fs.statSync(c)
    return stat.isFile() && (c.endsWith(".sol") || c.endsWith(".json"))
  })
}

async function main() {
  const interfaces = readPath("lib/mento-core/contracts/interfaces")

  const governanceContracts = readPath("lib/mento-core/contracts/governance");
  const lockingContracts = readPath("lib/mento-core/contracts/governance/locking");
  const oracleContracts = readPath(`lib/mento-core/contracts/oracles`);
  const breakerContracts = readPath(`lib/mento-core/contracts/oracles/breakers`);
  const swapContracts = readPath(`lib/mento-core/contracts/swap`);

  const allContracts = interfaces
    .concat(governanceContracts)
    .concat(lockingContracts)
    .concat(oracleContracts)
    .concat(breakerContracts)
    .concat(swapContracts);

  allContracts.forEach((contract) => {
    const name = path.basename(contract)
    const abiFilename = name.replace(".sol", ".json")
    execSync(`forge inspect ${contract}:${name.replace(".sol", "")} abi --json > abis/${abiFilename}`)
  })

  const abis = readPath("abis")

  await runTypeChain({
    cwd,
    filesToProcess: abis,
    allFiles: abis,
    outDir: "src",
    target: "ethers-v5",
  });
}

main().catch(console.error);
