import { describe, it, expect, vi } from "vitest";
import { generateReportData } from "./data";

describe("generateReportData()", () => {
  it("should execute logFn if provided", () => {
    const logger = vi.fn();
    logger.mockImplementation(() => {});
    logger.mockImplementationOnce(() => {}); //This can be used if you are not fine with the empty function.
    generateReportData(logger);
    expect(logger).toBeCalled();
  });
});

