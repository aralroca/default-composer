<div align="center">
<img src="./logo.svg" alt="Default composer logo" width="100" height="100" />
<h1>
<div><b>Default composer</b></div>
</h1>
</div>

_A **tiny** (300B) **JavaScript library** that allows you to set **default values** for **nested objects**_

[![npm version](https://badge.fury.io/js/default-composer.svg)](https://badge.fury.io/js/default-composer)
[![gzip size](https://img.badgesize.io/https://unpkg.com/default-composer?compression=gzip&label=gzip)](https://unpkg.com/default-composer)
[![CI Status](https://github.com/aralroca/default-composer/actions/workflows/test.yml/badge.svg)](https://github.com/aralroca/default-composer/actions/workflows/test.yml)
[![Maintenance Status](https://badgen.net/badge/maintenance/active/green)](https://github.com/aralroca/default-composer#maintenance-status)
[![Weekly downloads](https://badgen.net/npm/dw/default-composer?color=blue)](https://www.npmjs.com/package/default-composer)
[![PRs Welcome][badge-prwelcome]][prwelcome]<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->

<!-- ALL-CONTRIBUTORS-BADGE:END -->

[badge-prwelcome]: https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square

[prwelcome]: http://makeapullrequest.com

"default-composer" is a JavaScript library that allows you to set default values for **nested objects**. The library replaces empty strings/arrays/objects, null, or undefined values in an existing object with the defined default values, which helps simplify programming logic and reduce the amount of code needed to set default values.

**Content**:

- [1. Installation](#installation)
- [2. Usage](#usage)
- [3. API](#api)
  - [`defaultComposer`](#defaultcomposer)
  - [`setConfig`](#setconfig)
- [4. TypeScript](#typescript)
- [5. Contributing](#contributing)
- [6. License](#license)
- [7. Credits](#credits)

## Installation

You can install "default-composer" using npm:

```bh
npm install default-composer
```

or with yarn:

```bh
yarn add default-composer
```

## Usage

To use "default-composer", simply import the library and call the `defaultComposer()` function with the default values object and the original object that you want to set default values for. For example:

```js
import { defaultComposer } from "default-composer";

const defaults = {
  name: "Aral 😊",
  surname: "",
  isDeveloper: true,
  isDesigner: false,
  age: 33,
  address: {
    street: "123 Main St",
    city: "Anytown",
    state: "CA",
  },
  emails: ["contact@aralroca.com"],
  hobbies: ["programming"],
};

const originalObject = {
  name: "Aral",
  emails: [],
  phone: "555555555",
  age: null,
  address: {
    zip: "54321",
  },
  hobbies: ["parkour", "computer science", "books", "nature"],
};

const result = defaultComposer(defaults, originalObject);

console.log(result);
```

This will output:

```js
{
  name: 'Aral',
  surname: '',
  isDeveloper: true,
  isDesigner: false,
  emails: ['contact@aralroca.com'],
  phone: '555555555',
  age: 33,
  address: {
    street: '123 Main St',
    city: 'Anytown',
    state: 'CA',
    zip: '54321'
  },
  hobbies: ['parkour', 'computer science', 'books', 'nature'],
}
```

## API

### `defaultComposer`

```js
defaultComposer(defaultsPriorityN, [..., defaultsPriority2, defaultsPriority1, objectWithData])
```

This function takes one or more objects as arguments and returns a new object with default values applied. The first argument should be an object containing the default values to apply. Subsequent arguments should be the objects to apply the default values to.

If a property in a given object is either empty, null, or undefined, and the corresponding property in the defaults object is not empty, null, or undefined, the default value will be used.

**Example**:

```js
import { defaultComposer } from "default-composer";

const defaultsPriority1 = {
  name: "Aral 😊",
  hobbies: ["reading"],
};

const defaultsPriority2 = {
  name: "Aral 🤔",
  age: 33,
  address: {
    street: "123 Main St",
    city: "Anytown",
    state: "CA",
    zip: "12345",
  },
  hobbies: ["reading", "hiking"],
};

const object = {
  address: {
    street: "",
    city: "Anothercity",
    state: "NY",
    zip: "",
  },
  hobbies: ["running"],
};

const result = defaultComposer(defaultsPriority2, defaultsPriority1, object);

console.log(result);
```

This will output:

```js
{
  name: 'Aral 😊',
  age: 33,
  address: {
    street: '123 Main St',
    city: 'Anothercity',
    state: 'NY',
    zip: '12345'
  },
  hobbies: ['running']
}
```

### `setConfig`

`setConfig` is a function that allows you to set configuration options for `defaultComposer`. Currently, the only configuration option available is `emptyChecker`, which is a function that determines whether a value should be considered empty or not. By default, is detected as empty when is null, undefined, an empty string, an empty array, or an empty object. However, you can use `setConfig` to provide your own implementation of `emptyChecker` if you need to customize this behavior.

Here is an example of how you can use `setConfig`:

```ts
import { defaultComposer, setConfig } from "default-composer";

const isNullOrWhitespace = (key: string, value: unknown) => {
  return value === null || (typeof value === "string" && value.trim() === "");
};

setConfig({ emptyChecker: isNullOrWhitespace });

const defaults = { example: "replaced", anotherExample: "also replaced" };
const originalObject = { example: "   ", anotherExample: null };
const result = defaultComposer<any>(defaults, originalObject);
console.log(result); // { example: 'replaced', anotherExample: 'also replaced' }
```

## TypeScript

In order to use in TypeScript you can pass a generic with the expected output, and all the expected input by default should be partials of this generic.

Example:

```ts
type Addres = {
  street: string;
  city: string;
  state: string;
  zip: string;
};

type User = {
  name: string;
  age: number;
  address: Address;
  hobbies: string[];
};

const defaults = {
  name: "Aral 😊",
  hobbies: ["reading"],
};

const object = {
  age: 33,
  address: {
    street: "",
    city: "Anothercity",
    state: "NY",
    zip: "",
  },
  hobbies: [],
};

defaultComposer<User>(defaults, object);
```

## Contributing

Contributions to "default-composer" are welcome! If you find a bug or want to suggest a new feature, please open an issue on the GitHub repository. If you want to contribute code, please fork the repository and submit a pull request with your changes.

## License

"default-composer" is licensed under the MIT license. See [LICENSE](LICENSE) for more information.

## Credits

"default-composer" was created by [Aral Roca](https://github.com/aralroca).

<img src="https://img.shields.io/twitter/follow/aralroca?style=social&logo=twitter"
            alt="follow on Twitter"></a>
