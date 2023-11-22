import { beforeEach, describe, expect, it, mock } from "bun:test";
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
  [Symbol.isConcatSpreadable]: boolean;
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
      [Symbol.isConcatSpreadable]: false,
    } as User;

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
    } as unknown as User;

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
      [Symbol.isConcatSpreadable]: false,
    };

    expect(defaultComposer<User>(defaults, originalObject)).toEqual(expected);
  });

  it("should work with multiple objects", () => {
    const defaultsPriority1 = {
      name: "Aral 😊",
      hobbies: ["reading"],
    } as User;

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
    } as User;

    const object = {
      address: {
        street: "",
        city: "Anothercity",
        state: "NY",
        zip: "",
      },
      hobbies: ["running"],
    } as User;

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
      defaultComposer<User>(defaultsPriority2, defaultsPriority1, object),
    ).toEqual(expected);
  });

  it("should work with functions inside the object", () => {
    const mockFn = mock();
    const defaults = {
      test: () => mockFn(),
    };

    const object = {
      test: null,
    };

    const output = defaultComposer<any>(defaults, object);

    output.test();

    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  it("should work with enumerable symbol properties", () => {
    const tag = Symbol.for("tag");
    const version = Symbol.for("version");
    const createdAt = Symbol.for("createdAt");

    const defaults = {
      [tag]: "user",
      [createdAt]: Date.UTC(2020, 1, 1),
    };

    Object.defineProperty(defaults, version, { value: 1, enumerable: false });

    const object = {
      [createdAt]: Date.UTC(2023, 6, 1),
    };

    const expected = {
      [tag]: "user",
      [createdAt]: Date.UTC(2023, 6, 1),
    };

    expect(defaultComposer<any>(defaults, object)).toEqual(expected);
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
    const isNullOrWhitespace = ({ value }) =>
      value === null || (typeof value === "string" && value.trim() === "");

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
    const isNullOrWhitespace = ({ value, defaultableValue }) =>
      defaultableValue || (typeof value === "string" && value.trim() === "");

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

  it("should merge arrays when config.mergeArrays is true", () => {
    const defaults = {
      hobbies: ["reading"],
      another: ["another"],
      nested: {
        example: ["a", "b", "c"],
        nums: [1, 2, 3],
        objects: [{ a: 1 }, { b: 2 }],
        notDefaultableKey: ["defaultValue"],
      },
    };

    const object = {
      hobbies: ["running"],
      nested: {
        example: ["a", "d", "e"],
        nums: [1, 4, 5],
        objects: [{ a: 1 }, { b: 2 }],
        notDefaultableKey: ["shouldNotBeMerged"],
      },
    };

    const expected = {
      hobbies: ["reading", "running"],
      another: ["another"],
      nested: {
        example: ["a", "b", "c", "d", "e"],
        nums: [1, 2, 3, 4, 5],
        objects: [{ a: 1 }, { b: 2 }, { a: 1 }, { b: 2 }],
        notDefaultableKey: ["shouldNotBeMerged"],
      },
    };

    const isDefaultableValue = ({ defaultableValue, key }) =>
      defaultableValue && key !== "notDefaultableKey";

    setConfig({ mergeArrays: true, isDefaultableValue });

    expect(defaultComposer<any>(defaults, object)).toEqual(expected);
  });

  it('should respect the Date object', () => {
    const defaults = {
      date: new Date(),
    };

    const object = {
      date: new Date(2020, 1, 1),
      anotherDate: new Date(2020, 2, 1),
    };

    const expected = {
      date: new Date(2020, 1, 1),
      anotherDate: new Date(2020, 2, 1),
    };

    expect(defaultComposer<any>(defaults, object)).toEqual(expected);
  });
});
