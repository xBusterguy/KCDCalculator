// Categories for the crafting page. Each craft has an ordered list of [label, pattern]:
// a piece goes in the first category whose pattern matches its name (lower case).
// The last entry has no pattern and catches everything else. Edit freely, this file is only used to group pieces.
const CATS={
Smithing:[
 ["Daggers",/dagger|basilard/],
 ["Polearms & staves",/poleaxe|glaive|billhook|voulge|guisarme|bardiche|^staff$/],
 ["Maces & hammers",/mace|morgenstern|hammer|horseman’s pick|raven’s beak|bludgeon|^club$|marotte|flail/],
 ["Axes",/\baxe\b|fokos/],
 ["Swords",/sword|sabre|falchion|shashka|kilij|longsword|defender|opportunity/],
 ["Shields",/shield|pavese/],
 ["Horseshoes",/horseshoes/],
 ["Tools & other",null]],
Armouring:[
 ["Gauntlets",/gauntlets/],
 ["Arm armour",/sleeves|couters|plate arms/],
 ["Leg armour",/legs|chausses|leg armour/],
 ["Horse armour",/chanfron/],
 ["Coifs & collars",/coif|collar|hood/],
 ["Helmets",/bascinet|kettle hat|skullcap|scullcap|helmet/],
 ["Body armour",/cuirass|brigandine|hauberk|chainmail|rusted plate|plate$/],
 ["Materials & other",null]],
Tailoring:[
 ["Horse gear",/caparison|bridle|saddle|breeching|chanfron|noseband/],
 ["Gloves & sleeves",/gloves|mitts|hand wrap|sleeves/],
 ["Footwear",/boots|shoes|spurs/],
 ["Legwear",/hose|trousers|leggings|poleyn|chausses/],
 ["Headwear",/\b(cap|hat|bonnet|headscarf|headband|veil|wreath|strawhat)\b/],
 ["Hoods, coifs & scarves",/hood|coif|chaperon|collar|scarf/],
 ["Dresses",/dress|cotehardie/],
 ["Surcoats & waffenrocks",/waffenrock|surcoat/],
 ["Coats & robes",/coat\b|caftan|robe\b|habit|overcoat/],
 ["Gambesons & padded",/gambeson|aketon|kastenbrust|pourpoint|padded|quilted/],
 ["Tunics, shirts & aprons",/tunic|shirt|apron/],
 ["Belts & costumes",null]],
Bowyery:[
 ["Arrows",/arrow/],
 ["Bolts",/bolt/],
 ["Shot & ammunition",/shot|ball/],
 ["Crossbows",/crossbow/],
 ["Bows",/bow\b/],
 ["Firearms",null]],
Jewelling:[
 ["Rings",/\brings?\b/],
 ["Brooches & necklaces",/brooch|necklace/],
 ["Crosses & medals",/cross|scapular|medallion/],
 ["Headpieces",/headpiece|headband/],
 ["Spectacles & other",null]],
Brewing:[
 ["Beer",/beer/],
 ["Wine & mead",/wine|mead/],
 ["Spirits",null]],
Alchemy:[
 ["Henry’s potions",/^henry’s/],
 ["Weak potions",/^weak/],
 ["Strong potions",/^strong/],
 ["Potions & tonics",/decoction|schnapps|cockerel|hair o’ the dog|embrocation|anti-inflammatory|perfume|nighthawk|bowman’s brew|digestive|aesop|painkiller|quickfinger|fragrant oil|tonic|roch|mandrake/],
 ["Supplies & materials",null]],
Cooking:[
 ["Bread & baking",/bread|pretzel|bagel|roll\b|kolach|pancake/],
 ["Dried",/^dried/],
 ["Smoked",/^smoked/],
 ["Cheese, cream & eggs",/cheese|cream|quark|egg/],
 ["Bacon & sausages",/bacon|salami|sausage|sausauge|cracklings/],
 ["Cooked & roasted",/cooked|boiled|roast|sauerkraut|herring|marikľa/],
 ["Drinks & other",null]],
Carpentry:[
 ["Religious",/icon|altar|saint|madonna|virgin|statue|shrine|devotional|prayer|chalice|censer|(?<!criss-)cross|alms/],
 ["Lighting",/candle|lamp|lantern|chandelier|candelabrum|torch|brazier/],
 ["Workshop & trade",/sign\b|anvil|forge|bellows|wheel\b|stall|counter|armour stand|saddle stand|weapon rack|sword rack|dummy|polearms|pavise|embroidery|drying rack|bolts of cloth|merchant|churn|alchemist|easel|scales|quenching|rolled hides|\btub\b|herbalist/],
 ["Tents & camping",/tent|pavilion|yurt|lean-to|shelter|bedroll|pallet|camp|tripod|roasting (spit|pit)|grill|cooking pot|hanging cauldron|bed of boughs|log carrier/],
 ["Farm & garden",/hay|beehive|skep|hen house|kennel|bush|hop poles|trough|fence|gate|harrow|plough|wheelbarrow|woodpile|\bwell\b|paddock/],
 ["Food & drink",/basket|sack|bowl|crock|cauldron of|goulash|soup|cheese|bacon|sausage|pitcher|jug|watermelon|apples|pears|onions|garlic|herbs?\b|piglet|\bpig\b|tart|cake|honeycomb|mead|pretzel|loaf|flour|egg|hanging deer|suckling|bread|barrel|cask|keg|tankard|\bvat\b|still\b/],
 ["Furniture",/\bbed\b|bed$|table|chair|bench|stool|cradle|chest|crate|shelf|shelves|cupboard|cabinet|bookshelf|hearth|screen|ladder|lectern|cushion|dice|stand|rack|canopy|bath/],
 ["Decoration",null]]
};
// Returns the category of a piece, or "" for pieces of a craft that has no categories (custom recipes).
const catOf=(craft,name)=>{const L=CATS[craft];if(!L)return"";const n=name.toLowerCase();for(const [lab,re] of L)if(!re||re.test(n))return lab;return""};
const catList=craft=>(CATS[craft]||[]).map(x=>x[0]);
