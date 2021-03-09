
import { getAverageGweiForBlocksFile, getTotalGwei, sortBlocks } from "./fees";
import allBlocks from "./testBlocks.json";

describe("Orders", () => {
  it("should get the total gas used for blocks", () => {
    const result = getTotalGwei(allBlocks);
    expect(result.toNumber()).toBe(12521845);
  })
  it("should sort blocks in correct order with latest transaction first", () => {
    const result = sortBlocks(allBlocks);
    expect(result[0].params.result.number).toBe("0x7d31f1");
    expect(result.reverse()[0].params.result.number).toBe("0x7d31ef");
  })
  it("should return the correct average for all blocks when a last property is not defined", () => {
    const result = getAverageGweiForBlocksFile("./services/fees/testBlocks.json");
    expect(result).toBe(4173948);
  })
  it("should return the correct average for the latest 2 blocks", () => {
    const result = getAverageGweiForBlocksFile("./services/fees/testBlocks.json", 2);
    expect(result).toBe(4869994);
  })
  it("should return the correct average for all the blocks when last is greater than number of blocks", () => {
    const result = getAverageGweiForBlocksFile("./services/fees/testBlocks.json", 5);
    expect(result).toBe(4173948);
  })
});