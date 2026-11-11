import {spawnSync} from 'node:child_process';
import {writeFileSync} from 'node:fs';
const result=spawnSync(process.execPath,['node_modules/vite/bin/vite.js','build','--outDir','docs','--base','/Portfolio/'],{stdio:'inherit'});
if(result.status!==0)process.exit(result.status||1);
writeFileSync('docs/.nojekyll','');

