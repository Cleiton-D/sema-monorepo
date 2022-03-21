# mkdir .temp;
# cp -r * .temp/;
cd temp;

# rm -rf node_modules;
# yarn install --force --frozen-lockfile;
# yarn build;

mkdir output
cp -r next.options.js ./output/;
cp -r next.config.js ./output/;
cp -r public ./output/;
cp -r package.json ./output/;
cp -r .next/standalone/. ./output/;

# mkdir ./output/.next
cp -r .next/static ./output/.next/static;

# pkg . --targets node14-macos-x64

# cd output && \
# pkg . --targets node14-linux-x64 --output /app/release/output

AR=('./.next/**/*' './node_modules/**/*')
cd output && \
nexe server.js -r "./.next/**/*" -r "./node_modules/**/*" --output "/app/release/output-nexe";
