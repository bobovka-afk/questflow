import fs from 'fs';
import path from 'path';

const stylesDir = path.join('src', 'app', 'styles');
const files = [
  'pixel-shell.css',
  'gamification.css',
  'shell.css',
  'card-detail-trello.css',
  'party.css',
  'workspace.css',
  'settings.css',
  'auth.css',
];

function patch(css) {
  let next = css;
  next = next.replace(/border-radius:\s*0\s*;/g, 'border-radius: var(--qf-radius-sm);\n');
  next = next.replace(/box-shadow:\s*inset[^;]+;/g, 'box-shadow: var(--qf-shadow-control);\n');
  next = next.replace(
    /border:\s*4px solid var\(--px-border\)\s*;/g,
    'border: 1px solid var(--qf-control-border);\n',
  );
  next = next.replace(
    /border:\s*3px solid var\(--px-border\)\s*;/g,
    'border: 1px solid var(--qf-control-border);\n',
  );
  next = next.replace(
    /border-bottom:\s*4px solid var\(--px-border\)\s*;/g,
    'border-bottom: 1px solid var(--qf-control-border);\n',
  );
  next = next.replace(
    /border-bottom:\s*3px solid var\(--px-border\)\s*;/g,
    'border-bottom: 1px solid var(--qf-control-border);\n',
  );
  return next;
}

for (const name of files) {
  const file = path.join(stylesDir, name);
  if (!fs.existsSync(file)) continue;
  const css = fs.readFileSync(file, 'utf8');
  const next = patch(css);
  if (next !== css) {
    fs.writeFileSync(file, next);
    console.log('Patched', name);
  }
}
