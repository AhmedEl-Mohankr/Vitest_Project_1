import { describe, it, expect, vi } from "vitest";
import { generateReportData } from "./data";

//example of using spies
/*
In here we don't need to call the logFn function from logger.js but instead we wanna find out whether
the log function gets called. So we can create such a spy replacement object.

Note: The log function has a side effect => logging to the console and interacts with the system 
console which is an *(an external system). And if we want to call like that and therefore, this 
technically also is a side effect and we should get rid of it.

So we need to make sure that the log message is being used.
-----------------------------------------------------

1- We need to add a logger const. 
2- We need to import a special object from Vitest and that's (Vi) object.
3- And for the jest on the jest object you can call a (fn) method.
4- (fn) creates an empty function which keeps track of any function executions of that function 
and if any calls of that function. It also keeps track of the arguments that were provided with those
calls.
5- So we now have got this empty replacement object with spy functionality and it's this function
, this logger function which we will pass to generateDataReport. This function doesn't do actually
anything but it allows us to find out whether it was executed because it is a spy.
6- We expect that (logger) was executed and this is done by expecting logger. In the test below, 
We are not executing it so we don't have parentheses(). We just pointed it. expect(logger). 
7- We expected logger was 'called' so for this we have to use "toBeCalled()" OR "toHaveBeenCalled".
8- toBeCalled => Will only make the test pass. 
*/

describe("generateReportData()", () => {
  it("should execute logFn if provided", () => {
    const logger = vi.fn();
    logger.mockImplementation(() => {});
    logger.mockImplementationOnce(() => {}); //This can be used if you are not fine with the empty function.
    generateReportData(logger);
    expect(logger).toBeCalled();
  });
});

/*
If you are working with fn(), on that function you can call the mockImplementation or
 the mockImplementationOnce methods then pass a function to it which will act as a replacement function.

*/
