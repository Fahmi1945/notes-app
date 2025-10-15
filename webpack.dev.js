const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'development',
  devServer: {
    static: './dist', // Folder yang akan disajikan
    watchFiles: ['src/**/*'], // Memantau perubahan di folder src
    liveReload: true, // Muat ulang otomatis saat ada perubahan
    open: true, // Buka browser secara otomatis
    compress: true,
    port: 9000,
  },
});