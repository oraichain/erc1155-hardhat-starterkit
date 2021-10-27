const path = require('path');
const fs = require('fs');

function readDirectory(dir, files = []) {
  fs.readdirSync(dir).forEach((file) => {
    const absolute = path.join(dir, file);
    if (fs.statSync(absolute).isDirectory())
      return readDirectory(absolute, files);
    else files.push(absolute);
  });
  return files;
}

const files = readDirectory('./artifacts/contracts').filter(
  (f) => !f.endsWith('dbg.json')
);

for (f of files) {
  const contents = fs.readFileSync(f);
  const jsonContent = JSON.parse(contents);

  const size = jsonContent.deployedBytecode.length / 2 - 1;
  const maxSize = 0x6000;
  console.log(
    jsonContent.contractName,
    size,
    ((100 * size) / maxSize).toFixed(2) + '%'
  );
}
