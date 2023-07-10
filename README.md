<div align="center">
<img src="./logo.svg" alt="Default composer logo" width="100" height="100" />
<h1>
<div><b>Default composer</b></div>
</h1>
</div>

_A **tiny** (~500B) **JavaScript library** that allows you to set **default values** for **nested objects**_

[![npm version](https://badge.fury.io/js/default-composer.svg)](https://badge.fury.io/js/default-composer)
[![gzip size](https://img.badgesize.io/https://unpkg.com/default-composer?compression=gzip&label=gzip)](https://unpkg.com/default-composer)
[![CI Status](https://github.com/aralroca/default-composer/actions/workflows/test.yml/badge.svg)](https://github.com/aralroca/default-composer/actions/workflows/test.yml)
[![Maintenance Status](https://badgen.net/badge/maintenance/active/green)](https://github.com/aralroca/default-composer#maintenance-status)
[![Weekly downloads](https://badgen.net/npm/dw/default-composer?color=blue)](https://www.npmjs.com/package/default-composer)
[![PRs Welcome][badge-prwelcome]][prwelcome]<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-4-orange.svg?style=flat-square)](#contributors-)

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
    - [`isDefaultableValue`](#isdefaultablevalue)
    - [`mergeArrays`](#mergearrays)
- [4. TypeScript](#typescript)
- [5. Contributing](#contributing)
- [6. License](#license)
- [7. Credits](#credits)
- [8. Contributors](#contributors-)

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

`setConfig` is a function that allows you to set configuration options for `defaultComposer`.

This is the available configuration:

- **`isDefaultableValue`**, is a function that determines whether a value should be considered defaultable or not.
- **`mergeArrays`**, is a boolean to define if you want to merge arrays (`true`) or not (`false`), when is set to `false` is just replacing to the default value when the original array is empty. By default is `false`.

#### `isDefaultableValue`

You can use `setConfig` to provide your own implementation of `isDefaultableValue` if you need to customize this behavior.

```ts
type IsDefaultableValueParams = ({
  key,
  value,
  defaultableValue,
}: {
  key: string;
  value: unknown;
  defaultableValue: boolean; // In case you want to re-use the default behavior
}) => boolean;
```

The `defaultableValue` boolean is the result of the default behavior of `isDefaultableValue`. By default, is detected as `defaultableValue` when is `null`, `undefined`, an empty `string`, an empty `array`, or an empty `object`.

Here is an example of how you can use `setConfig`:

```ts
import { defaultComposer, setConfig } from "default-composer";

const isNullOrWhitespace = ({ key, value }) => {
  return value === null || (typeof value === "string" && value.trim() === "");
};

setConfig({ isDefaultableValue: isNullOrWhitespace });

const defaults = { example: "replaced", anotherExample: "also replaced" };
const originalObject = { example: "   ", anotherExample: null };
const result = defaultComposer<any>(defaults, originalObject);
console.log(result); // { example: 'replaced', anotherExample: 'also replaced' }
```

Here is another example of how you can use `setConfig` reusing the `defaultableValue`:

```ts
import { defaultComposer, setConfig } from "default-composer";

setConfig({
  isDefaultableValue({ key, value, defaultableValue }) {
    return (
      defaultableValue || (typeof value === "string" && value.trim() === "")
    );
  },
});

const defaults = { example: "replaced", anotherExample: "also replaced" };
const originalObject = { example: "   ", anotherExample: null };
const result = defaultComposer<any>(defaults, originalObject);
console.log(result); // { example: 'replaced', anotherExample: 'also replaced' }
```

#### `mergeArrays`

Example to merge arrays:

```ts
const defaults = {
  hobbies: ["reading"],
};

const object = {
  hobbies: ["running"],
};
setConfig({ mergeArrays: true});

defaultComposer<any>(defaults, object)) // { hobbies: ["reading", "running"]}
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

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tbody>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://aralroca.com"><img src="https://avatars.githubusercontent.com/u/13313058?v=4?s=100" width="100px;" alt="Aral Roca Gomez"/><br /><sub><b>Aral Roca Gomez</b></sub></a><br /><a href="https://github.com/aralroca/default-composer/commits?author=aralroca" title="Code">💻</a> <a href="#maintenance-aralroca" title="Maintenance">🚧</a></td>
      <td align="center" valign="top" width="14.28%"><a href="http://robinpokorny.com"><img src="https://avatars.githubusercontent.com/u/68341?v=4?s=100" width="100px;" alt="Robin Pokorny"/><br /><sub><b>Robin Pokorny</b></sub></a><br /><a href="https://github.com/aralroca/default-composer/commits?author=robinpokorny" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/leeferwagen"><img src="https://avatars.githubusercontent.com/u/1287545?v=4?s=100" width="100px;" alt="Muslim Idris"/><br /><sub><b>Muslim Idris</b></sub></a><br /><a href="https://github.com/aralroca/default-composer/commits?author=leeferwagen" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/namhtpyn"><img src="https://avatars.githubusercontent.com/u/16488178?v=4?s=100" width="100px;" alt="namhtpyn"/><br /><sub><b>namhtpyn</b></sub></a><br /><a href="#infra-namhtpyn" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a></td>
    </tr>
  </tbody>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
