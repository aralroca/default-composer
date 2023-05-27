import defaultComposer from "."

type Address = {
  street?: string,
  city?: string,
  state?: string,
  zip?: string
}

type User = {
  name: string,
  surname?: string,
  isDeveloper?: boolean,
  isDesigner?: boolean,
  age: number | null,
  address: Address
  hobbies: string[]
  emails: string[]
}

describe('defaultComposer', () => {
  it('should defaultComposer defaults with originalObject', () => {
    const defaults = {
      name: 'Aral 😊',
      surname: '',
      isDeveloper: true,
      isDesigner: false,
      age: 33,
      address: {
        street: '123 Main St',
        city: 'Anytown',
        state: 'CA',
      },
      emails: ['contact@aralroca.com'],
      hobbies: ['programming'],
    };

    const originalObject = {
      name: 'Aral',
      emails: [],
      phone: '555555555',
      age: null,
      address: {
        zip: '54321'
      },
      hobbies: ['parkour', 'computer science', 'books', 'nature'],
    };

    const expected = {
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

    expect(defaultComposer<User>(defaults, originalObject)).toEqual(expected)
  })

  it('should work with multiple objects', () => {
    const defaultsPriority1 = {
      name: 'Aral 😊',
      hobbies: ['reading']
    };

    const defaultsPriority2 = {
      name: 'Aral 🤔',
      age: 33,
      address: {
        street: '123 Main St',
        city: 'Anytown',
        state: 'CA',
        zip: '12345'
      },
      hobbies: ['reading', 'hiking']
    }

    const object = {
      address: {
        street: '',
        city: 'Anothercity',
        state: 'NY',
        zip: ''
      },
      hobbies: ['running']
    };

    const expected = {
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

    expect(defaultComposer<User>(defaultsPriority2, defaultsPriority1, object)).toEqual(expected)
  })
});
