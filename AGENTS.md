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
- Theme: Crimson Gothic.
- Colors: background `#0b0b0d`; panels `#16161a`; borders `#2a2a30`; text `#ece8e4`; muted text `#a8a29e`; deep crimson `#8b0000` and `#c1121f` for borders, glows, and decorative accents; brighter red `#ff4d5a` for links, buttons, and small red text.
- Fonts: use the Google Fonts `Cinzel` for headings and `Inter` for body text, with serif and sans-serif fallbacks respectively.
- Style: dark, clean, gothic, and elegant, with smooth, subtle animations.
- Use the same colors and fonts on every page. Keep all text at a minimum 4.5:1 contrast ratio against its background.
- Disable all animation under `prefers-reduced-motion`.
- Every interactive effect must also work with the keyboard.
- Use no libraries; use vanilla JavaScript only.
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
