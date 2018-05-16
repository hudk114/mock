import babel from 'rollup-plugin-babel';

export default {
  input: 'src/index.js',
  output: {
    file: 'dist/proxyMock.js',
    format: 'umd',
    name: 'proxyMock'
  },
  plugins: [
    babel({
      exclude: 'node_modules/**'
    })
  ]
};