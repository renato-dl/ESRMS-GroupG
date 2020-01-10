import { genRandomString, hashPassword, verifyPassword } from "../src/services/passwordGenerator";

describe("Tests password service", () => {

  test('It should generate a random string', async () => {
    const length = 12;
    const randomStr = genRandomString(length);
    expect(randomStr).not.toBeNull();
    expect(randomStr.length).toBe(length);
  });

  test('It should hash a password/string', async () => {
    const password = 'Th3M0stSecur3Passw0rd1nTh3W0rld';
    const hash = await hashPassword(password);
    expect(hash).not.toBeNull();
    expect(hash).not.toBe(password);
  });

  test('It should verify hash and a clear password', async () => {
    const password = 'Th3M0stSecur3Passw0rd1nTh3W0rld';
    const hash = await hashPassword(password);
    expect(hash).not.toBeNull();
    expect(hash).not.toBe(password);

    const isTheSamePassword = await verifyPassword(password, hash);
    expect(isTheSamePassword).toBeTruthy();

    const notTheSamePassword = await verifyPassword('RandomOne', hash);
    expect(notTheSamePassword).not.toBeTruthy();
  });
})