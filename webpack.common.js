const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  // 1. Entry: Titik awal dari aplikasi kita
  entry: './src/index.js',

  // 2. Output: Di mana hasil build akan disimpan
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    clean: true, // Membersihkan folder dist sebelum build
  },

  // 3. Module: Aturan untuk memproses berbagai jenis file
  module: {
    rules: [
      {
        // Aturan untuk memproses file .css
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },

  // 4. Plugins: Menambahkan fungsionalitas tambahan ke webpack
  plugins: [
    new HtmlWebpackPlugin({
      // Menggunakan file HTML kita sebagai template
      template: './src/index.html',
      // Nama file HTML yang akan dihasilkan di folder dist
      filename: 'index.html',
    }),
  ],
};