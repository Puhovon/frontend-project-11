lint:
	npx eslint .

lint-fix:
	npx eslint . --fix

start: 
	npx webpack serve