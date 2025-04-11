import antfu from "@antfu/eslint-config";
import globals from "globals";
// import AutoImportGlobals from './src/types/.eslintrc-auto-import.json' with { type: 'json' }

export default antfu(
  {
    stylistic: false,
    typescript: false,
    vue: true,
  },
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.browser,
        ...globals.worker,
        ...globals.webextensions,
        // ...AutoImportGlobals.globals,
      },
    },
  },
  {
    ignores: [
      "node_modules",
      "dist",
      "**/*.d.ts",
      "public",
      "build",
      "coverage",
      "tests",
      "cypress",
      "src/types/**/*",
      "eslint.config.mjs",
    ],
  },
  {
    rules: {
      "no-alert": "warn",
      "no-console": "warn",
      "no-restricted-globals": "warn",
      "import/order": "warn",
      "@typescript-eslint/explicit-function-return-type": "off",
      "vue/multi-word-component-names": "off",
      "@eslint-community/eslint-comments/no-unlimited-disable": "off",
      "no-unused-vars": "warn",
      semi: [2, "never"], // 不使用分号结尾
      quotes: [2, "single"], // 强制使用单引号
      "no-console": "warn", // 允许使用console，但会发出警告
      indent: [2, 2], // 使用两个空格进行缩进
      "max-len": [
        1,
        {
          // 最大行字符数为 80
          code: 140,
          ignoreUrls: true,
        },
      ],
      "vue/block-order": [
        "error",
        {
          order: [["template"], "script", "style"],
        },
      ],
    },
  }
);
