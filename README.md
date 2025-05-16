# UI & SEO & Crawlability Test Suite


## Setup

### 1. Install all dependiences  run
```bash
    npm install
```
### 2. Create a `.env` file in the root of the project
The file should contain:

`BASE_URL="base url from the test task"`

-----

## How to Run Tests

### UI Tests

UI test cases have been moved to a separate folder, as they are significantly different from SEO-related checks.

To run the UI tests, use the following command:

```bash
    npm run run:ui-tests
```

### SEO Tests

These tests have also been moved to a separate folder, similar to the UI tests.

To run the SEO tests, use the following command:

```bash
npm run run:seo-tests
```
This script includes execution of a utility that fetches the sitemap.xml and saves all URLs into a JSON file. This optimization significantly improves the speed of test execution by avoiding repeated requests during runtime.

## Why each link in SEO tests has its own `test(...)`

Each page from the sitemap is tested as a **separate Playwright `test(...)` block**. This design decision was intentional and based on the following reasons:

### 1. Full Parallel Execution
By isolating each page into its own test, Playwright is able to:
- Run tests in **full parallel**, drastically reducing total execution time
- Take full advantage of multi-threaded environments in CI/CD

### 2. Clear Error Isolation
If any internal link leads to a 404 error:
- The failing test will clearly show **which page had the issue**
- Makes debugging much faster and more focused




