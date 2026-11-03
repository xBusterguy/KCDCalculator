const RAW={O:"Iron ore",C:"Coal",K:"Copper ore",A:"Silver ore",G:"Gold ore",L:"Logs",H:"Hides",N:"Nettles",R:"Pine resin",W:"Owl feathers",F:"Wolf pelts",V:"White wolf pelts",P:"River pearls",U:"Pure silver nuggets",M:"Meteoric iron",D:"Sulphur",E:"Saltpetre",T:"Antlers",X:"Exotic wood",Z:"Tincal",Q:"Dogfish skin",J:"Jasper",u:"Dragon claw",v:"Weapon stub"};
// code:[name, yield, ingredients, coin fee]
const INT={x:["Scrap metal",3,{O:1,C:1},0],i:["Iron",3,{O:2,C:1},1],s:["Steel",2,{O:3,C:2},0],l:["Leather",2,{H:1},0],p:["Padding",2,{N:3,l:1},0],b:["Bowstrings",3,{H:1,R:1},0],h:["Hafts",2,{L:2,R:1},0],c:["Copper",1,{K:2,C:1},0],f:["Frankfurt steel",2,{s:2,C:2,L:1},0],t:["Toledo steel",2,{f:2,A:1,C:2},0],z:["Fastening material",5,{i:1,C:1},0],q:["Pig skin",1,{H:1},0],w:["Cow skin",1,{H:2},0],d:["Deer skin",1,{H:2,R:1},0],y:["Coin sword pommel",2,{i:1},0],g:["Sword guard (ordinary/straight)",1,{i:1,x:1},0],j:["Horned sword guard",2,{s:1,i:1},0],e:["Reinforced sword guard",2,{s:1,i:1},0],m:["Pear sword pommel",2,{i:1,c:1},0],n:["Eight-sided sword pommel",2,{i:1,c:1},0],a:["Antler shards",2,{T:1},0],o:["Decorated sword pommel",2,{c:1,S:2},0],k:["Sheet steel",2,{t:2,C:3},0],S:["Fine silver",2,{A:1,C:1},0],r:["Rock pitch",1,{R:3,C:2},0],B:["Enamel powder",3,{c:1,R:1,C:1},0],I:["Acidum chloridum",1,{N:2,belladonna:1,C:1},0],Y:["Coloured gold",2,{G:1,c:1,S:1},0],linen:["Linen",1,{flax:2},0],malt:["Barley malt",3,{barley:1},0],lcoal:["Leached coal",1,{charcoal:2,N:1},0],salami:["Salami",2,{pork:1,beef:1},0],cheese:["Cheese",1,{milk:1},0]};
const RAW2={tusks:"Boar tusks",yew:"Ancient yew staves",rantlers:"Royal antlers",rcrystal:"Rock crystals",barley:"Barley",hops:"Hops",grapes:"Grapes",honey:"Honey",amber:"Amber",oak:"Oak heartwood",aseeds:"Ancient seeds",plums:"Plums",mint:"Mint",wormwood:"Wormwood",chamomile:"Chamomile",sage:"Sage",thistle:"Thistle",dandelion:"Dandelion",belladonna:"Belladonna",valerian:"Valerian",wort:"St John’s wort",eyebright:"Eyebright",poppy:"Poppy",ginger:"Ginger",marigold:"Marigold",comfrey:"Comfrey",cobwebs:"Cobwebs",feverfew:"Feverfew",elder:"Elderberry leaves",mandrake:"Mandrake root",amandrake:"Ancient mandrake",charcoal:"Charcoal",flax:"Flax",hay:"Hay",apple:"Apples",boletus:"Boletus edulis",lepiota:"Lepiota",pear:"Pears",beet:"Beets",carrots:"Carrots",egg:"Eggs",roach:"Roach",onions:"Onions",cabbage:"Cabbage",hare:"Hare meat",garlic:"Garlic",pork:"Pork",milk:"Milk",horseradish:"Horseradish",chicken:"Chicken",mutton:"Mutton",venison:"Venison",beef:"Beef",carp:"Carp",eel:"Eel",pike:"Pike",boar:"Boar meat",wmeat:"Wolf meat",ptender:"Pork tenderloin",btender:"Beef tenderloin",bkidney:"Beef kidneys",btongue:"Beef tongue",pliver:"Pork liver",sstomach:"Sheep stomach",wheart:"Wolf heart"};Object.assign(RAW,RAW2);
const CR={S:"Smithing",A:"Armouring",T:"Tailoring",B:"Bowyery",J:"Jewelling",Y:"Alchemy",W:"Brewing",K:"Cooking",P:"Carpentry"};
// Craft|Level|Pieces (same recipe, ; separated)|Yield|Ingredients (code+qty)|Coin fee
const DATA=`S|1|Training bludgeon;Farmer Matthew’s pitchfork;Training axe;Training longsword (plain);Staff;Training sword;Torch;Club;Old dagger|1|C1|1
S|1|Painted pavese|1|L1|1
S|1|Training longsword (reinforced)|1|C2|1
S|1|Farmer’s horseshoes|1|x1|1
S|1|Work axe;Knight’s horseshoes|1|x2|1
S|1|Homemade hunting sword|1|x2z1|1
S|1|Hunting sword|1|s2x1z1|2
S|1|Hunting sword (recipe 2)|1|x1s1C3|3
S|1|Burgher’s hunting sword|1|O2C4|3
S|1|Carpenter’s axe|1|x1i1C4L1|3
S|1|Blacksmith’s defender|1|g1q1y1s2x2|1
S|1|Military sword|1|g1q1y1s1i1|6
S|1|Tournament practice sword|1|O3C5L1|16
S|2|Dagger|1|O1C1|0
S|2|Brunswick’s dagger|1|C1|1
S|2|Spiked horseshoes|1|x1C1|1
S|2|Nobleman’s horseshoes|1|i1|2
S|2|Pitchfork|1|C2|1
S|2|Lovarian horseshoes|1|i2|2
S|2|Rondel dagger|1|O2C6|3
S|2|Spiked bludgeon|1|O3C5|4
S|2|Knight’s longsword|1|q1y1g1s3x2|1
S|2|Cuman shashka|1|i1f2z1c1|1
S|2|Competition sword|1|s2x1z1C5L1|6
S|2|Jimbo’s marotte|1|O4C5L1|4
S|2|Bearded axe|1|x1s1C9L2|8
S|2|Falchion|1|i1f3y1|5
S|2|Light mace|1|O5C6L1|15
S|2|Morgenstern|1|O6C7L1|26
S|3|Heater shield|1|L3|1
S|3|Billhook|1|O3C5|4
S|3|Glaive|1|O4C5L1|4
S|3|Common war hammer|1|O8C10L2|30
S|3|Brunswick’s poleaxe|1|z1i3f1C5L1|6
S|3|Common sabre|1|z1x1f2C12L2|10
S|3|Zizka’s mace|1|O7C10L1|22
S|3|Dagger mace|1|O7C10L1|26
S|3|Raborsch butcher’s axe|1|O8C10L1|22
S|3|Broad axe|1|i2s1z1C13L2|36
S|3|Common mace;Bailiff’s mace|1|O8C9L2|36
S|3|Godwin’s longsword|1|O8C10L1|50
S|3|Horseman’s pick|1|i2f1z1C12L3|107
S|4|Racing horseshoes|1|i2f1C1|4
S|4|Shell hunting sword|1|t2z1a2i1|1
S|4|Rider’s war hammer|1|s5C9L2H1|12
S|4|Opportunity|1|K1s5C9L2H1|14
S|4|Buchar mace|1|K1s4C9L2H1|12
S|4|Cuman fokos|1|z1i1f1K1s3C11H1L3|15
S|4|Common longsword|1|i2y1g1q1s5K1C10L2|17
S|4|Boleslav Bavor’s sword|1|K1s7C11L3H1|18
S|4|Flanged mace|1|K1s7C12L3H1|18
S|5|Cuman shield|1|L4H1l1|3
S|5|Skalitz knight’s shield|1|L3H1s1l1|4
S|5|Bardiche;Voulge|1|s3C9L1h1|8
S|5|Heavy mace|1|K1s5C13L3H1h1|19
S|5|Knight’s war hammer|1|K1s6C13L3H1h1|20
S|5|War hammer|1|K1s6C13L4H1h1|21
S|5|Broadsword|1|g1c1w1y1f1i1K1s4C12H1L3l1|38
S|5|Boleslav Bavor’s reforged sword|1|t1i1K1s4C15H1L3l1|34
S|5|Lord Capon’s longsword;Henry’s longsword;Radzig Kobyla’s longsword (Istvan)|1|K1s8C12L4H1l1|50
S|5|Battle longsword|1|w1n1j1f3i3K2s3C10H1L2l1|56
S|6|Knight shield;Practice shield|1|L4H1s1l1|4
S|6|Ghostly horseshoes|1|i2t1K1s1C8L1|12
S|6|Emmeram’s hunting sword|1|K1s4C9L3H1l2|15
S|6|Executioner’s axe|1|i2t1K2s6C16H2L6h2|108
S|6|Captain’s mace|1|K1s9C15L5H2h2|26
S|6|Replica of the longsword “Absolver”|1|d1n1j1f2i2K2s5C15H1L5l2|50
S|6|Dry Devil’s longsword|1|K2s11C17L6H1l2|57
S|6|Raven’s beak|1|K2s10C16L6H1h2|54
S|7|Guisarme|1|s4C11L2H1h2|13
S|7|Noble’s sword|1|d1o1j1t1i1K2s8C24H3L9l3|125
S|7|Knight’s axe|1|i2t2c1z1K1s7C29H3L8h3|46
S|7|Ataman’s sabre|1|i1t2d1c2z1K2s8C24H2L7l3|84
S|7|Lord von Bergow’s sword|1|K2s16C22L8H3l3|142
S|7|Broad longsword|1|w1m1g1f3i2K2s8C22H3L8l3|219
S|7|Lavish warhammer|1|K1s15C26L8H2h3|58
S|7|Knight’s sword|1|y1e1f2x2w1K2s8C24H2L8l3|153
S|7|Ornate mace|1|K1s14C26L8H3h3|40
S|8|Trollbane hammer|1|A1s30H4R7h6U1|64
S|8|Owl’s Claw sabre|1|A1s31H4l9R7U1|64
S|8|Sword of Sir Valentine|1|c1g1w1y1f1x1A1s33l13C27U1|160
S|8|Duelling longsword|1|d1j1m1t3i2A1s33l13C24U1|309
S|9|Four Evangelists’ longsword|1|A3G1s65H9l19R16U2|490
S|9|Master Menhart’s longsword|1|A2G1s65H9l19R16U2|424
S|9|Madman’s longsword|1|z1f3A2G1s50l20C36U2|485
S|10|Adorned axe (replica)|1|z1s39C32h11U2M1|75
S|10|Poleaxe|1|A1G1s38H5R9h8U2M1|80
S|10|Basilisk warhammer|1|A3G1s71H10R17h15U2M1|554
A|1|Iron (Armouring)|3|O2C1|1
A|1|Leaf-shaped couters;Couters|1|C2|4
A|2|Couters with rondel|1|C3|8
A|2|Mail coif (light);Mail coif (Zizka)|1|O2C3|2
A|2|Mail collar (plain)|1|O2C4|2
A|2|Bandit’s brigandine;Bandit’s brigandine - dark|1|O7C6H1|19
A|2|Nuremberg bascinet (light)|1|O6C7H1|31
A|2|Noble’s bascinet (open-faced)|1|O6C6H1|119
A|3|Hounskull bascinet (open-faced);Nuremberg bascinet (open-faced)|1|O3C5|4
A|3|Capon’s bascinet (light)|1|O3C7|4
A|3|Italian hauberk|1|O4C5H1|6
A|3|Rusted plate;Rusted plate - dark|1|O7C10H1|24
A|3|Mended cuirass|1|O8C10H1|32
A|3|Mended cuirass - dark|1|O9C8H2|31
A|4|Brunswick’s chainmail coif|1|s4C5|4
A|4|Saxon bascinet (open-faced)|1|s3H1C5|7
A|4|Grimey skullcap;Scaled skullcap;Steel skullcap|1|s5H2C6|11
A|4|Saxon hauberk|1|s3H1C7|8
A|4|Chainmail gauntlets|1|K1s5H2C6|13
A|4|Kettle hat|1|s5H2C7|12
A|4|Kettle hat - dark (plain)|1|s5H2C6|12
A|4|Cuman bascinet|1|s5H2C8|12
A|4|Hauberk long (light)|1|K1s5H2C7|14
A|4|Plain laminar sleeves|1|K1s6H2C7|16
A|4|Simple brigandine|1|K1s8H3C8|20
A|4|Brunswick’s brigandine|1|K1s9H3C9|21
A|4|Half plate legs|1|K1s9H3C10|66
A|4|Milanese brigandine - dark;Teutonic brigandine|1|K2s10H4C7|119
A|5|Mail coif (heavy)|1|s6C6p1|10
A|5|Milanese chanfron|1|K1s4H1C3p1|14
A|5|Mail collar (reinforced)|1|s5H2C4p1|12
A|5|Tournament kettle hat;Composite kettle hat;Killer’s helmet;Murderer’s painted helmet|1|K1s5H2C8p1|18
A|5|Constantinople bascinet|1|K1s8H3C7p1|22
A|5|Bell-shaped bascinet|1|K1s7H3C5p1|20
A|5|Noble’s gauntlets;Brunswick’s gauntlets|1|K1s10H4C10p1|28
A|5|Old brigandine legs|1|K2s12H5C9p1|92
A|5|Smooth cuirass - blackened|1|K2s12H5C9p1|33
A|5|Milanese brigandine|1|K2s12H5C9p1|53
A|6|Saxon kettle hat|1|K2s13H6C10p2|33
A|6|Rondel scullcap|1|K1s12H5C11p2|29
A|6|Open bascinet (style 2)|1|K2s13H5C9p2|31
A|6|Brunswick’s plate leg armour|1|K5s15H6C11p2|291
A|7|Tournament gauntlets;Plate knight sleeves;Brunswick’s plate sleeves;Hourglass gauntlets;Nuremberg gauntlets (light);Brigandine gauntlets|1|K3A1s22H10C17p3|171
A|7|Short chainmail|1|K1s7H3C8p3|25
A|7|Kyiv helmet|1|K2s20H9C16p3|52
A|7|Open bascinet|1|K2s23H10C19p3|59
A|7|Brunswick’s bascinet|1|K2s21H10C16p3|55
A|7|Bell-shaped kettle hat;Beaked kettle hat - dark|1|K2s23H10C17p3|95
A|7|Kettle hat - dark (reinforced)|1|K2s23H10C18p3|58
A|7|Spined kettle hat|1|K2s23H10C19p3|59
A|7|Crested Cuman helmet;Smooth cuirass|1|K2s24H10C17p3|80
A|7|Bascinet with aventail (heavy);Tall kettle hat|1|K2s23H10C17p3|98
A|7|Magdeburg plate arms|1|K3A1s22H10C17p3|175
A|7|Laminar sleeves with rondels|1|K2s23H10C17p3|174
A|7|Noble brigandine legs|1|K4A1s22H9C16p3|453
A|7|Bavarian plate legs;Capon’ plate chausses|1|K4A1s22H10C16p3|427
A|7|Riding cuirass - blackened|1|K2s23H10C17p3|179
A|7|Saxon plate legs|1|K4A1s22H10C16p3|461
A|7|Saxon brigandine|1|K5A1s21H9C16p3|562
A|7|Robber baron’s brigandine|1|K4A1s22H10C16p3|379
A|8|Tyrolian chanfron|1|A1s22p12H6U1|50
A|8|Karachin’s chanfron|1|A1s22p12H6U1|52
A|8|Mail collar with badge;Hauberk long (heavy)|1|s14p11H3U1|30
A|8|Bascinet with aventail|1|A1s43p23H12U1|134
A|8|Beaked kettle hat|1|A1s39p21H11U1|87
A|8|Milanese gauntlets|1|A1s43p23H13U1|328
A|8|Saxon kettle hat (style 2)|1|A1s41p22H12U1|90
A|8|Kuttenberg plate sleeves|1|A1s43p23H12U1|282
A|8|Hounskull bascinet (visored)|1|A1s43p23H12U1|94
A|8|Saxon bascinet (visored)|1|A1s43p23H12U1|101
A|8|Bascinet with bretèche|1|A1s43p23H13U1|149
A|8|Brigandine gauntlets (style 2);Brigandine gauntlets (Zizka);Magdeburg plate arms (style 2);Magdeburg plate arms (Bergov);Silesian brigandine sleeves|1|A2s42p23H12U1|334
A|8|Noble brigandine legs (style 2)|1|A2s42p23H12U1|602
A|8|Riding cuirass|1|A1s43p23H13U1|218
A|8|Noble cuirass|1|A3s42p23H12U1|918
A|8|Milanese plate leg armour|1|A2s42p23H12U1|662
A|9|Dragon chanfron|1|A1s45p24H13U2|99
A|9|Italian bascinet (heavy);Nuremberg bascinet (visored)|1|A2G1s60p32H17U2|148
A|9|Capon’s bascinet (heavy);Noble’s bascinet (visored);Saxon bascinet (heavy);Cuman helmet with a mask|1|A2G1s60p32H17U2|314
A|9|Kuttenberg layered cuirass|1|A4G2s58p31H17U2|796
A|9|Noble laminar sleeves|1|A3G1s59p32H17U2|508
A|9|Magdeburg cuirass|1|A5G2s54p34H18U2|1342
A|9|Laminar knight legs|1|A4G2s58p32H17U2|1068
A|9|Cuirass with falds|1|A5G2s52p35H18U2|1377
A|10|Mail hood with a coat of arms|1|A1G1s40p22H12U2M1|92
A|10|Nuremberg gauntlets (heavy);Nuremberg plate sleeves|1|A3G2s60p34H18U2M1|1150
A|10|Brigandine with plate;Miser’s cuirass|1|A5G3s45p45H19U2M1|1836
A|10|Kuttenberg plate legs;Noble’s plate legs;Noble’s plate legs - dark|1|A7G4s42p42H23U2M1|2521
A|10|Kuttenberg bascinet|1|A3G2s61p33H18U2M1|964
A|10|Noble’s bascinet (heavy)|1|A5G3s45p45H19U2M1|1813
A|10|Milanese cuirass|1|A7G3s42p42H23U2M1|2520
T|1|Hand wrap;Felt cap;Headscarf;Old straw hat;Beggar tunic;Beggar’s hood;Drowner’s hood;Wreath;Bonnet;Women’s straw hat;Short tunic;Frilled veil;Colourful headscarf;Work headscarf;Beggar’s shirt;Vagrant’s boots;Coif;Loose hose;Servant’s hood;Leather apron;Butcher’s apron;Worn tunic;Wanderer’s tunic;Baggy cap|1|N1|1
T|1|Hunter’s belt|1|l1|1
T|1|Crude padded coif;Padded collar (plain)|1|N2|1
T|1|Poleyn;Cleric habit;Lord’s overcoat;Quilted vagrant’s cap;Long gambeson (light)|1|N3|1
T|1|Legate’s robe;Cleric habit (Rabi)|1|N5|1
T|1|Padded coif (plain)|1|N6|2
T|1|Knight’s belt;Soft leather bridle;Noseband bridle|1|l4|2
T|1|Cleric habit (style 4)|1|N7|2
T|1|Fastened caftan;Padded coif - black (plain);Riding gloves (light);Henry’s blacksmith gloves|1|N7l1|2
T|1|Bridle with plating|1|l5|3
T|1|Embroidered hood (heavy)|1|N9l1|5
T|1|Cleric habit (style 5);Cleric habit (style 6);Cuman caftan|1|N9l1|6
T|1|Thief’s gloves|1|N8l1|14
T|1|Noble gloves (reinforced)|1|N8l1|18
T|1|Unicorn chanfron|1|N8l1|72
T|2|Cuman leather hat;Work scarf;Wanderer’s hat;Vagrant’s hat;Tall Cuman cap;Fur-lined hat;Felt hat;Short tunic (reinforced);Simple headband;High boots;Women’s hood;Drowned man’s gloves;Drowner’s hose;Water goblin’s hose;Wide straw hat;Narrow straw hat;Straw hat with ribbon;Tunic;Innkeeper tunic;Jester shoes;Beggar’s coat;Work dress;Simple hose;Beggar’s hose|1|N2|1
T|2|Surcoat;Miner’s tunic;Leather apron (style 2)|1|N3|1
T|2|Padded collar (reinforced)|1|N4|1
T|2|Vagrant’s quilted hose|1|N5|2
T|2|Vagrant’s gambeson|1|N6|2
T|2|Mitts|1|N7|2
T|2|Mainz breeching;Prague saddle|1|l5|4
T|2|Wielun breeching|1|l6|4
T|2|Executioner’s caparison simple|1|N11l1|3
T|2|Lavish caftan|1|N12l2|26
T|2|Riding caftan|1|N13l1|30
T|2|Quilted caftan - black|1|N12l2|66
T|3|Short butcher apron;Innkeeper’s shirt;Pickpocket’s tunic;Working boots;Work boots;Firm boots;Loose hose (Musa);Short tunic (style 3);Round cap;Pointy cap;Miner’s cap;Silesian cap;Miner’s hat;Burgher coat (Bergov/Hans/Hanush/Musa/Oderin/Ruthard/Sigismund/Vavak)|1|N3|1
T|3|Pickpocket’s hose;Simple hood;Miner’s hood;Vagrant’s hat (style 2);Travel dress;Noblewoman’s cotehardie;Jewish veil;Chaperon;Embroidered shirt|1|N4|1
T|3|Frilled dress;Festive dress;Women’s straw hat (style 2);Work dress (style 3);Women’s hood (heavy);Common ladies shoes|1|N5|1
T|3|Simple bonnet;Travel boots|1|N5|2
T|3|Riding boots|1|N6|2
T|3|Passionate mushroom-picker’s hood|1|N4l1|2
T|3|Leather gloves|1|N6l1|2
T|3|Hunting coat|1|N7l1|2
T|3|Riding gloves (plain);Padded coif - black (reinforced)|1|N7l3|4
T|3|Noble’s belt|1|l7|4
T|3|Caparison á la peytral simple|1|N7l4|5
T|3|Padded coif (reinforced)|1|N8l2|3
T|3|Executioner’s caparison quilted|1|N8l5|4
T|3|Caparison á la crupper simple|1|N9l5|5
T|3|Fitted coat|1|N11l4|6
T|3|Kastenbrust (light)|1|N14l5|36
T|3|Quilted caftan|1|N13l6|54
T|3|Riding gloves (heavy)|1|N13l6|76
T|4|Bohemian cap;Jewish hat|1|N5|2
T|4|Strange strawhat;Master huntsman’s hose;Miner hose;Colorful festive dress|1|N6|2
T|4|Ladies shoes;Gartered hose;Burgher’s hat;Charlie’s hat;Chamberlain Ulrich’s hat;Vagrant’s hose;Embroidered bonnet;Master huntsman’s hat|1|N4l1|2
T|4|Monk’s hood;Cuman boots;Embroidered chaperon;Noblewoman’s cotehardie (style 2);Frilled cap;Burgundian hat;Simple shoes;Ordinary coat;Worn gambeson;Old quilted hose|1|N5l1|2
T|4|Riding boots - high|1|N6l1|2
T|4|Mended padded leggings|1|N7l1|2
T|4|Halved caparison crenellated|1|N11l6|6
T|4|Hague breeching|1|l10O1|7
T|4|Plain tourney caparison|1|N12l7|7
T|4|Sharukan bridle|1|l11O1|7
T|4|Long gambeson - black|1|N11l4|5
T|5|Wanderer’s robe;Burgher’s hat (style 2);Frilled colourful dress;Katherine’s dress;Rosa’s dress|1|N8l1|2
T|5|Lord Toth’s chaperon;Legate’s hat|1|N1l1S1|0
T|5|Wanderer’s hood;Cleric’s hood;Pickpocket’s shoes|1|N9l1|2
T|5|Quiet boots|1|N9l1|3
T|5|Hunting cap;Simple veil;Frilled veil (style 2)|1|N7l2|3
T|5|St. Hubert’s hat;Hose joined;Plain troubadours’ hose;Teutonic surcoat|1|N8l2|3
T|5|Coat of arms surcoat;Chamberlain Ulrich’s hat (light);Noble chaperon|1|N1l1S1|1
T|5|Rowel spurs|1|N3l2s1|3
T|5|Tournament gambeson;Long gambeson (heavy)|1|N12l4|6
T|5|Short gambeson|1|N13l5|6
T|5|Noble’s quilted hose (style 2)|1|N1l2S1|4
T|5|Caparison á la crupper decorated|1|K1N16l5s1|10
T|5|Zamur’s bridle|1|K1O2l8H1s1|10
T|5|Bridle of the Holy Roman Empire|1|K1O2l8H1s1|11
T|6|Broad battle coif;Tournament padded coif|1|l2|2
T|6|Broad battle coif - black|1|l3|2
T|6|Pickpocket’s hat;Pickpocket’s gloves;Hemmed hood;Simple shoes (style 2);Riding waffenrock (style 1)|1|p2l5|4
T|6|Knights of the Cross hood;Cap with peacock feathers|1|p2l1S1|4
T|6|Courtiers boots;Gallant coat|1|p2l2S1|4
T|6|Simple waffenrock;Teutonic hood;Monk’s hood (style 2)|1|p2l5|5
T|6|Jester’s disguise;Jimbo’s costume|1|p2l6|4
T|6|Tournament waffenrock;Pointy cap (style 2);Monk’s hood (style 3);Riding waffenrock (styles 2-7);Burgher’s shoes;Vagrant’s shoes;Thief’s shoes;Vagrant’s coat;Merchant’s coat;Ordinary coat (style 2)|1|p2l6|5
T|6|Burgher coat (Oderin Armor)|1|p3l5|5
T|6|Noble boots|1|p3l1S1|5
T|6|Executioner’s caparison decorated|1|K1p7l6F1s1|14
T|6|Quilted caparison with breeching|1|K1p8l6F1s1|15
T|6|Halved caparison decorated|1|K1p9l6F1s1|16
T|6|Soldier’s saddle|1|K1l10H2p2L3O2s1|16
T|6|Old gambeson;Long pourpoint;Capon’s gambeson;Robber baron’s aketon|1|p5l10|10
T|6|Tournament bridle|1|K1l16H2O4s1|18
T|7|Soft shoes;Ladies shoes (style 2);Master huntsman’s gloves|1|p4l7|7
T|7|Soft boots|1|p4l7|8
T|7|Courtier’s hat|1|p4l4S1|7
T|7|Embroidered coat|1|p4l5S1|7
T|7|Ordinary coat with crest;Ordinary Praguers’ coat with crest;Courtier’s boots;Embroidered hood|1|p4l5S1|8
T|7|Thief’s tunic;Gartered hose (Capon/Devil/Sigismund)|1|p4l9|8
T|7|Pointed shoes;Master huntsman’s hood;Burgher’s shoes (light)|1|p4l9|9
T|7|Hemmed waffenrock;Crusaders of the Red Star waffenrock;Burgher pourpoint|1|p5l9|8
T|7|Pointed shoes (plain);Plague hood;Tied jester’s hose;Quilted coat;Gartered hose (plain);Teutonic lay brother’s waffenrock|1|p5l9|9
T|7|Master huntsman’s boots|1|p5l9|10
T|7|Noble quilted trousers;Noble’s quilted hose (plain)|1|p3l4S1|6
T|7|Short aketon (styles 1-6)|1|p9l12F1|16
T|7|Caparison decorated|1|K1p10l11F2W1s2|25
T|7|Tournament caparison decorated;Executioner’s caparison with breeching|1|K1p11l12F2W1s2|27
T|7|Tournament caparison quilted|1|K1p15l13F2W1s2|30
T|7|Burgher coat (Zachary)|1|K2p26l21F3W2|140
T|7|Long gambeson (style 4);Long pourpoint - black|1|p8l12F1|15
T|8|House of Polner waffenrock|1|p6l5F1S1P1|11
T|8|Praguers’ hemmed waffenrock|1|p6l9F1P1|12
T|8|Thief’s hood;Thief’s cap|1|p7l9F1P1|12
T|8|Pickpocket’s hood|1|p7l9F1P1|13
T|8|Nobleman’s hat|1|p7l5F1S1P1|12
T|8|Embroidered heater coat|1|p7l5F1S1P1|13
T|8|Thief’s hose;Quilted hose - dark|1|p7l10F1P1|13
T|8|Noble gloves;Courtier’s hood|1|p7l7F1S1P1|13
T|8|Hungarian spurs|1|p8l8F1s1P1|14
T|8|Knight’s waffenrock;Abbot’s hood;Legate’s hood;Courtier’s hose;Courtier’s pourpoint;Chaperon with brooch|1|p8l7F1S1P1|14
T|8|Crusaders of the Red Star waffenrock (style 2);Capon’s hood;Black hood;Rabbi’s hood;Semine’s hood;Sigismund’s hood;Burgher’s hood|1|p8l11F1P1|14
T|8|Nimrod’s coat|1|p8l12F1P1|15
T|8|Waffenrock of the Lords of Garbow|1|p8l8F1S1P1|15
T|8|Long pourpoint (style 2);Erik’s pourpoint|1|p12l15F1W1P1|22
T|8|Norman saddle|1|l26p12F1H3O6s3P1|37
T|8|Moglen saddle|1|A1l24p14F2H4O8s4P1|50
T|9|Praguers’ riding waffenrock;Waffenrock of Henry’s Forge|1|p11l9F2W1P1V1|19
T|9|Teutonic waffenrock|1|p11l11F2W1P1V1|20
T|9|Burgher coat (Injured Aulitz);Burgher coat (Jobst)|1|p12l12F2W1P1V1|22
T|9|Noblewoman’s cotehardie (style 3)|1|p9l9F3W1S1P1V1|23
T|9|Fastened waffenrock|1|p14l10F3W1P1V1|24
T|9|Thief’s shoes (light)|1|p14l11F3W1P1V1|24
T|9|Ornate waffenrock|1|p10l10F3W1S1P1V1|24
T|9|Legate’s tunic|1|p10l11F3W1S1P1V1|25
T|9|Praguers’ waffenrock with buttons|1|p11l12F3W1S1P1V1|26
T|9|Thief’s coat|1|p15l12F3W1P1V1|26
T|9|Burgher coat (heavy)|1|p15l14F3W1P1V1|28
T|9|Halved Teutonic waffenrock|1|p16l15F3W1P1V1|28
T|9|Legate’s hose|1|p14l15F4W1S1P1V1|32
T|9|Short aketon (style 7);Short pourpoint - black|1|p18l15F4W1P1V1|32
T|9|Drowner’s gambeson|1|p22l15F5W2P1V1|39
T|9|Noble gambeson|1|p18l15F5W2S1P1V1|39
T|9|Lovari saddle;Hungarian saddle|1|A1l42p23F3H6O13s5P1V1|77
T|9|Transylvanian knight’s saddle|1|A1l50p26F4H7O14s5P1V1|179
T|9|Reinforced tempered sleeves|1|A3G1p58F13l32W5P1V1|600
T|9|Kastenbrust (heavy)|1|A4G2p57F13l31W5P1V1|885
T|10|Burgher coat;Painter Vojtiech’s cap|1|A5G1p44F11l45W7S4P2V1|1842
T|10|Padded hood|1|p7F1l5S1P2V1|12
T|10|Quilted hose;Padded chausses;Noble’s quilted hose (reinforced)|1|p15F4l16W1S1P2V1|34
T|10|Noble’s hood;Legate’s gloves|1|A1p16F4l11W2S1P2V1|40
T|10|Courtier’s coat|1|A1p17F4l11W2S1P2V1|42
T|10|Legate’s shoes|1|A1p14F5l12W2S2P2V1|44
T|10|Knight’s spurs|1|A1p16F5l12W2s3P2V1|45
T|10|Brocade hood|1|A1p16F5l13W2S2P2V1|48
T|10|Patron’s coat|1|A1p17F5l13W2S2P2V1|49
T|10|Tyrol brocade cotehardie|1|A1p18F6l14W2S2P2V1|51
T|10|Istvan’s chaperon|1|A1p19F6l15W2S2P2V1|54
T|10|Short pourpoint|1|A1p22F6l16W2S2P2V1|58
T|10|Noble’s spurs|1|A1G1p29F8l21W3s5P2V1|77
T|10|Bridon saddle|1|A1G1l55p29F4H7O15s4P2V1|293
T|10|Bravante saddle|1|A2G1l55p29F4H7O15s4P2V1|477
T|10|Dragon saddle;Cracowian saddle|1|A2G1l55p29F4H7O15s4P2V1|586
T|10|Kastenbrust (reinforced)|1|A5G3p43F11l44W7S4P2V1|1872
B|1|Battle bolt;Tournament arrow;Battle arrow|10|L1|1
B|1|Scattershot|10|L4D1E1|4
B|1|Lead ball|10|L4D1E1|16
B|2|Crude arrow;Crude bolt;Common bolt;Ordinary arrow;Long-range arrow|10|L1|1
B|2|Village hazel bow;Village dogwood bow|1|L5b1|3
B|2|Old hunting crossbow|1|L8b2|5
B|2|Village elm bow|1|L9b2R1|6
B|2|Ash village bow|1|L11b3R1|8
B|3|Tournament bolt;Wounding arrow;Hunting bolt|10|L1|1
B|3|Marksman’s bolt;Hunting arrow;Piercing arrow|10|L2|1
B|3|Hunting crossbow|1|L8b2R1|6
B|3|Worn Cuman bow|1|L11b3R1|8
B|3|Hazel longbow;Dogwood hunting bow;Elm hunting bow|1|L14b4R1|10
B|4|Wounding bolt;Piercing bolt|10|L2|1
B|4|Improved long-range arrow|10|L1W1|1
B|4|Improved hunting arrow;Improved wounding arrow|10|L2W1|1
B|4|Old field crossbow|1|L12b2R1|8
B|4|Yew hunting bow;Footpad’s bow|1|K1L16b5H1R1|26
B|4|Ash hunting bow|1|K1L16b4H1R2|36
B|4|Ornate hunting crossbow|1|K1L13b6T1H1R2|67
B|5|Improved hunting bolt;Sharpshooter’s bolt;Improved piercing bolt;Improved wounding bolt|10|L1s1|0
B|5|Improved piercing arrow|10|L1W1s1|0
B|5|Field crossbow|1|K1L7b4H1R1s1|12
B|5|Cuman folded bow|1|K1L17b6H1R2l1|17
B|5|Poacher’s bow|1|K1L17b6H1R2l1|35
B|5|Artemis’ crossbow|1|K1L13b7T1H1R2s1|59
B|6|Battle shot;Fine bolt|10|L1s1|0
B|6|Black arrow|10|L1W1s1|0
S|5|Noble’s hunting sword|1|c1t2i2z1X1l1|0
S|5|Calvaria axe|1|Y2Z1Q2X1t1k1K1h1|0
S|6|Basilard|1|z1c1X1t1i1K2s5C19H2L5l2|38
S|7|Lion’s roar Kilij|1|Y2B1J2I1X1Q2t2K1l1|0
S|10|Dragon fang Axe|1|t2d1z2i2X2u1s36C26h11U2M1|93
S|10|St. George’s sword|1|Y2r1B2X1g1o1t2A1s26l11C19U2M1|92
S|10|Longsword of the Four Evangelists|1|v1f2i2I1B1s55l23C41U2M1|636
S|10|Lingua belli longsword|1|I1Z2Y1j1n1t2k1A3G1s54l22C39U2M1|881
B|6|Ornate Cuman bow|1|K1L18b6H1R3l2|18
B|6|Miners’ crossbow|1|K1L16b9T1H1R3s2|40
B|7|Decorated field crossbow|1|K2L21b13T1H3R5s3|153
B|8|Cuman chief’s bow|1|A1s16b25L24{tusks}2T1{yew}1|66
B|8|Heavy crossbow|1|A1s19b29L26{tusks}2T2{yew}1|254
B|9|Reinforced heavy crossbow|1|A2G1s27b40L35{tusks}4T2{yew}2|283
B|9|Elm longbow;Ash longbow|1|A1G1s24b36L32{tusks}4T2{yew}2|98
B|10|Pistole;Hook gun;Master’s handgonne|1|A2G1s28b42L38{tusks}3T2{yew}2{rantlers}1|630
B|10|Marksman’s hook gun;Pushko’s Push’em|1|A2G1s28b43L37{tusks}4T2{yew}2{rantlers}1|688
J|1|Parler’s spectacles;Cheap ring;Brass brooch with lettering;Silver brooch|1|K1|1
J|2|Decorated headpiece;Barnabas’ Ring;Decorated headpiece (style 2);Decorated headpiece (style 3);Tin cross|1|K1|1
J|2|Lord Semine’s necklace;Ordinary ring|1|K1|2
J|3|Narrow headband;Narrow headband (style 2);Oats’ ring (Samuel);Virgin Mary medallion|1|K2C1|2
J|3|Old ring;Engraved silver ring|1|K3C1|3
J|3|Silver brooch enamelled|1|K3C2|4
J|3|Engraved gemstone ring|1|K4C3|5
J|3|Spectacles|1|K4C3|6
J|4|Gemstone silver ring|1|S1C1|6
J|5|Scapular with saint;Voivode’s necklace|1|S2C1s1|1
J|5|Women’s brooche|1|S2C1s1|4
J|6|Scapular with aperture|1|S3C1s1|7
J|6|Noble gloves (Rings)|1|S1H2C5s1|9
J|6|Silver cross with garnet|1|S3C1s1|11
J|7|Silver cross with insignia|1|S4C2s1|13
J|8|Gemstone ring|1|S5s1C6{rcrystal}1|16
J|8|Scapular with insignia|1|S6s2C8{rcrystal}1|22
J|8|Golden heraldic brooch|1|G6S3s9{rcrystal}1|42
J|9|Pavlena’s necklace|1|{rantlers}1S6s2C7|20
J|9|Golden initial brooch;Golden cross with garnets|1|G8S4s9{rcrystal}1P1|52
J|9|Golden cross with pearls|1|P1G5S3s3|52
J|10|Golden cross ring;Solid gold ring|1|G10S5s9{rcrystal}2P1|62
W|1|Beer|6|{malt}1{hops}1|0
W|1|Cheap wine|4|{grapes}2|0
W|2|Troskowitz beer|6|{malt}2{hops}1|1
W|3|Wine|3|{grapes}2|1
W|3|Jitschine beer|3|{malt}2{hops}2|1
W|4|Mead|3|{honey}1{hops}1|1
W|5|Aujezd beer|3|{malt}3{hops}2|1
W|5|Fine wine|3|{grapes}3|1
W|6|Wine from Loretz|3|{grapes}3|1
W|7|Turnau beer|3|{malt}4{hops}3|1
W|8|Rose hip wine|3|{grapes}3{honey}1{oak}1|1
W|8|Ancient moonshine|2|{aseeds}1{plums}3L1|1
W|9|Wedding beer|3|{malt}4{hops}3{honey}1{amber}1|1
W|10|Schnapps|2|{plums}3L1{amber}1{oak}1|1
Y|1|Bandage|1|N5|0
Y|1|Bandage (recipe 2)|2|{linen}1N1|0
Y|1|Moonshine|4|{mint}2{wormwood}2|2
Y|1|Weak Chamomile decoction|2|{chamomile}2{sage}1|1
Y|1|Soap|4|{thistle}2{dandelion}1{charcoal}1|6
Y|1|Leached coal|1|{charcoal}2N1|0
Y|1|Weak Saviour Schnapps|2|N1{belladonna}2|1
Y|1|Weak Cockerel|2|{valerian}1{mint}2|6
Y|2|Chamomile decoction|2|{chamomile}2{sage}1|1
Y|2|Saviour Schnapps|2|N1{belladonna}2|1
Y|2|Weak Hair o’ the Dog|2|{hops}1{wort}1{mint}1|4
Y|2|Weak Embrocation|2|{eyebright}1{poppy}1{tusks}1|2
Y|2|Cockerel|2|{valerian}1{mint}2|8
Y|2|Weak Anti-inflammatory potion|3|N2{valerian}2{ginger}1|8
Y|3|Rock Pitch|1|R3C2|0
Y|3|Weak Mintha perfume|2|{dandelion}3{marigold}1{mint}1|4
Y|3|Strong Chamomile decoction|3|{chamomile}2{sage}1|6
Y|3|Weak Bowman’s brew|2|{eyebright}2{wort}1T1|2
Y|3|Weak Nighthawk|2|{eyebright}2{belladonna}1{chamomile}1|1
Y|3|Strong Saviour Schnapps|3|N1{belladonna}2|3
Y|3|Hair o’ the Dog|2|{hops}1{wort}1{mint}1|6
Y|3|Embrocation|2|{eyebright}1{poppy}1{tusks}1|2
Y|3|Strong Cockerel|3|{valerian}1{mint}2|14
Y|3|Anti-inflammatory potion|4|N2{valerian}2{ginger}1|14
Y|4|Enamel powder|3|c1R1C1|0
Y|4|Weak Digestive potion|2|N1{thistle}2{charcoal}1|2
Y|4|Mintha perfume|2|{dandelion}3{marigold}1{mint}1|6
Y|4|Weak Aesop|2|{belladonna}1{tusks}1{comfrey}2|2
Y|4|Bowman’s brew|2|{eyebright}2{wort}1T1|2
Y|4|Nighthawk|2|{eyebright}2{belladonna}1{chamomile}1|3
Y|4|Henry’s Chamomile decoction|3|{chamomile}2{sage}1|10
Y|4|Henry’s Saviour Schnapps|3|N1{belladonna}2|8
Y|4|Strong Hair o’ the Dog|3|{hops}1{wort}1{mint}1|13
Y|4|Strong Embrocation|3|{eyebright}1{poppy}1{tusks}1|8
Y|4|Strong Anti-inflammatory potion|5|N2{valerian}2{ginger}1|22
Y|4|Henry’s Cockerel|3|{valerian}1{mint}2|20
Y|5|Acidum chloridum|1|N2{belladonna}1C1|0
Y|5|Digestive potion|2|N1{thistle}2{charcoal}1|4
Y|5|Weak Marigold decoction|2|N1{marigold}2|4
Y|5|Scattershot (Alchemy)|7|D1E1{lcoal}1|1
Y|5|Weak Painkiller brew|2|{poppy}3{comfrey}1{marigold}1|7
Y|5|Strong Mintha Perfume|3|{dandelion}3{marigold}1{mint}1|12
Y|5|Aesop|2|{belladonna}1{tusks}1{comfrey}2|2
Y|5|Weak Lion perfume|2|{sage}2{mint}2|7
Y|5|Strong Bowman’s brew|3|{eyebright}2{wort}1T1|4
Y|5|Strong Nighthawk|3|{eyebright}2{belladonna}1{chamomile}1|11
Y|5|Henry’s Anti-inflammatory potion|6|N2{valerian}2{ginger}1|28
Y|5|Henry’s Hair o’ the Dog|3|{hops}1{wort}1{mint}1|18
Y|5|Henry’s Embrocation|3|{eyebright}1{poppy}1{tusks}1|13
Y|6|Strong Digestive potion|3|N1{thistle}2{charcoal}1|9
Y|6|Weak Quickfinger potion|2|{eyebright}2{valerian}2{cobwebs}1|6
Y|6|Marigold decoction|2|N1{marigold}2|7
Y|6|Painkiller brew|2|{poppy}3{comfrey}1{marigold}1|9
Y|6|Lead ball (Alchemy)|5|D1E1{charcoal}1|18
Y|6|Strong Aesop|3|{belladonna}1{tusks}1{comfrey}2|6
Y|6|Henry’s Mintha perfume|3|{dandelion}3{marigold}1{mint}1|18
Y|6|Lion perfume|2|{sage}2{mint}2|10
Y|6|Weak fragrant oil|2|{chamomile}3{sage}1{valerian}1|8
Y|6|Henry’s Bowman’s brew|3|{eyebright}2{wort}1T1|10
Y|6|Henry’s Nighthawk|3|{eyebright}2{belladonna}1{chamomile}1|16
Y|7|Fever tonic|1|{feverfew}3{ginger}2{elder}1|1
Y|7|Quickfinger potion|2|{eyebright}2{valerian}2{cobwebs}1|8
Y|7|Henry’s Digestive potion|3|N1{thistle}2{charcoal}1|14
Y|7|Strong Marigold Decoction|3|N1{marigold}2|15
Y|7|Weak Mandrake decoction|1|{mandrake}1{sage}2P1|1
Y|7|Strong Painkiller brew|3|{poppy}3{comfrey}1{marigold}1|18
Y|7|Weak St. Roch’s potion|2|{wort}2{ginger}1{chamomile}2|6
Y|7|Henry’s Aesop|3|{belladonna}1{tusks}1{comfrey}2|12
Y|7|Strong Lion Perfume|3|{sage}2{mint}2|20
Y|7|Fragrant oil|2|{chamomile}3{sage}1{valerian}1|10
Y|8|Strong Quickfinger potion|3|{eyebright}2{valerian}2{cobwebs}1{amandrake}1|18
Y|8|Henry’s Marigold Decoction|3|N1{marigold}2{amandrake}1|19
Y|8|St. Roch’s potion|2|{wort}2{ginger}1{chamomile}2{amandrake}1|7
Y|8|Mandrake decoction|1|{mandrake}1{sage}2P1|1
Y|8|Henry’s Painkiller brew|3|{poppy}3{comfrey}1{marigold}1{amandrake}1|24
Y|8|Strong Fragrant oil|3|{chamomile}3{sage}1{valerian}1{amandrake}1|22
Y|8|Henry’s Lion perfume|3|{sage}2{mint}2{amandrake}1|28
Y|9|Strong St. Roch’s potion|3|{wort}2{ginger}1{chamomile}2{amandrake}1{rcrystal}1|14
Y|9|Henry’s Quickfinger potion|3|{eyebright}2{valerian}2{cobwebs}1{amandrake}1{rcrystal}1|24
Y|9|Strong Mandrake Decoction|1|{mandrake}1{sage}2P1|1
Y|9|Henry’s Fragrant oil|3|{chamomile}3{sage}1{valerian}1{amandrake}1{rcrystal}1|27
Y|10|Henry’s St. Roch’s potion|3|{wort}2{ginger}1{chamomile}2{amandrake}1{rcrystal}1{rantlers}1|16
Y|10|Henry’s Mandrake Decoction|1|{mandrake}1{sage}2P1|1
K|1|Drinking water|6|L1|0
K|1|Dried apple|1|{apple}1|0
K|1|Dried boletus|1|{boletus}1|0
K|1|Cooked lepiota;Dried lepiota|1|{lepiota}1|0
K|1|Dried pear;Cooked pear|1|{pear}1|0
K|1|Pretzel|2|{malt}1|0
K|1|Bagel;Bread roll|1|{malt}1|0
K|1|Cooked beet|1|{beet}1|0
K|1|Cooked carrot|10|{carrots}1|2
K|1|Sweet pancake;Marikľa|4|{malt}1{egg}1|0
K|1|Herring|1|{roach}1|0
K|1|Cooked onion|10|{onions}1|2
K|1|Sauerkraut|4|{cabbage}1|0
K|1|Cooked hare meat|1|{hare}1|1
K|1|Cooked hare meat (recipe 2)|4|{hare}2{onions}1|0
K|1|Cooked perch|1|{roach}2|1
K|2|Cooked apple|1|{apple}1|1
K|2|Cooked boletus|1|{boletus}1|1
K|2|Quark kolach|3|{malt}1{egg}1|0
K|2|Jewish bread;Walnut kolach|2|{malt}1{egg}1|0
K|2|Poppy seed kolach|2|{malt}1{egg}1{poppy}1|0
K|2|Hard boiled egg|1|{egg}1|0
K|2|Cooked garlic|1|{garlic}1|0
K|2|Cracklings|2|{pork}1|0
K|2|Dried hare meat|1|{hare}2|0
K|2|Smoked hare meat|1|{hare}2L1|0
K|2|Curd cheese|2|{milk}1|0
K|2|Cooked horseradish|1|{horseradish}1|1
K|2|Smoked perch|1|{roach}2L1|1
K|3|Cooked cabbage|4|{cabbage}1|4
K|3|Roasted chicken leg|1|{chicken}1|0
K|3|Roasted chicken leg (recipe 2)|3|{chicken}2{garlic}1|0
K|3|Dried mutton|1|{mutton}1|0
K|3|Bread|2|{barley}1|0
K|3|Dried chicken|1|{chicken}1|0
K|3|Dried roe deer loin;Dried deer ribs|1|{venison}2|0
K|3|Bacon|3|{pork}2L1|0
K|3|Kuttenberg bread|2|{barley}1{egg}1|0
K|3|Dried perch|1|{roach}2|1
K|3|Cooked roe deer meat|2|{venison}2{carrots}1|0
K|3|Salami|2|{pork}1{beef}1|0
K|3|Smoked chicken|1|{chicken}1L1|0
K|3|Dried pork|1|{pork}1|0
K|3|Cooked trout|1|{carp}2|1
K|3|Cooked crayfish|1|{eel}2|1
K|3|Cooked venison|2|{venison}4{onions}1|1
K|4|Cheese;Cream|1|{milk}1|0
K|4|Dried venison|1|{venison}2|0
K|4|Smoked mutton|1|{mutton}1L1|0
K|4|Smoked roe deer loin|1|{venison}2L1|0
K|4|Dried salami|1|{salami}1|0
K|4|Dried wolf meat|1|{wmeat}1|1
K|4|Dried beef|1|{beef}1|1
K|4|Cooked chicken|2|{chicken}2{onions}1|0
K|4|Cooked boar meat|1|{boar}2|1
K|5|Smoked beef|1|{beef}1L1|0
K|5|Smoked pork|1|{pork}1L1|0
K|5|Cooked roe deer loin|1|{venison}1|2
K|5|Dried trout|1|{carp}1|2
K|5|Dried cheese|1|{cheese}1|1
K|5|Smoked deer ribs|1|{venison}2L1|0
K|5|Cooked lamb|1|{mutton}1{garlic}1|2
K|5|Smoked trout|1|{carp}2L1|1
K|5|Smoked venison|2|{venison}2L1|1
K|5|Cooked blue crayfish|1|{pike}2|2
K|6|Smoked trout (recipe 2)|2|{eel}2L1|2
K|6|Dried deer rump|1|{venison}2|0
K|6|Roast duck|1|{chicken}2{egg}1|1
K|6|Kuttenberg sausauge|1|{pork}2L1|0
K|6|Boiled wolf meat|1|{wmeat}1{lepiota}1|2
K|6|Smoked wolf meat|1|{wmeat}1L1|1
K|6|Smoked boar meat|1|{boar}2L1|0
K|6|Dried roe deer meat|1|{venison}2|1
K|6|Smoked salami|1|{salami}1L1|1
K|6|Cooked pork|2|{pork}2{onions}1|4
K|6|Dried pork tenderloin|1|{ptender}1|1
K|6|Cooked crayfish (recipe 2)|2|{carp}3{plums}1{malt}1|2
K|7|Cooked deer ribs|1|{venison}1|4
K|7|Smoked sausage|2|{pork}3{onions}1L1|1
K|7|Cooked sheep stomach|1|{sstomach}1|0
K|7|Smoked venison (Roe)|1|{venison}2L1|0
K|7|Cooked trout (recipe 2)|2|{pike}2{horseradish}1|2
K|7|Cooked beef|2|{beef}2{carrots}1{onions}1|3
K|7|Dried boar meat|1|{boar}2|2
K|7|Smoked cheese|1|{cheese}1L1|2
K|8|Dried beef tenderloin|1|{btender}1|3
K|8|Smoked deer rump|1|{venison}2L1|2
K|8|Cooked roe deer kidneys|1|{venison}4|0
K|8|Cooked beef kidneys|1|{bkidney}1|0
K|8|Smoked pork tenderloin|1|{ptender}1L1|4
K|8|Dried boar tenderloin|1|{boar}2|5
K|8|Smoked boar rump|1|{boar}3L1|2
K|9|Dried boar rump|1|{boar}3|2
K|9|Cooked hare heart|1|{hare}5|3
K|9|Cooked deer rump|1|{venison}2{boletus}1|8
K|9|Kuttenberg bacon|1|{pork}3L1|3
K|9|Pepa’s Sauerkraut|1|{cabbage}2{onions}1{carrots}1|1
K|9|Cooked boar kidneys|1|{boar}3|4
K|9|Cooked deer heart|1|{venison}3|6
K|9|Cooked wolf heart|1|{wheart}1|10
K|9|Smoked beef tenderloin|1|{btender}1L1|6
K|9|Cooked pork tenderloin|1|{ptender}1{apple}1|10
K|10|Cooked beef tongue|1|{btongue}1{horseradish}1|2
K|10|Boiled pork liver|1|{pliver}1{garlic}1|1
K|10|Smoked boar tenderloin|1|{boar}2L1|10
K|10|Cooked beef tenderloin|1|{btender}1|14
K|10|Cooked boar rump|1|{boar}3|12
K|10|Cooked boar tenderloin|1|{boar}3{sage}1|2
P|1|Straw bed|1|L17{hay}3|2
P|1|Rough table;Plain chair;Log bench|1|L12|1
P|1|Log stool;Plain shelf|1|L8|1
P|1|Basket of apples;Basket of bread;Cushion|1|L3|1
P|1|Bed of boughs;Bedroll|1|L8H2p2|1
P|1|Campfire|1|L8R3|2
P|1|Candle|1|{honey}2|1
P|1|Pillar candle|1|O2C2R2|1
P|1|Ribboned wreath|1|L2{chamomile}3p2|1
P|1|Straw wreath|1|L2p2|1
P|1|Twig cross|1|L2|1
P|1|Coil of rope|1|L6O1N6|1
P|1|Sack of flour|1|L6O1{barley}3p2|1
P|1|Heap of hay|1|L10{hay}6|1
P|1|Log carrier;Rail fence|1|L10|1
P|1|Sheaf of hay|1|L10{hay}4|1
P|1|Drying herbs|1|L2{sage}2{chamomile}2|1
P|1|Egg basket|1|L2W1|1
P|1|Garlic|1|L2{sage}1|1
P|1|Heap of pears;Sack of apples|1|L2{plums}3|1
P|1|Pretzel|1|L2{malt}1|1
P|1|Round loaf|1|L2{malt}2|1
P|1|String of onions|1|L2{onions}2|1
P|2|Small table;Rustic stool;Plain bench|1|L18R2|4
P|2|Barrel;Crate|1|L18R2O2|4
P|2|Wall shelf|1|L11R2O2|4
P|2|Boar hide;Deer hide|1|L4R2H3|4
P|2|Sheepskin;Wall rack|1|L4R2|4
P|2|Wash tub|1|L6R2|4
P|2|Bough lean-to;Shabby shelter|1|L20H10|6
P|2|Camp grill;Cooking pot;Hanging cauldron;Roasting spit|1|L12O12C6|8
P|2|Straw pallet|1|L12H2p4{hay}3|4
P|2|Short ladder|1|L12R4N4|4
P|2|Candles|1|{honey}3|4
P|2|Candlestick|1|O2C1{honey}1|4
P|2|Clay lamp|1|O2C1R2|4
P|2|Guttered candles|1|O4C2R2|4
P|2|Wall torch|1|O4C2R2L4|4
P|2|Bouquet|1|L3{chamomile}2{sage}2|4
P|2|Clay tankard|1|L3C1|4
P|2|Cow skull|1|L3H2|4
P|2|Leaf wreath|1|L3{hops}4|4
P|2|Vase|1|L3C2|4
P|2|Wreath of blue flowers|1|L3p3|4
P|2|Blank sign;Butter churn|1|L14O2|4
P|2|Saddle stand|1|L18O2l10|8
P|2|Straw dummy|1|L14O2p4|4
P|2|Covered woodpile|1|L23R4|6
P|2|Criss-cross fence;Paddock fence|1|L14|4
P|2|Picket gate|1|L14O1|4
P|2|Bowl of cracklings;Side of bacon;Smoked sausages|1|L2{boar}2|4
P|2|Bowl of goulash|1|L2{venison}2|4
P|2|Cauldron of soup|1|L2{malt}2|4
P|2|Crock of sauerkraut|1|L2{cabbage}2|4
P|2|Pitcher|1|L2C1|4
P|2|Watermelons|1|L2{grapes}3|4
P|2|Wedge of cheese|1|L2{malt}1N1|4
P|2|Wine jug|1|L2C1{grapes}2|4
P|3|Cradle;Rustic chair|1|L24R4l4|9
P|3|Rustic bed;Long bench|1|L31R5l5|14
P|3|Rustic table;Dice board;Dice table|1|L24R4|9
P|3|Small chest;Small crate;Rustic shelves|1|L24R4O2|9
P|3|Cowhide;Woven rug|1|L5R3H3|9
P|3|Draped pelt;Fox pelt;Grey pelt|1|L5R3|9
P|3|Cooking tripod|1|L18O17C6|18
P|3|Roasting pit|1|L33R9|29
P|3|Rustic canopy;Rustic lean-to;Small tent|1|L26H10|14
P|3|Ladder|1|L26R7N5|14
P|3|Brazier|1|O6C6R4|9
P|3|Iron candlestick|1|O2C2{honey}2|9
P|3|Leather lantern|1|O2C2R3l3|9
P|3|Spike lamp|1|O4C4R3|9
P|3|Alms box|1|L3O6|9
P|3|Book|1|L3l3W1|9
P|3|Inkwell and quill|1|L3W2{charcoal}1|9
P|3|Pottery;Wide vase|1|L3C2|9
P|3|Prayer rug;Wooden flute|1|L3p3|9
P|3|Ram’s skull|1|L3H2|9
P|3|Sketch|1|L3{charcoal}2|9
P|3|Herbalist’s shelf|1|L29O4R4N2{sage}2|14
P|3|Pretzel stand|1|L18O2{malt}2|9
P|3|Quenching barrel|1|L18O12|9
P|3|Rolled hides|1|L18O2H8|9
P|3|Tapped cask|1|L18O2{plums}3|9
P|3|Wheelbarrow;Harrow|1|L29O5|14
P|3|Elder bush|1|L18{sage}3|9
P|3|Hay rack|1|L29O2{hay}2|14
P|3|Hop poles|1|L29{hops}5|14
P|3|Log beehive|1|L29{honey}2|14
P|3|Plough|1|L29O7l4|14
P|3|Stone trough|1|L29O4|14
P|3|Wayside cross;Woven fence|1|L18|9
P|3|Cauldron of goulash|1|L2{malt}3|9
P|3|Curd tart;Poppy-seed tart|1|L2{malt}3{honey}2|9
P|3|Honeycomb;Jug of mead|1|L2{honey}4|9
P|3|Pig’s head|1|L2{boar}4|9
P|3|Walnut cake|1|L2{malt}3|9
P|3|Hidden vat|1|L10R4O1|9
P|4|Carved rustic bed|1|L38R5O4l5|26
P|4|Square table;Beer barrel|1|L30R4O3|16
P|4|Rustic cupboard|1|L43R6O4|26
P|4|Deerskin coverlet|1|L10R4|16
P|4|Prayer kneeler|1|L6R3|16
P|4|Raised hearth|1|L16R7|26
P|4|Chequered awning;Small green tent|1|L32H15l5|26
P|4|Long ladder|1|L32R10N6|26
P|4|Pricket candlestick;Tavern lamp;Twin-cup candlestick|1|O6C4R3|16
P|4|Wooden chandelier|1|O15C10R7L16|26
P|4|Hunting horn|1|L4T1l2|16
P|4|Mounted antlers|1|L4T1|16
P|4|Row of books|1|L4l6W2|16
P|4|Scrolls|1|L4l3W1|16
P|4|Town banner|1|L8p8|21
P|4|Wall hanging|1|L6p6|16
P|4|Baker’s sign;Blacksmith’s sign;Butcher’s sign;Draper’s sign;Herbalist’s sign;Merchant’s sign;Tavern sign|1|L22O3|16
P|4|Bellows|1|L22O9l8|16
P|4|Bolts of cloth|1|L22O3{linen}3|16
P|4|Herb drying rack|1|L36O5R7N3{chamomile}2|26
P|4|Hide drying rack|1|L37O5H10|51
P|4|Keg|1|L22O3{malt}4{hops}2|16
P|4|Merchant’s shelf|1|L36O5R4|26
P|4|Shop counter|1|L36O5R7|26
P|4|Dog kennel|1|L36R7|26
P|4|Hen house|1|L36R7W2|26
P|4|Rose bush|1|L22{chamomile}3|16
P|4|Straw skep|1|L22{honey}2{hay}2|16
P|4|Altar ewer|1|L2{malt}3|16
P|4|Roast suckling pig|1|L2{boar}5{sage}2|16
P|4|Hidden still|1|L12K7C2|16
P|5|Double rustic bed|1|L48R5O4l5|40
P|5|Long trestle table;Painted cupboard;Bookshelf|1|L50R6O4s1|41
P|5|Antlers on a shield|1|L7R3l1|24
P|5|Patterned rug|1|L7R3H4l1|24
P|5|Yellow tent|1|L39H15l5|40
P|5|Hanging lantern;Lantern|1|O4C4R3s1|25
P|5|Two-branched candlestick|1|O2C1{honey}1s1|25
P|5|Fine tablecloth;Lute|1|L4p4|25
P|5|Hourglass;Pewter jug|1|L1K2s1|26
P|5|Icon of the Holy Face|1|L4R1G1s1|26
P|5|Map|1|L4{charcoal}2l2|25
P|5|Stag’s skull|1|L1T1s1|26
P|5|Armourer’s sign|1|L23O3s1|26
P|5|Embroidery frame|1|L49O6p8|80
P|5|Hanging scales|1|L34O13K13s1|41
P|5|Pavise|1|L34O4l6R6s3|32
P|5|Polearms|1|L30O24C7s2|52
P|5|Potter’s wheel|1|L39O8s1|41
P|5|Spinning wheel|1|L45O6R8{flax}2s1|81
P|5|Dressed piglet|1|L2{boar}5|25
P|5|Hanging deer|1|L2{venison}7H4|25
P|6|Fine table|1|L37R6O4s2|36
P|6|Fine chair|1|L42R6O4l6p6|36
P|6|Fine bench|1|L54R8O5l8|58
P|6|Bath canopy;Dressing screen;Timber-framed hearth|1|L21R10l2|56
P|6|Great stag antlers|1|L8R4l1|36
P|6|Siege ladder|1|L47R14N4O3s2|108
P|6|Candelabrum|1|O6C6R4s1|36
P|6|Censer|1|L2K2{sage}1s1|37
P|6|Easel|1|L5R4s1|37
P|6|Home altar|1|L10R7O4s1|58
P|6|Hunting tapestry;Processional cross|1|L8p8|36
P|6|Icon of a holy bishop|1|L2R3G1s1|37
P|6|Lectern|1|L5O2s1|37
P|6|Anvil on a stump|1|L28O30C12s2|114
P|6|Cask on a cradle|1|L25O4{grapes}6s2|36
P|6|Market stall with an awning;Plank market stall|1|L62O8s2|108
P|6|Stone cross|1|L43O5s2|57
P|6|Whole pig|1|L2{boar}8|36
P|7|Burgher’s bed|1|L56R7O5l7p7s2|78
P|7|Round table;Fine cabinet|1|L68R8O6s3|78
P|7|Rolled eastern carpet|1|L26R10H11l3|81
P|7|Long tent;Yurt|1|L27H10l18s1p28|147
P|7|Lamp stand|1|O12C9R6s2|49
P|7|Ring chandelier|1|O20C15R10L26s4|78
P|7|Chalice|1|L7G2S1s2|49
P|7|Courtly tapestry|1|L8p8s2|49
P|7|Icon;Icon of Saint George;Icon of the Virgin|1|L5R3G1s2|49
P|7|Veiled saint|1|L13p13s4|78
P|7|Alchemist’s table|1|L60O7K5N4{sage}4s4|157
P|7|Armour stand|1|L56O19l3s7|102
P|7|Canopied market stall|1|L73O8s4|147
P|7|Sword rack|1|L54O19R6s6|102
P|8|Scrolled chair|1|L54R6O5l6p8s2{oak}1|64
P|8|Great chest;Fine bookshelf|1|L78R8O7s3{oak}1|102
P|8|Pointed pavilion;Round pavilion|1|L31H13l20s1p31{oak}1|250
P|8|Great candelabrum|1|O20C12R8s3{oak}1|83
P|8|Pierced hanging lantern|1|O9C6R4s2{oak}1|64
P|8|Pierced lantern|1|O12C8R5s2{oak}1|64
P|8|Altar cross|1|L8G3O5s2{oak}1|64
P|8|Birdcage|1|L8O8G1s2{oak}1|64
P|8|Madonna and Child|1|L16p16s4{oak}1|102
P|8|Wooden saint|1|L16R10s4{oak}1|102
P|8|Fine weapon rack|1|L60O24R6s6{oak}1|133
P|8|Great market stall|1|L82O10s4{oak}1|192
P|8|Small forge|1|L39O34C19s4{oak}1|499
P|8|Sweep well|1|L77O8l8s4{oak}1|192
P|8|Wayside shrine|1|L79O6R8s4{oak}1|192
P|9|Burgher’s double bed|1|L70R9O6l9p9s3{oak}1{amber}1|168
P|9|Carved table|1|L85R11O7s4{oak}1{amber}1|168
P|9|Hall bench|1|L76R10O6l10s4{oak}1{amber}1|168
P|9|Italian court tapestry|1|L10p10s3{oak}1{amber}1|81
P|9|Statue of the Virgin|1|L39R24K8s12{oak}1{amber}1|316
P|9|Winged altar|1|L16p16s5{oak}1{amber}1|130
P|9|Devotional pillar|1|L86O10C6s6{oak}1{amber}1|243
P|10|Canopy bed|1|L77R9O7l9p11s3{oak}2{amber}1|390
P|10|Lord’s chair|1|L77R9O7l9p11s3{oak}2{amber}1|130
P|10|Lord’s shelves|1|L94R11O8s4{oak}2{amber}1|208
P|10|Knight’s pavilion|1|L36H15l25s5p35G1{oak}2{amber}1|390
P|10|Great chandelier|1|O34C22R15L41s5{oak}2{amber}1|390
P|10|Stuffed crocodile|1|L10H10p7s3{oak}2{amber}1|100`;
