/**
 * Wizard Detector - Detecta características do projeto para o wizard
 */
import fs from 'fs-extra';
import path from 'node:path';

export interface ProjectDetection {
  hasPackageJson: boolean;
  hasGit: boolean;
  hasCursor: boolean;
  hasWindsurf: boolean;
  hasOnion: boolean;
  packageManager: 'npm' | 'yarn' | 'pnpm' | 'bun' | null;
  isMonorepo: boolean;
}

/**
 * Detecta características do projeto atual
 */
export async function detectProjectCharacteristics(
  projectRoot: string
): Promise<ProjectDetection> {
  const detection: ProjectDetection = {
    hasPackageJson: false,
    hasGit: false,
    hasCursor: false,
    hasWindsurf: false,
    hasOnion: false,
    packageManager: null,
    isMonorepo: false,
  };

  // Check package.json
  detection.hasPackageJson = await fs.pathExists(path.join(projectRoot, 'package.json'));

  // Check git
  detection.hasGit = await fs.pathExists(path.join(projectRoot, '.git'));

  // Check IDEs
  detection.hasCursor = await fs.pathExists(path.join(projectRoot, '.cursor'));
  detection.hasWindsurf = await fs.pathExists(path.join(projectRoot, '.windsurf'));

  // Check Onion
  detection.hasOnion = await fs.pathExists(path.join(projectRoot, '.onion'));

  // Detect package manager
  if (await fs.pathExists(path.join(projectRoot, 'pnpm-lock.yaml'))) {
    detection.packageManager = 'pnpm';
  } else if (await fs.pathExists(path.join(projectRoot, 'yarn.lock'))) {
    detection.packageManager = 'yarn';
  } else if (await fs.pathExists(path.join(projectRoot, 'bun.lockb'))) {
    detection.packageManager = 'bun';
  } else if (await fs.pathExists(path.join(projectRoot, 'package-lock.json'))) {
    detection.packageManager = 'npm';
  }

  // Detect monorepo
  if (
    (await fs.pathExists(path.join(projectRoot, 'pnpm-workspace.yaml'))) ||
    (await fs.pathExists(path.join(projectRoot, 'lerna.json'))) ||
    (await fs.pathExists(path.join(projectRoot, 'nx.json')))
  ) {
    detection.isMonorepo = true;
  }

  // Check package.json workspaces
  if (detection.hasPackageJson && !detection.isMonorepo) {
    try {
      const pkg = await fs.readJson(path.join(projectRoot, 'package.json'));
      if (pkg.workspaces) {
        detection.isMonorepo = true;
      }
    } catch {
      // Ignore read errors
    }
  }

  return detection;
}

export default detectProjectCharacteristics;
