export default {
  semi: true,
  singleQuote: true,
  arrowParens: 'always',
  trailingComma: 'all',
  tabWidth: 2,
  printWidth: 120,
  useTabs: false,
  bracketSpacing: true,
  tailwindAttributes: ['class', 'className', '.*className', '.*ClassName', '.*Styles.*', '.*Style.*', '.*Classes.*'],
  tailwindFunctions: ['clsx', 'classNames'],
  plugins: ['prettier-plugin-tailwindcss'],
}