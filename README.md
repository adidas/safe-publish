![[](https://travis-ci.com/adidas/safe-publish)](https://api.travis-ci.com/adidas/safe-publish.svg?branch=master)

# Safe publish script

This scripts wraps `npm publish` to execute it in a safe way, without failing if the package already exists.

## Use cases

Avoid publication failing when a NPM package and version already exists.

It is useful to work along with [Lerna][lerna] to be able to manage the versions of each package independently.

## Requirements and dependencies

[NodeJS/NPM](https://nodejs.org/) are required to work with the repository.

## Installation and running

```
npm install safe-publish
```

```javascript
const cwd = process.cwd();
const { name, version } = require(join(cwd, 'package.json'));

publish({
  cwd,
  name,
  version
})
.catch((error) => {});
```

### Options

These values are required to be able to publish the package:

- `cwd` (string): working directory of the package to be published.
- `name` (string): name of the package to be published.
- `version` (string): version of the package to be published.

These values are optional and allow to configure the publication:

- `registry` (string): override the registry.
  - If the registry is not defined, NPM will use the default one.
  - The registry can be set in the `package.json`:
  ```
  "publishConfig": {
    "registry": "http://registry.url"
  }
  ```
- `force` (boolean): force the publication despite the fact that the package could exist.
  - It implies that the process could fail.
- `dry-run` (boolean): for testing purposes, it does not try to publish the package.
- `silent` (boolean): disable the log output.

### Command Line Interface

The script can be run via CLI:

```
safe-publish
safe-publish --registry=http://registry.url --silent
```

Options and aliases:

```
  --version       Show version number                                  [boolean]
  --help          Show help                                            [boolean]
  -r, --registry  Override default registry                             [string]
  -f, --force     Force publication                   [boolean] [default: false]
  -d, --dry-run   Test publication process            [boolean] [default: false]
  -s, --silent    Disable log output                  [boolean] [default: false]
```

## Example along with Lerna

Having a mono repository in which its package versions have to be managed in an independently way. We can use [Lerna][lerna] to run the `safe-publish` script:

- Root `package.json` with the running script:
  ```json
  {
    "name": "mono-repository",
    "version": "0.0.0",
    "scripts": {
      "lerna:publish": "lerna exec -- safe-publish"
    },
    "devDependencies": {
      "lerna": "^2",
      "safe-publish": "^1"
    }
  }
  ```
- Package `package.json`:
  ```json
  {
    "name": "package",
    "version": "1.0.0",
    "files": [
      "dist",
      "README.md",
      "CHANGELOG.md"
    ]
  }
  ```
- Running NPM script:
  ```
  npm run lerna:publish -- --silent
  ```

## FAQ

### Maintainers

Check the contributor list and you will be welcome if you want to contribute.

### Contributing

Check out the [CONTRIBUTING.md](./.github/CONTRIBUTING.md) file to know how to contribute to this project.

## License and Software Information

© adidas AG

adidas AG publishes this software and accompanied documentation (if any) subject to the terms of the MIT license with the aim of making the NPM package publications of a mono repository easier. You will find a copy of the MIT license in the root folder of this package. All rights not explicitly granted to you under the MIT license remain the sole and exclusive property of adidas AG.

NOTICE: The software has been designed solely for the purpose of analyzing the code quality by checking the coding guidelines. The software is NOT designed, tested or verified for productive use whatsoever, nor or for any use related to high risk environments, such as health care, highly or fully autonomous driving, power plants, or other critical infrastructures or services.

If you want to contact adidas regarding the software, you can mail us at _software.engineering@adidas.com_.

For further information open the [adidas terms and conditions](https://github.com/adidas/adidas-contribution-guidelines/wiki/Terms-and-conditions) page.

### License

[MIT](LICENSE)

[lerna]: https://lernajs.io/
