import { defaultComposer, setConfig } from ".";

type Address = {
  street?: string;
  city?: string;
  state?: string;
  zip?: string;
};

type User = {
  name: string;
  surname?: string;
  isDeveloper?: boolean;
  isDesigner?: boolean | null;
  age: number | null;
  address: Address;
  hobbies: string[];
  emails: string[];
  toString: string;
  constructor: string | null;
};

describe("defaultComposer", () => {
  beforeEach(() => setConfig({}));

  it("should defaultComposer defaults with originalObject", () => {
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
      toString: "I am Aral",
    };

    const originalObject = {
      name: "Aral",
      emails: [],
      isDesigner: null,
      phone: "555555555",
      age: null,
      address: {
        zip: "54321",
      },
      hobbies: ["parkour", "computer science", "books", "nature"],
      constructor: null,
    };

    const expected = {
      name: "Aral",
      surname: "",
      isDeveloper: true,
      isDesigner: false,
      emails: ["contact@aralroca.com"],
      phone: "555555555",
      age: 33,
      address: {
        street: "123 Main St",
        city: "Anytown",
        state: "CA",
        zip: "54321",
      },
      hobbies: ["parkour", "computer science", "books", "nature"],
      toString: "I am Aral",
      constructor: null,
    };

    expect(defaultComposer<User>(defaults, originalObject)).toEqual(expected);
  });

  it("should work with multiple objects", () => {
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

    const expected = {
      name: "Aral 😊",
      age: 33,
      address: {
        street: "123 Main St",
        city: "Anothercity",
        state: "NY",
        zip: "12345",
      },
      hobbies: ["running"],
    };

    expect(
      defaultComposer<User>(defaultsPriority2, defaultsPriority1, object)
    ).toEqual(expected);
  });

  it("should work with functions inside the object", () => {
    const mockFn = jest.fn();
    const defaults = {
      test: () => mockFn(),
    };

    const object = {
      test: null,
    };

    const output = defaultComposer<any>(defaults, object);

    output.test();

    expect(mockFn).toBeCalledTimes(1);
  });

  it("should work with a custom isDefaultableValue", () => {
    const defaults = {
      original: {
        shouldKeepOriginal1: "replaced",
        shouldKeepOriginal2: "replaced",
      },
      mixed: {
        shouldTakeDefault1: "replaced",
        shouldTakeDefault2: "replaced",
        shouldKeepOriginal1: "replaced",
        shouldKeepOriginal2: "replaced",
        shouldKeepOriginal3: "replaced",
        shouldKeepOriginal4: "replaced",
      },
    };
    const object = {
      original: {
        shouldKeepOriginal1: "original",
        shouldKeepOriginal2: true,
      },
      mixed: {
        shouldTakeDefault1: " ",
        shouldTakeDefault2: null,
        shouldKeepOriginal1: false,
        shouldKeepOriginal2: undefined,
        shouldKeepOriginal3: [],
        shouldKeepOriginal4: {},
      },
    };
    const isNullOrWhitespace = ({
      key,
      value,
    }: {
      key: string;
      value: unknown;
    }) => {
      return (
        value === null || (typeof value === "string" && value.trim() === "")
      );
    };

    const expected = {
      original: {
        shouldKeepOriginal1: "original",
        shouldKeepOriginal2: true,
      },
      mixed: {
        shouldTakeDefault1: "replaced",
        shouldTakeDefault2: "replaced",
        shouldKeepOriginal1: false,
        shouldKeepOriginal2: undefined,
        shouldKeepOriginal3: [],
        shouldKeepOriginal4: {},
      },
    };

    setConfig({ isDefaultableValue: isNullOrWhitespace });

    expect(defaultComposer<any>(defaults, object)).toEqual(expected);
  });

  it("should work with a custom isDefaultableValue reusing pre-calculated defaultableValue ", () => {
    const defaults = {
      original: {
        shouldKeepOriginal1: "replaced",
        shouldKeepOriginal2: "replaced",
      },
      mixed: {
        shouldTakeDefault1: "replaced",
        shouldTakeDefault2: "replaced",
        shouldKeepOriginal1: "replaced",
        shouldKeepOriginal2: "replaced",
        shouldKeepOriginal3: "replaced",
        shouldKeepOriginal4: "replaced",
      },
    };
    const object = {
      original: {
        shouldKeepOriginal1: "original",
        shouldKeepOriginal2: true,
      },
      mixed: {
        shouldTakeDefault1: " ",
        shouldTakeDefault2: null,
        shouldKeepOriginal1: false,
        shouldKeepOriginal2: undefined,
        shouldKeepOriginal3: [],
        shouldKeepOriginal4: {},
      },
    };
    const isNullOrWhitespace = ({
      key,
      value,
      defaultableValue,
    }: {
      key: string;
      value: unknown;
      defaultableValue: boolean;
    }) => {
      return (
        defaultableValue || (typeof value === "string" && value.trim() === "")
      );
    };

    const expected = {
      original: {
        shouldKeepOriginal1: "original",
        shouldKeepOriginal2: true,
      },
      mixed: {
        shouldTakeDefault1: "replaced",
        shouldTakeDefault2: "replaced",
        shouldKeepOriginal1: false,
        shouldKeepOriginal2: "replaced",
        shouldKeepOriginal3: "replaced",
        shouldKeepOriginal4: "replaced",
      },
    };

    setConfig({ isDefaultableValue: isNullOrWhitespace });

    expect(defaultComposer<any>(defaults, object)).toEqual(expected);
  });
});
