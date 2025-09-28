// Test básico para verificar que Jest funciona correctamente
describe('Basic Tests', () => {
  test('Jest is working', () => {
    expect(1 + 1).toBe(2);
  });

  test('JavaScript array methods work', () => {
    const arr = [1, 2, 3];
    expect(arr.length).toBe(3);
    expect(arr.includes(2)).toBe(true);
  });

  test('String methods work', () => {
    const str = 'Hello World';
    expect(str.toLowerCase()).toBe('hello world');
    expect(str.includes('World')).toBe(true);
  });
});
