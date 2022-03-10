import { assert }   from 'chai';
import { Password } from '../src/index';


const PW         = '7PaeT/A#4k8&7G/TpEuu1rg';
const PW_MIN     = 'T/A#4k';
const PW_SHORT   = 'T/A#';
const PW_EMPTY   = '';

const EXPIRY      = 1646893361146;
const EXPIRY_NULL = null;
const EXPIRY_ZERO = 0;

const MIN_LENGTH      = 8;
const MIN_LENGTH_ONE  = 1;
const MIN_LENGTH_ZERO = 0;

const SALT_ROUNDS      = 10;
const SALT_ROUNDS_ZERO = 0;
const SALT_ROUNDS_ONE  = 1;


describe('Testing Password Class', function(){

    describe('Instance Creation', function(){

        it('1. Typical', async function(){
            let pw = await Password.create(PW);
            assert(pw instanceof Password);
        });

        it('2. Password and Expiry', async function(){
            let pw = await Password.create(PW, EXPIRY);
            assert(pw instanceof Password);
        });

        it('3. All Parameters', async function(){
            let pw = await Password.create(PW, EXPIRY, MIN_LENGTH, SALT_ROUNDS);
            assert(pw instanceof Password);
        });

        it('4. Minimum-Length Password', async function(){
            let pw = await Password.create(PW_MIN);
            assert(pw instanceof Password);
        });

        it('5. Short Password', async function(){
            try {
                await Password.create(PW_SHORT);
            } catch(e) {
                assert(e instanceof Error && e.message === 'invalid_plain');
            }
        });

        it('6. Empty Password', async function(){
            try {
                await Password.create(PW_EMPTY);
            } catch(e) {
                assert(e instanceof Error && e.message === 'invalid_plain');
            }
        });

        it('7. Null Expiry', async function(){
            let pw = await Password.create(PW, EXPIRY_NULL);
            assert(pw instanceof Password);
        });

        it('8. Zero Expiry', async function(){
            let pw = await Password.create(PW, EXPIRY_ZERO);
            assert(pw instanceof Password);
        });

        it('9. Minimum Length: One', async function(){
            let pw = await Password.create(PW, EXPIRY, MIN_LENGTH_ONE);
            assert(pw instanceof Password);
        });

        it('10. Minimum Length: Zero', async function(){
            try {
                await Password.create(PW, EXPIRY, MIN_LENGTH_ZERO);
            } catch(e) {
                assert(e instanceof Error && e.message === 'invalid_minLength');
            }
        });

        it('11. Zero SaltRounds', async function(){
            try {
                await Password.create(PW, EXPIRY, MIN_LENGTH, SALT_ROUNDS_ZERO);
            } catch(e) {
                assert(e instanceof Error && e.message === 'invalid_saltRounds');
            }
        });

        it('12. One SaltRounds', async function(){
            let pw = await Password.create(PW, EXPIRY, MIN_LENGTH, SALT_ROUNDS_ONE);
            assert(pw instanceof Password);
        });

    });

    describe('Password Verification', function(){

        it('1. Typical', async function(){
            let pw = await Password.create(PW);
            let r  = await pw.verify(PW);
            assert(r === true);
        });

        it('2. Expired', async function(){
            let pw = await Password.create(PW, EXPIRY_ZERO);
            let r  = await pw.verify(PW);
            assert(r === false);
        });

        it('3. Wrong Password', async function(){
            let pw = await Password.create(PW);
            let r  = await pw.verify(PW_MIN);
            assert(r === false);
        });

    });

    describe('toString', function(){
        it('Displaying Hashed String', async function(){
            let pw = await Password.create(PW);
            assert(pw.hashed === String(pw));
        });
    });

});
