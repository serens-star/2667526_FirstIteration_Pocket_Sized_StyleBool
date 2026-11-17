# Illustrations

Drop your artwork here. Until a file exists the app shows a placeholder, so you can add them one at a time. File names are case sensitive (`Y2K.png`, not `y2k.png`). Use PNG.

`<CODE>` is the aesthetic: `QL`, `SW`, `AL`, `BE`, `Y2K`, `WH`.

## How the quiz uses the artwork

- **Question 1 (Saturday fit)** picks the outfit (shown on the bald character).
- **Question 2 (hairstyle)** swaps in that hairstyle on the chosen outfit.
- **Questions 3 to 12** show their options on the placard over the character, which keeps the outfit and hairstyle chosen in questions 1 and 2 until the end of the quiz.

## Character pictures (same size and pose as `character.png`, transparent PNG, 327 x 763 or larger in the same ratio)

| File | Used for |
| --- | --- |
| `character.png` | Plain character; used when a picture is missing |
| `character_outfit_<OUTFIT>_hair_NONE.png` | Each Saturday outfit on the bald character (question 1, and question 2 before a hairstyle is tried). All six drawn |
| `character_outfit_<OUTFIT>_hair_<HAIR>.png` | A hairstyle on an outfit, e.g. `character_outfit_SW_hair_QL.png` (Streetwear outfit, Quiet Luxury hair). 6 outfits x 6 hairstyles = 36 files. Drawn: all outfits with SW and AL hair (12) |
| `character_hair_<CODE>.png` | A hairstyle on the plain character. Used if the outfit + hair picture is missing. Drawn: all six |
| `character_outfit_<CODE>.png`, `character_no_hair.png` | Older pictures, only used as a last fallback |

The app looks for the most specific picture first, then falls back, so you can add the remaining outfit + hair pictures (QL, BE, Y2K and WH hair) gradually.

## Placard pictures

Save as `<slot>/<CODE>.png`, drawn at **3:2 landscape, 900 x 600 px** (the placard is always 3:2, so nothing is cropped).

| Folder (slot) | Question |
| --- | --- |
| `bag` | Pick a bag |
| `weekend` | Pick your dream weekend plan |
| `shoe` | Choose a shoe |
| `texture` | Pick a texture |
| `movie` | Pick a movie aesthetic |
| `accessory` | Choose an accessory |
| `jacket` | Pick a jacket |
| `print` | Choose a print |
| `comfort` | Pick a comfort item |

The colour palette question needs no files: it draws three circles per option from `src/data/stage.js`.

Keep each file under about 150 KB. Which question uses which layout is set in `src/data/stage.js`.
