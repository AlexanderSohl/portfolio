# Portfolio test record

Live site: https://alexandersohl.github.io/portfolio/  
Test date: November 5, 2026  
Environment: Chrome headless, GitHub Pages; responsive checks at 375 × 812 and 1366 × 900.

| ID | Testing | Steps | Expected | Result |
|---|---|---|---|---|
| T01 | Navigation destinations on every page | Open each of the five live pages and inspect every navigation link; open each destination. | Each page shows the same five links and all five destinations load. | Pass — all 25 page/link combinations checked; destinations returned HTTP 200. |
| T02 | Phone layout | Open all five pages at 375 × 812; compare document and viewport widths. | No horizontal overflow; page has one h1. | Pass — widths matched at 375 px on every page. |
| T03 | Laptop layout | Open all five pages at 1366 × 900; compare document and viewport widths. | No horizontal overflow; page has one h1. | Pass — document and viewport content widths matched on every page. |
| T04 | Mobile menu by mouse | At phone width, click the menu button on every page, then click it again. | Menu opens and closes and `aria-expanded` tracks its state. | Pass — open and close states verified on all five pages. |
| T05 | Mobile menu by keyboard | At phone width, focus the menu button, press Enter, then Escape on every page. | Enter opens the menu; Escape closes it and returns focus to the menu button. | Pass — verified on all five pages. |
| T06 | Keyboard navigation (Tab and Enter) | At 375 × 812, Tab to the menu button, press Enter to open it, Tab to About, and press Enter. At 1366 × 900, Tab through the site name to About and press Enter. Repeat from each page at both sizes. | Focus reaches the About link and Enter opens About from every page on phone and laptop. | Pass — all ten page/viewport combinations opened About using Tab and Enter. |
| T07 | HTML and shared stylesheet rules | Inspect every live page for h1 count, stylesheet links, inline event/style markup, and image alt attributes. | One h1, one stylesheet, no inline styles/scripts, and no image missing alt text. | Fail: the Google Fonts stylesheet link made two stylesheets. Fixed in commit `b8c3d12` (“Keep one stylesheet and load Google font files directly”). Re-run: Pass — each page has one h1 and one stylesheet; no inline markup or missing alt text found. |
| T08 | Browser errors and missing resources | Load each live page with a clean cache and collect console exceptions and failed HTTP responses. | No console errors, exceptions, or failed resources. | Pass — none found on the five pages; the favicon returned successfully. |
| T09 | Home typewriter and featured links | Load Home, observe the typewriter, and inspect the three featured project links. | Typewriter cycles its phrases; each preview links to Projects. | Pass — text changed while observed and all three previews link to `projects.html`. |
| T10 | Global scroll progress | Scroll a long page and inspect the fixed progress indicator. | Progress increases as the document scrolls. | Pass — indicator transform advanced with scroll position. |
| T11 | About story and chapter progress | Scroll through all seven About steps, including the final “Where I’m Headed” section. | Active chapter label updates and the progress line reaches the end. | Pass — final chapter became active and progress fill reached the full track. |
| T12 | Project story visuals | Scroll through project steps. | The current step becomes active and its matching visual is shown. | Pass — “Build a colony” activated with its matching GOOB screenshot. |
| T13 | Full-screen project image dialog | Open the active project visual, press Escape, and inspect focus. | Dialog opens with descriptive alt text, closes with Escape, and returns focus to its opener. | Pass — verified with the active GOOB visual. |
| T14 | Rover route animation | Scroll from the first Rover step to the final step. | Route draws forward and the rover marker moves to the route’s end. | Pass — route dash offset changed from 940 to 0 and marker reached the final waypoint. |
| T15 | Project videos and media links | Check all three live MP4 URLs and the native video controls. | Videos load successfully and controls are available. | Pass — all three MP4 URLs returned HTTP 200; controls and labels are present. |
| T16 | Contact form invalid input | Submit the empty form. | Name, email, and message each show a readable error; focus moves to the first invalid field. | Pass — all three errors appeared and focus moved to Name. |
| T17 | Contact form valid input | Submit a valid name, email, and message. | Errors clear, success note appears, and a mailto to `aws36@njit.edu` is prepared. | Pass — success note appeared and the recipient mailto was correct. Headless testing verified the prepared mailto; it cannot launch a visitor’s external mail app. |
| T18 | Goob mascot | Activate the mascot twice on one page load. | Accessible button shows a speech bubble with one consistent random name. | Pass — label was “Say hi to a Goob”; the same name appeared on both activations. |
| T19 | Reduced motion | Emulate `prefers-reduced-motion: reduce` on Home. | Canvas is not rendered, the first typewriter phrase is static, and Goob rests on frame 0. | Pass — canvas display was none, phrase was “I build games.”, and sprite position was frame 0. |
| T20 | Scroll reveal | Scroll a featured project card into view. | Card reveals as it enters the viewport. | Pass — card gained its revealed state after entering view. |
| T21 | Lighthouse Accessibility | Run Lighthouse against each live page. | Every page scores at least 90. | Pass — Home 100, About 100, Projects 100, Skills 100, Contact 100. |
