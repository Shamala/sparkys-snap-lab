## Archived fixes and enhancements

### Completed 2026-11-12 (commit a924332)

1. Reduce the border sizing on the projects display page. Reduce the shadow also.
2. Remove the numbering on the project.
3. Add small tags instead of number (Starter / Explorer / Builder / Inventor, by piece count excluding wires).
4. Remove the green dots on each of the projects.
5. Fix the button sizing: Meet the Pieces and Safety Rules are the same size.
6. Add Sparky's Snap Lab header with the SVG of the dog.
7. Make the header color similar to Sparky's color.
8. Stick the footer at the bottom of the screen.
9. Piece tiles on a project use the same slim border and shadow as the project tiles.
10. Move the knowledge of the pieces to the Things You Need section.
11. Show the piece knowledge only on tapping a piece in Things You Need, with Sparky describing it.
12. Improve the padding on Things You Need and place it right below the project title.
13. Add actions on clicking Sparky (hop / spin / wiggle, bark, a word).
14. Remove the click action on the battery that displayed the knowledge.

### Completed 2026-11-12 (later)

17. Things You Need tiles show pictures of the real kit pieces (from Snap Designer 15) instead of emoji. Music, alarm and space chips are not in that file and still use emoji.

### Completed 2026-11-12 (developer pass 2)

15. Fix the alignment of the scrolling dots (step progress dots) below the project name.
16. Things You Need page, inside the dialogue (speech bubble) widget that describes the selected piece: add a Play button so Sparky speaks the description (what / why / how), and a Pause button to stop it. If the user moves away (taps another piece, leaves the section or clicks anything else), Sparky must stop talking.
18. Meet the Pieces page: show the images of the pieces (the kit piece pictures) on each piece's card.
19. Safety Rules: style them in red and show a red warning sign.
20. Make sure Sparky can talk through the piece descriptions. The Play button must sit inside the dialogue box that describes the piece (relates to item 16).

### Skipped 2026-11-12

21. Piece images on the build board. Mock-up of the mixed version (real strips plus emoji tiles) looked worse than the current board: wires cover most of each strip, the strips are thin, and tall pieces cannot use their pictures. See design-board-images.md if we revisit.

### Completed 2026-11-12 (developer pass 3, not run or built)

23. Replace the separate What / Why / How lines with one block of text, like a paragraph (Things You Need bubble and Meet the Pieces cards).

24. Header: change the colour of the "Sparky's Snap Lab" title text to a contrasting colour, probably white.

25. Project cards: change from rectangular to square. Align the difficulty tags at the bottom of the card like a footer, instead of right below the project name.

26. Some emojis spill outside the project card (for example the switchboard ones). Fix them, and keep the emoji size similar across cards, if not the same.

27. Add an SVG motion (celebration) when a project is completed, at the last step, to show it is done.

28. Match the button colour to a similar shade as the header colour.

29. Things You Need page: when a piece is selected, change its highlight to a subtler colour.

30. Build page: on the battery, make the plus sign red.

### Completed 2026-11-12 (developer pass 4, not run or built)

31. Extend the celebration (item 27): Sparky hops repeatedly on the project page at the last step, together with the confetti. Respects reduced motion.
