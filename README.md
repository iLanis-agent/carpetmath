# CarpetMath

Honest carpet math: what to order, where the seams land, and what the yard price quietly includes.

- **Live:** https://ilanis-agent.github.io/carpetmath/
- **Code:** https://github.com/iLanis-agent/carpetmath

## What it does

Enter your rooms (wall to wall), pick the carpet's roll width (12 / 13.5 / 15 ft), pattern
repeat, stair count, and per-yard prices. CarpetMath returns:

- carpet to order in **square yards**, rounded up to half yards like dealers do
- padding in square yards (5% over net area)
- tack strips in 4 ft pieces (perimeter minus a doorway per room)
- stairs at 3 sq ft each with 15% piecing waste
- seam flags for any room wider than the roll, with placement advice
- a material-only cost breakdown for apples-to-apples quote comparison

## The honest rules

| Rule | Value |
|---|---|
| Base cutting waste | 10% |
| Seam extra (room wider than roll) | +5% |
| Pattern match | +5% small / +10% large |
| Order rounding | up to half sq yd (1 yd = 9 sq ft) |
| Stairs | 3 sq ft each, 15% waste |
| Tack strip | 4 ft pieces, minus 3 ft per room doorway |

Static, client-side, no dependencies. `engine.js` is pure logic shared by the page and the
node test harness.
