# Password Class

A class for password handling.

## Installation

`npm install @leismore/password`

## Test

`npm test`

## Examples

**Creating the Password Instance**

```typescript

import { Password } from '@leismore/password';

Password.create('YOUR_PLAIN_PASSWORD').then(pw => {
    // Your hashed password
    console.log(pw.hashed);
}).catch(e => {
    console.log(e);
});

```

**Password Verification**

```typescript

import { Password } from '@leismore/password';

Password.create('YOUR_PLAIN_PASSWORD').then(pw => {
    return pw.verify('YOUR_PLAIN_PASSWORD');
}).then(result => {
    console.log(result); // Should be 'true'
}).catch(e => {
    console.log(e);
});

```

## API

```typescript

type Password = {
  hashed:     string,        // Hashed password
  generated:  number,        // Unix timestamp (milliseconds)
  expiry:     (number|null)  // Unix timestamp (milliseconds)
};

const SALT_ROUNDS_DEFAULT         = 10;
const PASSWORD_MIN_LENGTH_DEFAULT = 6;  // Characters

class Password
{
    public hashed:     string;          // Hashed password
    public generated:  number;          // Unix timestamp (milliseconds)
    public expiry:     (number|null);   // Unix timestamp (milliseconds)

    /**
     * Create a Password instance
     * @param  plain        - Plain password
     * @param  expiry       - Unix timestamp (milliseconds)
     * @param  minLength    - Minimum plain password length
     * @param  saltRounds   - bcrypt saltRounds parameter <https://www.npmjs.com/package/bcrypt>
     * @throws {Error}      - invalid_plain | invalid_expiry | invalid_minLength | invalid_saltRounds | bcrypt_failure
     */
    public static async create(
        plain:       string,
        expiry:     (number|null) = null,
        minLength:   number       = PASSWORD_MIN_LENGTH_DEFAULT,
        saltRounds:  number       = SALT_ROUNDS_DEFAULT
    ): Promise<Password>

    /**
     * @param  {PasswordType} password
     * @throws {Error}        - invalid_hashed | invalid_generated | invalid_expiry
     */
    public constructor(password: PasswordType)

    /**
     * @param  {string} plain - Plain password
     * @throws {Error}        - invalid_plain | bcrypt_failure
     */
    public async verify(plain:string):Promise<Boolean>

    public toString():string
}

```

## Authors

* [Kyle Chine](https://www.kylechine.name) (Initialised at 10 March 2022)

## License

GNU Affero General Public License v3.0

## Credit

Based on [NPM: Bcrypt](https://www.npmjs.com/package/bcrypt)
