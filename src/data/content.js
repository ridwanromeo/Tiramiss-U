// All site content in one place: copy, flavour data, craft steps, nav.

export const NAV_LINKS = [
  { label: 'Flavours', href: '#flavours' },
  { label: 'Menu', href: '#menu' },
  { label: 'Craft', href: '#craft' },
  { label: 'Gifting', href: '#gifting' },
  { label: 'Visit', href: '#visit' },
];

export const KNOWN_HASHES = new Set([
  '',
  '#top',
  '#flavours',
  '#menu',
  '#craft',
  '#gifting',
  '#teatime',
  '#drinks',
  '#visit',
]);

// Pinned horizontal gallery: one signature per panel.
export const SIGNATURES = [
  {
    id: 'brulee',
    name: 'Creme Brulee',
    tag: 'Torched to order',
    note: 'Brown sugar torched into glass. Crack it, then sink the spoon.',
    img: '/assets/video-creme-brulee-slice.jpg',
    alt: 'Torched creme brulee tiramisu slice on a white plate',
  },
  {
    id: 'blossom',
    name: 'Spring Blossom',
    tag: 'Matcha and strawberry',
    note: 'Earthy matcha meets bright strawberry, crowned with an edible butterfly.',
    img: '/assets/video-spring-blossom-lift.jpg',
    alt: 'Matcha strawberry Spring Blossom tiramisu being lifted with a spatula',
  },
  {
    id: 'dubai',
    name: 'Dubai Chocolate',
    tag: 'Pistachio crunch',
    note: 'Dark chocolate glaze over pistachio crunch. Rich, nutty, gone in seconds.',
    img: '/assets/video-dubai-chocolate-slice.jpg',
    alt: 'Dubai chocolate tiramisu slice with green crumble topping',
  },
  {
    id: 'yam',
    name: 'Yam and Coconut',
    tag: 'Local soul',
    note: 'Fragrant yam cream layered soft, finished the way the cafe loves it.',
    img: '/assets/video-yam-coconut-row.jpg',
    alt: 'Rows of yam and coconut tiramisu in display boxes',
  },
  {
    id: 'citrus',
    name: 'Earl Grey Citrus',
    tag: 'Bright and light',
    note: 'Bergamot cream with fresh citrus. The slice that tastes like afternoon sun.',
    img: '/assets/video-citrus-earl-grey.jpg',
    alt: 'Earl Grey citrus tiramisu topped with blood orange slices',
  },
  {
    id: 'coconut',
    name: 'Roasted Coconut',
    tag: 'Cloud soft',
    note: 'Snowy coconut over silky cream. Light enough to follow any meal.',
    img: '/assets/video-slice-lift-coconut.jpg',
    alt: 'Roasted coconut tiramisu slice being served',
  },
];

export const FLAVOUR_FAMILIES = ['All', 'Fruity', 'Chocolate', 'Tea', 'Classic'];

export const FLAVOURS = [
  {
    id: 'creme-brulee',
    name: 'Creme Brulee',
    family: 'Classic',
    note: 'Torched brown sugar crust',
    img: '/assets/video-torched-brulee-close.jpg',
    alt: 'Close up of torched creme brulee tiramisu',
  },
  {
    id: 'spring-blossom',
    name: 'Spring Blossom',
    family: 'Tea',
    note: 'Matcha, strawberry, edible butterfly',
    img: '/assets/video-spring-blossom-butterfly.jpg',
    alt: 'Spring Blossom tiramisu with pink butterfly decoration',
  },
  {
    id: 'dubai-choc',
    name: 'Dubai Chocolate',
    family: 'Chocolate',
    note: 'Pistachio crunch, dark glaze',
    img: '/assets/video-dubai-spoon-bite.jpg',
    alt: 'Spoon lifting a bite of Dubai chocolate tiramisu',
  },
  {
    id: 'jasmine-matcha',
    name: 'Jasmine Matcha',
    family: 'Tea',
    note: 'Floral, calm, quietly sweet',
    img: '/assets/video-jasmine-matcha-spoon.jpg',
    alt: 'Spoon lifting jasmine matcha tiramisu',
  },
  {
    id: 'earl-citrus',
    name: 'Earl Grey Citrus',
    family: 'Fruity',
    note: 'Bergamot cream, fresh citrus',
    img: '/assets/video-citrus-earl-grey.jpg',
    alt: 'Citrus topped Earl Grey tiramisu bars',
  },
  {
    id: 'roast-coconut',
    name: 'Roasted Coconut',
    family: 'Classic',
    note: 'Snowy, milky, featherlight',
    img: '/assets/video-slice-lift-coconut.jpg',
    alt: 'Roasted coconut tiramisu slice',
  },
  {
    id: 'melon-jasmine',
    name: 'Melon and Jasmine',
    family: 'Fruity',
    note: 'Juicy melon over soft cream',
    img: '/assets/video-display-melon-rows.jpg',
    alt: 'Rows of melon and jasmine tiramisu',
  },
  {
    id: 'peach-oolong',
    name: 'Peach Oolong',
    family: 'Tea',
    note: 'Roasted tea, poached peach',
    img: '/assets/video-boxes-topdown.jpg',
    alt: 'Peach oolong and sea salt oreo tiramisu bars from above',
  },
  {
    id: 'yam-coconut',
    name: 'Yam and Coconut',
    family: 'Classic',
    note: 'Fragrant, homely, smooth',
    img: '/assets/video-yam-coconut-row.jpg',
    alt: 'Yam and coconut tiramisu rows',
  },
  {
    id: 'seasonal-box',
    name: 'Seasonal Four',
    family: 'Fruity',
    note: 'Four rotating picks, boxed',
    img: '/assets/dish-box-four-colours.jpg',
    alt: 'Gift box with four colourful tiramisu slices',
  },
  {
    id: 'classic-four',
    name: 'The Classic Four',
    family: 'Classic',
    note: 'Mango, chocolate, original, matcha',
    img: '/assets/dish-four-plates-dark.jpg',
    alt: 'Four classic tiramisu slices on plates',
  },
];

export const CRAFT_STEPS = [
  {
    id: 'daily',
    title: 'Made fresh every morning',
    body: 'Every tray is built in the cafe each day. What you taste at noon was cream and crumbs at dawn.',
    img: '/assets/video-decorating-boxes.jpg',
    alt: 'Cafe team decorating fresh tiramisu boxes',
  },
  {
    id: 'torch',
    title: 'Torched the moment you order',
    body: 'Sugar, flame, crackle. The brulee crust only meets fire when your plate is ready.',
    img: '/assets/video-torching-brulee.jpg',
    alt: 'Torching the sugar crust on a creme brulee tiramisu',
  },
  {
    id: 'gone',
    title: 'Never kept overnight',
    body: 'The case empties every night on purpose. Tomorrow starts with a clean slate and fresh cream.',
    img: '/assets/video-owner-in-cafe.jpg',
    alt: 'Team member in the Tiramiss U cafe',
  },
];

export const HERO_CHIPS = [
  { label: '30+ flavours', img: '/assets/video-boxes-topdown.jpg', alt: 'Rows of tiramisu bars' },
  { label: 'Torched brulee', img: '/assets/video-torched-brulee-close.jpg', alt: 'Torched brulee close up' },
  { label: 'Spring Blossom', img: '/assets/video-spring-blossom-butterfly.jpg', alt: 'Spring Blossom slice' },
  { label: 'Baked by humans', img: '/assets/video-owner-wave.jpg', alt: 'Team member waving behind the counter' },
];

export const PRELOAD_IMAGES = [
  '/assets/video-torched-brulee-close.jpg',
  '/assets/video-display-wall.jpg',
  '/assets/video-creme-brulee-slice.jpg',
  '/assets/video-spring-blossom-lift.jpg',
  '/assets/pack-gift-box-ribbon.jpg',
  '/assets/video-drinks-duo.jpg',
];
