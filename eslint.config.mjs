import globals from "globals";
import pluginJs from "@eslint/js";
import pluginVue from "eslint-plugin-vue";
import pluginPrettier from "eslint-plugin-prettier";
import configPrettier from "eslint-config-prettier";

export default [
  { files: ["**/*.{js,mjs,cjs,vue}"] },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  pluginVue.configs.recommended,
  pluginPrettier.configs.recommended,
  configPrettier,
  {
    rules: {
      'no-unused-vars': 'off',
      'vue/no-unused-vars': 'off',
    },
  },
];
