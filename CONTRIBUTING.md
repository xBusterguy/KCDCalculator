# Contributing

Thanks for helping keep the recipes and tools accurate. You do not need to be a programmer to fix a recipe.

## Quickest way: tell me

- Open a **[Wrong or missing recipe](../../issues/new/choose)** issue, or
- Message **Busterguy** on Discord.

## Fixing a recipe yourself

All recipes live in one file: [`assets/recipes.js`](assets/recipes.js). The crafting page and the loadout builder both read it, so you only ever edit it in one place.

Each recipe is one line inside the `DATA` block:

```
Craft|Level|Pieces|Yield|Ingredients|Bench fee
A|7|Open bascinet|1|K2s23H10C19p3|59
```

| Field | Meaning |
| --- | --- |
| Craft | One-letter craft code (table below) |
| Level | 1 to 10 |
| Pieces | The piece name. Pieces with an identical recipe can share a line, separated by `;` |
| Yield | How many one craft makes (10 for arrows, bolts and potions that make several) |
| Ingredients | Material code followed by the amount, run together. `K2s23H10C19p3` is 2 copper ore, 23 steel, 10 hides, 19 coal and 3 padding |
| Bench fee | The "+ N gr." on the wiki, as a whole number (0 if there is none) |

Materials with a single-letter code are written as letter plus amount (`C19`). Materials with a longer id are written in braces (`{sage}2`).

After editing:

1. Change `RECIPES_UPDATED` at the top of the file to today's date.
2. Run `node scripts/check-recipes.js` (needs [Node.js](https://nodejs.org)). It catches typos such as an unknown material, a bad level or a duplicate piece. GitHub runs the same check automatically on every change.

### Craft codes

| Code | Craft |
| --- | --- |
| `S` | Smithing |
| `A` | Armouring |
| `T` | Tailoring |
| `B` | Bowyery |
| `J` | Jewelling |
| `Y` | Alchemy |
| `W` | Brewing |
| `K` | Cooking |
| `P` | Carpentry |

### Raw materials with a one-letter code

| Code | Material |
| --- | --- |
| `O` | Iron ore |
| `C` | Coal |
| `K` | Copper ore |
| `A` | Silver ore |
| `G` | Gold ore |
| `L` | Logs |
| `H` | Hides |
| `N` | Nettles |
| `R` | Pine resin |
| `W` | Owl feathers |
| `F` | Wolf pelts |
| `V` | White wolf pelts |
| `P` | River pearls |
| `U` | Pure silver nuggets |
| `M` | Meteoric iron |
| `D` | Sulphur |
| `E` | Saltpetre |
| `T` | Antlers |
| `X` | Exotic wood |
| `Z` | Tincal |
| `Q` | Dogfish skin |
| `J` | Jasper |
| `u` | Dragon claw |
| `v` | Weapon stub |

### Raw materials with a word id

| Write as | Material |
| --- | --- |
| `{tusks}` | Boar tusks |
| `{yew}` | Ancient yew staves |
| `{rantlers}` | Royal antlers |
| `{rcrystal}` | Rock crystals |
| `{barley}` | Barley |
| `{hops}` | Hops |
| `{grapes}` | Grapes |
| `{honey}` | Honey |
| `{amber}` | Amber |
| `{oak}` | Oak heartwood |
| `{aseeds}` | Ancient seeds |
| `{plums}` | Plums |
| `{mint}` | Mint |
| `{wormwood}` | Wormwood |
| `{chamomile}` | Chamomile |
| `{sage}` | Sage |
| `{thistle}` | Thistle |
| `{dandelion}` | Dandelion |
| `{belladonna}` | Belladonna |
| `{valerian}` | Valerian |
| `{wort}` | St John’s wort |
| `{eyebright}` | Eyebright |
| `{poppy}` | Poppy |
| `{ginger}` | Ginger |
| `{marigold}` | Marigold |
| `{comfrey}` | Comfrey |
| `{cobwebs}` | Cobwebs |
| `{feverfew}` | Feverfew |
| `{elder}` | Elderberry leaves |
| `{mandrake}` | Mandrake root |
| `{amandrake}` | Ancient mandrake |
| `{charcoal}` | Charcoal |
| `{flax}` | Flax |
| `{hay}` | Hay |
| `{apple}` | Apples |
| `{boletus}` | Boletus edulis |
| `{lepiota}` | Lepiota |
| `{pear}` | Pears |
| `{beet}` | Beets |
| `{carrots}` | Carrots |
| `{egg}` | Eggs |
| `{roach}` | Roach |
| `{onions}` | Onions |
| `{cabbage}` | Cabbage |
| `{hare}` | Hare meat |
| `{garlic}` | Garlic |
| `{pork}` | Pork |
| `{milk}` | Milk |
| `{horseradish}` | Horseradish |
| `{chicken}` | Chicken |
| `{mutton}` | Mutton |
| `{venison}` | Venison |
| `{beef}` | Beef |
| `{carp}` | Carp |
| `{eel}` | Eel |
| `{pike}` | Pike |
| `{boar}` | Boar meat |
| `{wmeat}` | Wolf meat |
| `{ptender}` | Pork tenderloin |
| `{btender}` | Beef tenderloin |
| `{bkidney}` | Beef kidneys |
| `{btongue}` | Beef tongue |
| `{pliver}` | Pork liver |
| `{sstomach}` | Sheep stomach |
| `{wheart}` | Wolf heart |

### Intermediate parts (worked out from raw materials unless you enter a price)

| Write as | Part | Makes | Recipe |
| --- | --- | --- | --- |
| `x` | Scrap metal | 3 | 1 iron ore, 1 coal |
| `i` | Iron | 3 | 2 iron ore, 1 coal + 1 gr. |
| `s` | Steel | 2 | 3 iron ore, 2 coal |
| `l` | Leather | 2 | 1 hides |
| `p` | Padding | 2 | 3 nettles, 1 leather |
| `b` | Bowstrings | 3 | 1 hides, 1 pine resin |
| `h` | Hafts | 2 | 2 logs, 1 pine resin |
| `c` | Copper | 1 | 2 copper ore, 1 coal |
| `f` | Frankfurt steel | 2 | 2 steel, 2 coal, 1 logs |
| `t` | Toledo steel | 2 | 2 frankfurt steel, 1 silver ore, 2 coal |
| `z` | Fastening material | 5 | 1 iron, 1 coal |
| `q` | Pig skin | 1 | 1 hides |
| `w` | Cow skin | 1 | 2 hides |
| `d` | Deer skin | 1 | 2 hides, 1 pine resin |
| `y` | Coin sword pommel | 2 | 1 iron |
| `g` | Sword guard (ordinary/straight) | 1 | 1 iron, 1 scrap metal |
| `j` | Horned sword guard | 2 | 1 steel, 1 iron |
| `e` | Reinforced sword guard | 2 | 1 steel, 1 iron |
| `m` | Pear sword pommel | 2 | 1 iron, 1 copper |
| `n` | Eight-sided sword pommel | 2 | 1 iron, 1 copper |
| `a` | Antler shards | 2 | 1 antlers |
| `o` | Decorated sword pommel | 2 | 1 copper, 2 fine silver |
| `k` | Sheet steel | 2 | 2 toledo steel, 3 coal |
| `S` | Fine silver | 2 | 1 silver ore, 1 coal |
| `r` | Rock pitch | 1 | 3 pine resin, 2 coal |
| `B` | Enamel powder | 3 | 1 copper, 1 pine resin, 1 coal |
| `I` | Acidum chloridum | 1 | 2 nettles, 1 belladonna, 1 coal |
| `Y` | Coloured gold | 2 | 1 gold ore, 1 copper, 1 fine silver |
| `{linen}` | Linen | 1 | 2 flax |
| `{malt}` | Barley malt | 3 | 1 barley |
| `{lcoal}` | Leached coal | 1 | 2 charcoal, 1 nettles |
| `{salami}` | Salami | 2 | 1 pork, 1 beef |
| `{cheese}` | Cheese | 1 | 1 milk |

### Adding a new material

- A new raw material goes in the `RAW2` list as `id:"Name"`.
- A new crafted part goes in the `INT` list as `id:["Name", yield, {ingredients}, fee]`.

Then use its id in recipes as described above.

## Other changes

The pages are plain HTML, CSS and JavaScript with no build step. Open `index.html` in a browser to try a change. Keep the `assets` folder next to the pages.

## Automatic wiki check

`scripts/wiki-sync.js` compares `assets/recipes.js` with the wiki and (with `--apply`) edits only the lines that changed. The daily workflow `.github/workflows/wiki-sync.yml` runs it and opens a pull request. You can still edit `assets/recipes.js` by hand at any time; the check will simply report anything that no longer matches the wiki.
