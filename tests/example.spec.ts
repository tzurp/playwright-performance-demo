import {test as base, expect} from '@playwright/test';
import extendPlaywrightPerformance, {PerformanceOptions, PerformanceWorker, PlaywrightPerformance} from "playwright-performance";
import extendPlaywrightCleanup, { PlaywrightCleanup, CleanupOptions } from "playwright-cleanup";

const cleanupOptions: CleanupOptions = {
  suppressLogging: true
};

const options: PerformanceOptions = {
  analyzeByBrowser: false,
  disableAppendToExistingFile: false,
  dropResultsFromFailedTest: false,
  performanceResultsDirectoryName: "performance-results",
  performanceResultsFileName: "performance-results",
  suppressConsoleResults: false,
  recentDays: 1,
};

const btest = base.extend<PlaywrightPerformance, PerformanceOptions & PerformanceWorker>(extendPlaywrightPerformance(options));
const test = btest.extend<PlaywrightCleanup, CleanupOptions>(extendPlaywrightCleanup(cleanupOptions));

for (let i = 0; i < 3; i++) {
  test('startup performance ' + i, async ({ page, performance, cleanup }) => {
    await page.goto("http://www.microsoft.com");
    cleanup.addCleanup(async () => {console.log("cleanup")});
    performance.sampleStart("startup_SF");
    await page.goto('https://sourceforge.net/');
    performance.sampleEnd("startup_SF");

    performance.sampleStart("startup_GH");
    await page.goto('http://github.com/');
    performance.sampleEnd("startup_GH");

    const message = performance.getSampleTime("startup_GH") < performance.getSampleTime("startup_SF") ? "GitHub is faster" : "SourceForge is faster";

    console.log(message);

    expect(typeof performance.getSampleTime("startup_GH")).toBe("number");
  });
};
