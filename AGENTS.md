# Portfolio Website Instructions

## About this site
- Personal portfolio for Alexander Sohl, a ✏️ [your major] student at NJIT.
- Purpose: show my projects, skills, and experience to recruiters and classmates.
- Pages (same navigation on every page):
  - `index.html` (Home): short intro and links to the other pages
  - `about.html` (About): background, education, interests
  - `projects.html` (Projects): at least three projects, each with a description, image, and link if available
  - `skills.html` (Skills): technical skills and proficiency
  - `contact.html` (Contact): email and links, plus a contact form validated with JavaScript that directs visitors to my email

## Design
- Colors: background ✏️ #______, text ✏️ #______, accent ✏️ #______
- Fonts: ✏️ [e.g., system sans-serif for everything]
- Style: ✏️ [e.g., clean and modern, card layout for projects]
- Use the same colors and fonts on every page. Text must have good contrast against the background.
- Responsive: must work on phone and laptop with no sideways scrolling. Use media queries.

## Technology and structure
- Plain HTML, CSS, and JavaScript only. No frameworks, libraries, build tools, or npm.
- One external stylesheet at `css/style.css` and one script at `js/script.js`.
- No inline styles or inline JavaScript.
- Semantic HTML5 (`header`, `nav`, `main`, `section`, `footer`). Exactly one `<h1>` per page, headings in order.
- Relative file paths only. The site must work by double-clicking `index.html` and on GitHub Pages.
- Every image needs descriptive `alt` text. Store images in `images/`, each under 500 KB.

## JavaScript features
- Responsive navigation menu (hamburger button on small screens) that opens and closes with a mouse and with the keyboard.
- Contact form validation.
- No errors in the browser console.

## Content and privacy
- Never invent content about me. If you need content I haven't given you, ask me instead of writing placeholder text.
- Never include a phone number, street address, API keys, or passwords.

## Accessibility
- All links, buttons, and form fields must work with Tab and Enter, with a visible focus outline.
- Aim for a Lighthouse Accessibility score of 90 or higher on every page.

## Git
- One task at a time. Stay within the requested scope.
- After each task, commit with a clear, specific message and push to GitHub.
- To undo a change, revert the commit. Never reset or force-push.