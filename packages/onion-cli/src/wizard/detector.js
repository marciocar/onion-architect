/**
 * Detector de IDEs e ferramentas instaladas
 */
const fs = require('fs-extra');
const path = require('path');
const { SUPPORTED_IDES } = require('../constants');

class Detector {
  constructor(projectRoot = process.cwd()) {
    this.projectRoot = projectRoot;
  }
  
  // Detectar IDEs instalados
  detectIDEs() {
    const detected = [];
    
    for (const ide of SUPPORTED_IDES) {
      const detectorPath = path.join(this.projectRoot, ide.detector);
      
      if (fs.existsSync(detectorPath)) {
        detected.push({
          ...ide,
          path: detectorPath
        });
      }
    }
    
    return detected;
  }
  
  // Verificar se já existe estrutura Onion
  hasOnionStructure() {
    return fs.existsSync(path.join(this.projectRoot, '.onion'));
  }
  
  // Verificar se existe estrutura legacy (.cursor/)
  hasLegacyStructure() {
    const legacyPaths = [
      '.cursor/commands',
      '.cursor/agents',
      '.cursor/rules'
    ];
    
    return legacyPaths.some(p => 
      fs.existsSync(path.join(this.projectRoot, p))
    );
  }
  
  // Detectar package.json
  getProjectInfo() {
    const pkgPath = path.join(this.projectRoot, 'package.json');
    
    if (fs.existsSync(pkgPath)) {
      return fs.readJsonSync(pkgPath);
    }
    
    return null;
  }
  
  // Verificar Git
  isGitRepository() {
    return fs.existsSync(path.join(this.projectRoot, '.git'));
  }
}

module.exports = Detector;

