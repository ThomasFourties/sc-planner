export default {
  extends: [
    "stylelint-config-standard-scss",
    "stylelint-config-property-sort-order-smacss"
  ],
  plugins: [
    "stylelint-declaration-strict-value"
  ],
  defaultSeverity: "warning",
  "rules": {
    "scss/dollar-variable-pattern": "^[a-z][a-zA-Z0-9]+$"
  }
}
