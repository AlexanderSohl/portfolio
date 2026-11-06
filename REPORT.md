# Portfolio Website Project Report

**Live site:** https://alexandersohl.github.io/portfolio/  
**GitHub repository:** https://github.com/AlexanderSohl/portfolio

## Overview

This is a five-page portfolio for Alexander Sohl, an SDET student at NJIT. It presents his background, skills, project work, and contact details in a responsive Crimson Gothic design. The site uses plain HTML, CSS, and JavaScript.

## Features

- Home hub with an animated typewriter introduction, featured project previews, skill tags, and contact button.
- About and Projects pages with scroll-based chapter stories. Project visuals update with the active step; the rover illustration draws its route as the reader scrolls.
- Three project videos with native controls, plus accessible full-screen project images.
- Skills groups with proficiency badges and a contact form with field-by-field validation and a prepared email link.
- Shared mobile navigation, scroll progress, ember background, and Goob mascot. Reduced-motion preferences are supported.

## Challenges and solutions

Keeping the project visuals readable while they remain pinned was a challenge. The visual position now updates relative to each chapter heading while scrolling, and the About progress line calculates its length from the chapter steps so added sections are included.

The site rules allow one external stylesheet. I moved the Cinzel and Inter font file declarations into `css/style.css` with `@font-face`, keeping the font assets on Google Fonts while leaving each page with one stylesheet link.

## One Codex mistake and correction

The first project-heading fix added a stacking layer so headings appeared above pinned images, but that alone did not keep the images below the headings during upward scrolling. The follow-up adjusted the pinned image position as the chapter heading moved. The commits `f919d81` and `8c1026f` record this correction.

## Screenshots

Phone-sized view (430 × 932):

![Portfolio home page at phone size](report-assets/portfolio-phone.png)

Laptop view (1366 × 900):

![Portfolio home page at laptop size](report-assets/portfolio-laptop.png)

## Accessibility and testing

The live test record is in [TESTING.md](TESTING.md). It includes 21 cases covering navigation, responsive layouts, keyboard use, interactive features, forms, reduced motion, and browser errors. Lighthouse Accessibility scored 100 on each of the five pages in the automated run.

The scores recorded in `TESTING.md` were run with Lighthouse in headless Chrome. Chrome DevTools was not connected to this session, so a manual DevTools run and any DevTools screenshots remain to be done before submission.
