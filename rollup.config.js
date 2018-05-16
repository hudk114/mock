import babel from 'rollup-plugin-babel';
import uglify from 'rollup-plugin-uglify';

const options = {
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

if (process.env.NODE_ENV === 'production') {
  options.output.file = 'dist/proxyMock.min.js';
  options.plugins.push(uglify());
}

export default options;
