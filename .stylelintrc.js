module.exports = {
  extends: "stylelint-config-standard",
  plugins: [
    "stylelint-scss"
  ],
  ignoreFiles: [
    "dist/**/*.css"
  ],
  customSyntax: "postcss-scss",
  rules: {
    "block-no-empty": null,
    "at-rule-no-unknown": null,
    "scss/at-rule-no-unknown": true,
    'selector-pseudo-class-no-unknown': null,
    'selector-class-pattern': null,
    'no-descending-specificity': null,
    "scss/dollar-variable-pattern": null,
    "scss/selector-no-redundant-nesting-selector": true,
  }
}