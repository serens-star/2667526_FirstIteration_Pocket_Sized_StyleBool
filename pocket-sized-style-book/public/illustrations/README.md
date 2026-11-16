# Illustrations

Drop your artwork here. Until a file exists the app shows a coloured placeholder, so you can add them one at a time.

- `character.png`: the character shown in the middle of every quiz screen (transparent PNG, portrait, about 600 x 1000 px)
- `character_no_hair.png`: the character with no hair, shown on the hairstyle question before a style is tried
- `character_hair_<CODE>.png`: the whole character wearing each hairstyle (same size and pose as `character.png`). It replaces the character when that hairstyle is tried on. Until a file exists, the bald character shows with a label.
- `character_outfit_<CODE>.png`: the whole character wearing each Saturday outfit (same size and pose as `character.png`). Drawn so far: QL, SW, AL. The others show the plain character with a label until they exist.
- `<slot>/<CODE>.png`: one image per option. `<CODE>` is the aesthetic: `QL`, `SW`, `AL`, `BE`, `Y2K`, `WH`

| Folder (slot) | Question | Shown on | Suggested artwork |
| --- | --- | --- | --- |
| (`character_outfit_<CODE>.png`) | Pick your ideal Saturday fit | whole character swaps | full character wearing that outfit |
| `bag` | Pick a bag | placard | the bag |
| `weekend` | Pick your dream weekend plan | placard | a small scene |
| `shoe` | Choose a shoe | placard | the shoe |
| `texture` | Pick a texture | placard | a fabric swatch |
| `movie` | Pick a movie aesthetic | placard | a film still style illustration |
| `accessory` | Choose an accessory | character | the accessory, sized for the neck or chest area |
| `jacket` | Pick a jacket | placard | the jacket |
| `print` | Choose a print | placard | a pattern swatch |
| (`character_hair_<CODE>.png`) | Pick a hairstyle vibe | whole character swaps | full character with that hairstyle |
| `comfort` | Pick a comfort item | character | the item, sized for the hand area |

The colour palette question needs no files: it draws three circles per option from `src/data/stage.js`.

Option images are drawn with `object-fit: contain`, so any aspect ratio works. Use transparent PNGs for the "character" slots so they sit on the character. Positions for those slots are set in `src/data/stage.js` (`anchor`).
