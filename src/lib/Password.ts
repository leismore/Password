/**
 * Password class
 */

import bcrypt = require('bcrypt');
import { Password as PasswordType } from './type/Password';

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
    {
        let pw:PasswordType;
        let hashed:string;
        let generated:number;

        // Test minLength
        if (typeof minLength === 'number')
        {
            minLength = Math.abs( Math.round(minLength) );
            if (minLength === 0)
            { throw new Error('invalid_minLength'); }
        }
        else
        {
            throw new Error('invalid_minLength');
        }
        
        // Test plain
        if (typeof plain !== 'string' || plain.length < minLength)
        { throw new Error('invalid_plain'); }

        // Test expiry
        if (expiry === null)
            {}
        else if (typeof expiry === 'number')
            { expiry = Math.abs( Math.round(expiry) ); }
        else
            { throw new Error('invalid_expiry'); }

        // Test saltRounds
        if (typeof saltRounds === 'number')
        {
            saltRounds = Math.abs( Math.round(saltRounds) );
            if (saltRounds === 0)
            { throw new Error('invalid_saltRounds'); }
        }
        else
            { throw new Error('invalid_saltRounds'); }
        
        // Create the Password object
        try {
            hashed = await bcrypt.hash(plain, saltRounds);
        } catch(e) {
            throw new Error('bcrypt_failure');
        }
        generated = Date.now();
        pw = { hashed: hashed, generated: generated, expiry: expiry };
        return new Password(pw);
    }

    /**
     * @param  {PasswordType} password
     * @throws {Error}        - invalid_hashed | invalid_generated | invalid_expiry
     */
    public constructor(password: PasswordType)
    {
        const NOW = Date.now();

        // Test hashed
        if (password.hashed.length === 0)
            { throw Error('invalid_hashed'); }

        // Test generated
        password.generated = Math.abs( Math.round(password.generated) );

        if (password.generated > NOW)
            { throw new Error('invalid_generated'); }

        // Test expiry
        if (password.expiry !== null)
            { password.expiry = Math.abs( Math.round(password.expiry) ); }

        // Init
        this.hashed    = password.hashed;
        this.generated = password.generated;
        this.expiry    = password.expiry;
    }

    /**
     * @param  {string} plain - Plain password
     * @throws {Error}        - invalid_plain | bcrypt_failure
     */
    public async verify(plain:string):Promise<Boolean>
    {
        const NOW = Date.now();

        if (typeof plain !== 'string' || plain.length === 0)
        {
            throw new Error('invalid_plain');
        }

        // If expired
        if (this.expiry !== null && NOW >= this.expiry)
        {
            return false;
        }

        // Comparison
        try
        {
            return await bcrypt.compare(plain, this.hashed);
        }
        catch (e)
        {
            throw new Error('bcrypt_failure');
        }
    }

    public toString():string
    {
        return this.hashed;
    }
}

export { Password };
