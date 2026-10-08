## 1. Test Plan ID
* **Project:** client-server-demo
* **Version:** v1.0.
* **Date:** 26.9.2026
* **Author:** Sergey Fishman

## 2. Introduction and Objectives
*   **Purpose:** To define the testing scope, strategy, resources, and schedule for the upcoming release.
*   **Main Objective:** Ensure the software meets business requirements, functions reliably, and contains no critical or major defects before deployment to production.

### 2.1. In Scope
* Contacts form functionality
* Contacts table functionality
* Database integraion
* Usability testing
* Internationalization testing
* Compatibility testing
### 2.2. Out of Scope
* Accessibility testing
* Performance testing
* Stress testing
* Scalability testing
* Reliability testing

## 3. Test Approach

### 3.1. Testing levels
* Integration Testing (api and database integration)
* System Testing (end-to-end)

### 3.2. Test types
* **Functional:** business-logic test, UI, form validation, table functionality.
* **Non-functional:** UX usability, cross-browser compatibility(Chrome, Firefox, Safari).

### 3.3. Automation
* **Manual:** 100%: all functional tests + non-functional.
* **Automated:** 90%: all functional tests + some non-functional tests. New features will be tested manually first.

## 4. Testing criteria

### 4.1. Entry Criteria
* The Requirements are defined and approved.
* The Test environment is configured.
* Test cases are ready
* The build is successfully deployed to the QA environment.

### 4.2. Suspension and resumption criteria
* **Suspension:** Testing will be paused if blocking defects prevent access to more than 30% of core application features.
*  **Resumption:** Testing resumes once a hotfix is deployed and verified by a successful Smoke Test.

### 4.3. Exit Criteria
* 100% of planned critical path test cases are completed.
* At least 95% of test cases have passed.
* Zero open Blockers, Critical, or Major bugs. Remaining Low/Minor bugs are documented.

## 5. Schedule and Resources

### 5.1. Resources
* **QA Lead:** — planning, coordination, final report.
* **QA Engineer:** — test cases writing, manual testing.
* **QA Automation:** — automation of tests.

### 5.2. Milestones
| Milestone | Start date | End date | Responsibility |
| :--- | :--- | :--- | :--- |
| Requirements analysis and test design | 26.9.2026 | 30.9.2026 | QA Team |
| Functional testing | 26.9.2026 | 30.9.2026 | QA Engineers |
| Regressional testing and automation | 26.9.2026 | 30.9.2026 | QA Automation |
| Test Summary Report | 26.9.2026 | 30.9.2026 | QA Lead |

## 6. Test Environment
* **Test stand (URL):** `http://localhost/client-server-demo`
* **Defect Tracking Tool:** Google Sheets
* **Test Case Management:** Google Sheets
* **Platforms & Browsers:** Web (Chrome, Safari), Mobile (iOS 17+).
* **Tools:** Java Selenium, Postman, Devtools

## 7. Risks & Contingency actions
1.   **Risk:** Delay in the development delivery timeline.
		*   *Contingency:* Reduce the scope of non-functional testing and prioritize core functional regression test cases.

## 8. Deliverables
* Relevant set of test cases
* List of identified bugs
