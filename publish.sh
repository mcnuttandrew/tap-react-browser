git branch -D export-branch
git branch export-branch
git checkout export-branch
yarn build
rm -rf example-app/
rm -rf src/