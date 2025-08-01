const { createReporter } = require('istanbul-api');
const libCoverage = require('istanbul-lib-coverage');
const fs = require('fs');

const coverageFiles = [
  './coverage/coverage-final.json',
  './coverage-e2e/coverage-final.json'
];

const map = libCoverage.createCoverageMap({});

coverageFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ Trouvé: ${file}`);
    const coverage = JSON.parse(fs.readFileSync(file, 'utf8'));
    map.merge(coverage);
  } else {
    console.log(`❌ Manquant: ${file}`);
  }
});

const reporter = createReporter();
reporter.addAll(['lcov', 'text', 'html']);
reporter.write(map);

console.log('✅ Couverture fusionnée avec succès!');