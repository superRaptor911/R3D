import { build } from 'esbuild';
import esbuildMxnCopy from 'esbuild-plugin-mxn-copy';

(async () => {
  const res = await build({
    entryPoints: ['./src/main.ts'],
    bundle: true,
    outfile: './build/src/main.js',
    minify: true,
    plugins: [
      esbuildMxnCopy({
        copy: [
          // You can include files & directories
          { from: 'src/assets', to: 'build/assets' },
          { from: 'src/style.css', to: 'build/' },
        ],
        verbose: true,
      }),
    ],
  });
})();
