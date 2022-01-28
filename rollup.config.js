import resolve from '@rollup/plugin-node-resolve'; 
import typescript from '@rollup/plugin-typescript'; 
import commonjs from '@rollup/plugin-commonjs'; 
 
export default [ 
  { 
    input: './src/index.ts', 
    output: [
    { 
      dir: 'lib', 
      format: 'cjs', 
      entryFileNames: '[name].cjs.js', 
    }, 
	  { 
      dir: 'lib', 
      format: 'esm', 
      entryFileNames: '[name].esm.js', 
    }
    ], 
    plugins: [resolve(), commonjs(), typescript()], 
  } 
]; 

