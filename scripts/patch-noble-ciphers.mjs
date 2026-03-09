/**
 * Patches @noble/ciphers v2 exports to include extensionless subpaths.
 * This fixes compatibility with @ecies/ciphers which imports "@noble/ciphers/utils"
 * (without .js), but @noble/ciphers v2 only exports "./utils.js".
 */
import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const pkgPath = resolve(__dirname, '../node_modules/@noble/ciphers/package.json');

try {
  const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));

  if (!pkg.exports || pkg.exports['./utils']) {
    process.exit(0); // already patched or no exports to patch
  }

  // Add extensionless aliases for all .js exports
  for (const [key, value] of Object.entries(pkg.exports)) {
    if (key.endsWith('.js')) {
      const withoutExt = key.replace(/\.js$/, '');
      if (!pkg.exports[withoutExt]) {
        pkg.exports[withoutExt] = value;
      }
    }
  }

  writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');
  console.log('Patched @noble/ciphers exports for v1 compat.');
} catch {
  // Silently skip if package not found
}
