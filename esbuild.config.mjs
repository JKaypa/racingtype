import * as esbuild from 'esbuild';

let result = await esbuild.build({
    entryPoints: ['./public/typescript/game.ts', './public/typescript/signin.ts'],
    bundle: true,
    outdir: './public/javascript'
});

console.info(result);
