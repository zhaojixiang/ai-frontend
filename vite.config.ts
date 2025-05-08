import { defineConfig, loadEnv } from 'vite';
import type { ConfigEnv, UserConfig } from 'vite';
import react from '@vitejs/plugin-react';
import legacy from '@vitejs/plugin-legacy';
import pxtovw from 'postcss-px-to-viewport';
import url from '@rollup/plugin-url';
import path from 'path';

// import { createStyleImportPlugin } from 'vite-plugin-style-import';

// // https://vite.dev/config/

export default defineConfig(({ command, mode }: ConfigEnv): UserConfig => {
  const env = loadEnv(mode, process.cwd(), '');

  let config: UserConfig = {
    clearScreen: false,
    optimizeDeps: {
      esbuildOptions: {
        loader: {
          '.svga': 'dataurl'
        }
      }
    },
    assetsInclude: ['**/*.svga'],
    plugins: [
      // {
      // 	...viteESLint(),
      // 	apply: 'serve'
      // },
      react({
        // 按需加载
        babel: {
          plugins: [
            [
              'import',
              {
                libraryName: 'antd-mobile',
                libraryDirectory: 'es/components',
                style: false
              },
              'antd-mobile'
            ]
          ]
        }
      }),
      // createStyleImportPlugin({
      // 	libs: [
      // 		{
      // 			libraryName: 'antd-mobile',
      // 			esModule: true,
      // 			resolveStyle: (name) => `antd-mobile/es/components/${name}/${name}.css`
      // 		}
      // 	]
      // }),
      legacy({
        targets: [
          'Android >= 39',
          'Chrome >= 50',
          'Safari >= 10.1',
          'iOS >= 10.3',
          '> 1%',
          'ie >= 11'
        ],
        additionalLegacyPolyfills: ['regenerator-runtime/runtime']
      })
      // vitePluginImport([
      // 	{
      // 		libraryName: 'antd-mobile-v2',
      // 		style: true
      // 	}
      // ]),
      // istanbul({ exclude: [] }),
      // htmlPlugin()
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src') // 将 @ 映射到 src 目录
      }
    },
    css: {
      postcss: {
        plugins: [
          pxtovw({
            unitToConvert: 'px', // 要转换的单位
            viewportWidth: 375, // 设计稿的视口宽度，一般是375(iPhone6)或750
            unitPrecision: 5, // 转换后的精度，即小数点位数
            propList: ['*'], // 能转化为vw的属性列表
            viewportUnit: 'vw', // 希望使用的视口单位
            fontViewportUnit: 'vw', // 字体使用的视口单位
            selectorBlackList: [], // 需要忽略的CSS选择器
            minPixelValue: 1, // 最小的转换数值
            mediaQuery: false, // 是否转换媒体查询中的px
            replace: true, // 是否直接替换属性值
            exclude: [/node_modules/], // 忽略某些文件夹下的文件
            // include: undefined, // 如果设置了include，那将只有匹配到的文件才会被转换
            landscape: false, // 是否添加根据landscapeWidth生成的媒体查询条件
            landscapeUnit: 'vw', // 横屏时使用的单位
            landscapeWidth: 1334 // 横屏时使用的视口宽度
          })
        ]
      },
      preprocessorOptions: {
        less: {
          javascriptEnabled: true
        }
      }
    },

    build: {
      sourcemap:
        env.VITE_ENV_NAME === 'fat' || env.VITE_ENV_NAME === 'dev' || env.VITE_ENV_NAME === 'uat',
      target: 'es2015',
      minify: 'terser',
      chunkSizeWarningLimit: 500,
      assetsInlineLimit: 0,
      rollupOptions: {
        context: 'window',
        plugins: [
          url({
            include: ['**/*.svga']
          })
        ],
        output: {
          manualChunks: {
            react: ['react', 'react-dom'],
            sentry: ['@woulsl/sentry-config']
          }
        }
      }
    }
  };

  // 注入外部变量
  const whiteKeys = [
    'APP_NAME',
    'SENSORS_SEVER_URL',
    'ACT_URL',
    'CDN_DOMAIN',
    'ENV_NAME',
    'CDN_PREFIX',
    'ENV_BASE',
    'MOCK',
    'IS_OFFLINE_PACKAGE',
    'BASE_URL',
    'EDU_BASE_URL',
    'COMMON_BASE_URL',
    'MALL_BASE_URL',
    'OSS_STATIC_RESOURCE',
    'SZ_BASE_URL',
    'WX_APPID',
    'UC_BASE_URL',
    'AUTH_SIGN_URL',
    'SENTRY_BASE_URL',
    'DESIGN_BASE_URL',
    'SENSORS_BASE_URL',
    'MINIAPP_ORIGINAL_ID'
  ];
  Object.keys(process.env).forEach((item) => {
    if (whiteKeys.includes(item)) {
      process.env[`VITE_${item}`] = process.env[item];
    }
  });

  // 本地开发生效
  if (command === 'serve') {
    config = {
      ...config,
      esbuild: {
        target: 'esnext'
      },
      server: {
        fs: {
          strict: true
        },
        open: true,
        host: '0.0.0.0',
        // proxy: proxy(ENV_NAME),
        port: 8003
      }
    };
  }

  // 构建之后生效
  if (command === 'build') {
    const CDN_DOMAIN = process.env.VITE_CDN_DOMAIN;
    const CDN_PREFIX = process.env.VITE_CDN_PREFIX;

    config = {
      ...config,
      base: CDN_DOMAIN && CDN_PREFIX ? `${CDN_DOMAIN}${CDN_PREFIX}` : '/',
      define: {
        'process.env.NODE_ENV': '"production"'
      }
    };
  }

  return config;
});
