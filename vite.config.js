import { defineConfig } from 'vite';
import handlebars from 'vite-plugin-handlebars';
import path from 'path';

export default defineConfig({
    //index.htmlがプロジェクトルート

    //vercelでデプロイするためルート基準
    base: '/',

    plugins: [
        handlebars({
            partialDirectory: path.resolve(__dirname, 'src/partials')
        })
    ],

    build: {
        outDir: 'dist',    
        emptyOutDir: true,
        assetsDir: 'assets',    // アセットの格納ディレクトリ
        minify: false,          // minifyを無効化
        sourcemap: false        // ソースマップなし
    },

    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src')
        }
    },

    server: {
        open: true,
        host:true,
        port: 5173,
            watch: {
            usePolling: true,
        },
    }
});
