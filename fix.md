## List of fixes and enhancements (open)

31. Center align the header and title.
32. Change the color of the header contents to white.
33. Project tiles: project name on top, then the icon, then the tag.
34. Reduce the font weight of the project names on the tiles.
35. Things Needed page: make the Let's Build button primary and the play button secondary.
36. Things Needed page: center align the header and make sure the header is there. Breadcrumbs should be small, right below the header like a nav bar.
37. Center align the header on the project page and Things Needed page too. Breadcrumbs should be like a nav bar right below the header.
38. Reduce the font size of the project titles on the projects page.
39. Footer should be center aligned.
40. On hover over project tiles, give a faint glow on the background.

### Completed 2026-11-16 (developer pass 6)

41. Header: Sparky now sits next to the title (home and every pushed page), not on the left side.
42. Breadcrumb bar removed. Replaced by a back arrow at the start of the header (still named "Back to ...").
43. Clean, simple header: one bar (back arrow, Sparky + centered title, mute at the end). Design A, approved by the user.
44. Designs shown first (three options); the user chose A, One Bar, before coding.

### Completed 2026-11-16 (developer pass 7)

45. Project step page: Sparky no longer shows in the header (he is on the page). He still shows on Meet the Pieces. Things you need (the page with Let's Build) also hides him as of 2026-11-16.
46. No underlines on buttons (removed hover/active underline from the Button variants; links and buttons have no text-decoration).
47. Removed the 1100px width cap and auto side margins on the page content so it runs edge to edge. The header and footer were already full width when measured, so if you still see an inset, send a screenshot.
48. Tags are now Easy, Medium, Difficult (from each project's own level 1-3). Tiles are ordered easiest first, then by number of pieces.
49. Project tile border 2px to 1px, shadow 2px to 1px.

### Completed 2026-11-16 (developer pass 8)

50. ~~Meet the Pieces: add the images for the snap wires.~~ Done. The wires (2, 3, 4, 5-Snap Wire) never showed their pictures because the lookup used the display id ("2") instead of the piece key ("W2"). Fixed.
51. ~~Meet the Pieces: re-update the card styles.~~ Done. Plain white cards with a thin border (no colour bar), a picture tile at the start, then the name and id, then the text.

### Completed 2026-11-16 (developer pass 9)

52. ~~Primary button: same colour as the header, rounded pill.~~ Done. Fur orange (#e67e22), white text, no border; all buttons are pills.

53. ~~Wide screens: centre the board.~~ Done. Board centred at up to 720px with Sparky and his bubble below it, as on phones.
54. ~~Project page: the action bar (Back / Play / Next) sits at the very bottom of the screen with no gap below it.~~ Done. The page now fills the screen height.
55. ~~On each step, show a picture of the piece(s) it adds (battery, switch, wires...) right below Sparky's speech bubble.~~ Done.
