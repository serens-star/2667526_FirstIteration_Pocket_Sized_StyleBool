# Illustrations

Drop your artwork here. Until a file exists the app shows a coloured placeholder, so you can add them one at a time.

- `character.png`: the character shown in the middle of every quiz screen (transparent PNG, portrait, about 600 x 1000 px)
- `<slot>/<CODE>.png`: one image per option. `<CODE>` is the aesthetic: `QL`, `SW`, `AL`, `BE`, `Y2K`, `WH`

| Folder (slot) | Question | Shown on | Suggested artwork |
| --- | --- | --- | --- |
| `outfit` | Pick your ideal Saturday fit | character | full outfit, same pose as the character |
| `bag` | Pick a bag | placard | the bag |
| `weekend` | Pick your dream weekend plan | placard | a small scene |
| `shoe` | Choose a shoe | placard | the shoe |
| `texture` | Pick a texture | placard | a fabric swatch |
| `movie` | Pick a movie aesthetic | placard | a film still style illustration |
| `accessory` | Choose an accessory | character | the accessory, sized for the neck or chest area |
| `jacket` | Pick a jacket | placard | the jacket |
| `print` | Choose a print | placard | a pattern swatch |
| `hair` | Pick a hairstyle vibe | character | the hair, sized for the head area |
| `comfort` | Pick a comfort item | character | the item, sized for the hand area |

The colour palette question needs no files: it draws three circles per option from `src/data/stage.js`.

Option images are drawn with `object-fit: contain`, so any aspect ratio works. Use transparent PNGs for the "character" slots so they sit on the character. Positions for those slots are set in `src/data/stage.js` (`anchor`).
