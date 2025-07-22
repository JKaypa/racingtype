import * as esbuild from 'esbuild';
import { argv } from 'node:process'

const isDev = argv.includes('--dev')
const outdir = isDev ? './public/javascript' : '.build/public/javascript'

const options = {
    entryPoints: ['./public/typescript/game.ts', './public/typescript/signin.ts'],
    bundle: true,
    minify: isDev,
    outdir
}

if(isDev){
    const ctx = await esbuild.context(options)
    await ctx.watch()
    console.info('esbuild is watching for changes...')
} else {
    await esbuild.build(options)
    console.info('esbuild build completed successfully');
}
