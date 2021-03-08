import hello from "./main";

describe("main test", () => {
  it("should return greet the caller", () => {
    const result = hello();
    expect(result).toBe("hello world")
  })
});