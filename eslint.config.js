import uglify from "@gesslar/uglier"

export default [
  {
    ignores: ["action/**"]
  },
  ...uglify({
    with: [
      "lints-js", // default files: ["**/*.{js,mjs,cjs}"]
      "lints-jsdoc", // default files: ["**/*.{js,mjs,cjs}"]
      "node", // default files: ["**/*.{js,mjs,cjs}"]
    ]
  })
]
