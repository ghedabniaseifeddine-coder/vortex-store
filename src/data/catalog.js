// Catalog recovered verbatim from the original SMART ACCESSOIRE bundle.
// Names, prices (DA), stock, specs and category identity are preserved exactly.

export const CATEGORIES = [
  { id: 'cases', name: 'Cases', color: '#b8ff2c', art: 'case', keywords: 'كوك, كيس, غطاء, coque, cover, case, protection telephone' },
  { id: 'chargers', name: 'Chargers', color: '#2ee6ff', art: 'charger', keywords: 'شارجور, شاحن, شارجير, chargeur, charger, adaptateur' },
  { id: 'audio', name: 'Audio', color: '#ff3d8b', art: 'audio', keywords: 'سماعات, كاسك, écouteurs, ecouteurs, airpods, casque, earbuds, headphones, audio, son' },
  { id: 'cables', name: 'Cables', color: '#7affd9', art: 'cable', keywords: 'كابل, وير, فيل, câble, cable, fil' },
  { id: 'power', name: 'Power Banks', color: '#ffb02e', art: 'power', keywords: 'باور بانك, powerbank, power bank, بطارية, batterie externe' },
  { id: 'screens', name: 'Screen Protectors', color: '#6fa8ff', art: 'screen', keywords: 'فيتر, فيتري, verre, verre trempé, protection ecran, protège écran, حماية الشاشة, tempered, screen protector' },
];

const NOW = Date.now();

export const SEED_PRODUCTS = [
  {
    id: 'p1', name: 'Aurora Shield Case', categoryId: 'cases', price: 1200, oldPrice: 1500,
    cost: 450, stock: 40, featured: true, createdAt: NOW - 9e8, art: 'case', tone: '#b8ff2c',
    description: 'Slim shock-absorbing case with a glossy gradient back and raised bezels that protect the screen and camera.',
    specs: ['Material: TPU + polycarbonate', 'Drop protection: up to 2 m', 'Wireless charging compatible', 'Fits: iPhone & Samsung (choose your model)'],
  },
  {
    id: 'p2', name: 'Carbon Armor Case', categoryId: 'cases', price: 1800, oldPrice: null,
    cost: 700, stock: 25, featured: false, createdAt: NOW - 8e8, art: 'case', tone: '#8f9bb3',
    description: 'Military-grade carbon fibre texture with a soft-touch grip. Built for people who never slow down.',
    specs: ['Material: carbon-texture TPU', 'Drop protection: up to 3 m', 'MagSafe-style magnet ring', 'Anti-fingerprint coating'],
  },
  {
    id: 'p3', name: 'VoltPad 15W Wireless Charger', categoryId: 'chargers', price: 3200, oldPrice: 3900,
    cost: 1500, stock: 18, featured: true, createdAt: NOW - 7e8, art: 'charger', tone: '#2ee6ff',
    description: 'Ultra-thin Qi pad with LED status ring and over-heat protection. Charge through your case.',
    specs: ['Output: 15W Qi fast wireless', 'Input: USB-C (cable included)', 'Works through cases up to 5 mm', 'Safety: temperature + foreign-object detection'],
  },
  {
    id: 'p4', name: 'Turbo GaN 65W Charger', categoryId: 'chargers', price: 4500, oldPrice: null,
    cost: 2300, stock: 22, featured: true, createdAt: NOW - 6e8, art: 'charger', tone: '#2ee6ff',
    description: 'Pocket-size GaN wall charger that powers a phone, tablet and laptop at full speed.',
    specs: ['Output: 65W PD 3.0 / QC 4+', 'Ports: 2× USB-C + 1× USB-A', 'GaN tech — 40% smaller', 'Charges a phone 0→50% in ~20 min'],
  },
  {
    id: 'p5', name: 'Pulse Buds Pro ANC', categoryId: 'audio', price: 6900, oldPrice: 8200,
    cost: 3600, stock: 15, featured: true, createdAt: NOW - 5e8, art: 'audio', tone: '#ff3d8b',
    description: 'True wireless earbuds with active noise cancelling, punchy bass and a 30-hour battery.',
    specs: ['Bluetooth 5.3', 'ANC up to -35 dB', 'Battery: 7h + 23h case', 'IPX5 water resistant', 'Touch controls + low-latency game mode'],
  },
  {
    id: 'p6', name: 'Nova Wave Headphones', categoryId: 'audio', price: 8500, oldPrice: null,
    cost: 4400, stock: 10, featured: false, createdAt: NOW - 4e8, art: 'audio', tone: '#ff3d8b',
    description: 'Over-ear wireless headphones with deep 40 mm drivers and memory-foam cushions for all-day comfort.',
    specs: ['Bluetooth 5.2 + AUX', '40 mm dynamic drivers', 'Battery: 50 hours', 'Foldable design with hard pouch'],
  },
  {
    id: 'p7', name: 'Nylon Braid USB-C Cable 1.5m', categoryId: 'cables', price: 900, oldPrice: null,
    cost: 300, stock: 60, featured: false, createdAt: NOW - 3e8, art: 'cable', tone: '#7affd9',
    description: 'Tangle-free double-braided nylon cable that survives 20,000+ bends.',
    specs: ['Length: 1.5 m', 'Power: up to 60W / 3A', 'Data: 480 Mbps', 'Aluminium connectors'],
  },
  {
    id: 'p8', name: 'Lightning Fast MFi Cable 1m', categoryId: 'cables', price: 1400, oldPrice: null,
    cost: 600, stock: 35, featured: false, createdAt: NOW - 2e8, art: 'cable', tone: '#7affd9',
    description: 'MFi-certified Lightning cable for fast and safe charging on every iPhone.',
    specs: ['Length: 1 m', 'MFi certified', 'Supports 20W PD fast charge', 'Reinforced stress points'],
  },
  {
    id: 'p9', name: 'Orbit 20,000mAh Power Bank', categoryId: 'power', price: 5200, oldPrice: 6000,
    cost: 2700, stock: 14, featured: true, createdAt: NOW - 15e7, art: 'power', tone: '#ffb02e',
    description: 'High-capacity power bank with 22.5W fast charging and a digital battery display. 4+ full phone charges.',
    specs: ['Capacity: 20 000 mAh', 'Output: 22.5W fast charge', 'Ports: 2× USB-A + 1× USB-C', 'LED digital display'],
  },
  {
    id: 'p10', name: 'Slim Core 10,000mAh', categoryId: 'power', price: 3400, oldPrice: null,
    cost: 1700, stock: 20, featured: false, createdAt: NOW - 1e8, art: 'power', tone: '#ffb02e',
    description: 'Pocketable 10 000 mAh power bank, thinner than your phone. Perfect for daily carry.',
    specs: ['Capacity: 10 000 mAh', 'Output: 18W PD', 'Weight: 190 g', 'Dual-port USB-C + USB-A'],
  },
  {
    id: 'p11', name: 'Ultra Clear Tempered Glass 9H', categoryId: 'screens', price: 600, oldPrice: null,
    cost: 150, stock: 80, featured: false, createdAt: NOW - 5e7, art: 'screen', tone: '#6fa8ff',
    description: 'Crystal-clear 9H tempered glass with oleophobic coating and an easy alignment frame.',
    specs: ['Hardness: 9H', 'Thickness: 0.33 mm', 'Oleophobic anti-fingerprint', 'Installation kit included'],
  },
  {
    id: 'p12', name: 'Anti-Shatter Glass 9H+', categoryId: 'screens', price: 1000, oldPrice: null,
    cost: 350, stock: 45, featured: false, createdAt: NOW - 2e7, art: 'screen', tone: '#6fa8ff',
    description: 'Anti-shatter tempered glass with reinforced edges that absorb impact instead of cracking.',
    specs: ['Hardness: 9H+', 'Thickness: 0.4 mm', 'Reinforced rounded edges', '2-pack with wipes'],
  },
];

export const WILAYAS = [
  { code: '01', name: 'Adrar', fee: 1000 }, { code: '02', name: 'Chlef', fee: 600 },
  { code: '03', name: 'Laghouat', fee: 800 }, { code: '04', name: 'Oum El Bouaghi', fee: 600 },
  { code: '05', name: 'Batna', fee: 600 }, { code: '06', name: 'Béjaïa', fee: 600 },
  { code: '07', name: 'Biskra', fee: 800 }, { code: '08', name: 'Béchar', fee: 1000 },
  { code: '09', name: 'Blida', fee: 500 }, { code: '10', name: 'Bouira', fee: 500 },
  { code: '11', name: 'Tamanrasset', fee: 1200 }, { code: '12', name: 'Tébessa', fee: 700 },
  { code: '13', name: 'Tlemcen', fee: 700 }, { code: '14', name: 'Tiaret', fee: 700 },
  { code: '15', name: 'Tizi Ouzou', fee: 600 }, { code: '16', name: 'Alger', fee: 400 },
  { code: '17', name: 'Djelfa', fee: 700 }, { code: '18', name: 'Jijel', fee: 600 },
  { code: '19', name: 'Sétif', fee: 600 }, { code: '20', name: 'Saïda', fee: 700 },
  { code: '21', name: 'Skikda', fee: 600 }, { code: '22', name: 'Sidi Bel Abbès', fee: 700 },
  { code: '23', name: 'Annaba', fee: 600 }, { code: '24', name: 'Guelma', fee: 600 },
  { code: '25', name: 'Constantine', fee: 600 }, { code: '26', name: 'Médéa', fee: 500 },
  { code: '27', name: 'Mostaganem', fee: 700 }, { code: '28', name: "M'Sila", fee: 700 },
  { code: '29', name: 'Mascara', fee: 700 }, { code: '30', name: 'Ouargla', fee: 900 },
  { code: '31', name: 'Oran', fee: 600 }, { code: '32', name: 'El Bayadh', fee: 900 },
  { code: '33', name: 'Illizi', fee: 1200 }, { code: '34', name: 'Bordj Bou Arreridj', fee: 600 },
  { code: '35', name: 'Boumerdès', fee: 500 }, { code: '36', name: 'El Tarf', fee: 600 },
  { code: '37', name: 'Tindouf', fee: 1200 }, { code: '38', name: 'Tissemsilt', fee: 700 },
  { code: '39', name: 'El Oued', fee: 900 }, { code: '40', name: 'Khenchela', fee: 700 },
  { code: '41', name: 'Souk Ahras', fee: 700 }, { code: '42', name: 'Tipaza', fee: 500 },
  { code: '43', name: 'Mila', fee: 600 }, { code: '44', name: 'Aïn Defla', fee: 600 },
  { code: '45', name: 'Naâma', fee: 900 }, { code: '46', name: 'Aïn Témouchent', fee: 700 },
  { code: '47', name: 'Ghardaïa', fee: 900 }, { code: '48', name: 'Relizane', fee: 700 },
  { code: '49', name: 'Timimoun', fee: 1100 }, { code: '50', name: 'Bordj Badji Mokhtar', fee: 1300 },
  { code: '51', name: 'Ouled Djellal', fee: 900 }, { code: '52', name: 'Béni Abbès', fee: 1100 },
  { code: '53', name: 'In Salah', fee: 1200 }, { code: '54', name: 'In Guezzam', fee: 1300 },
  { code: '55', name: 'Touggourt', fee: 900 }, { code: '56', name: 'Djanet', fee: 1300 },
  { code: '57', name: "El M'Ghair", fee: 900 }, { code: '58', name: 'El Meniaa', fee: 900 },
];

export const FREE_SHIPPING_THRESHOLD = 8000;

export const formatDA = (n) => `${Number(n || 0).toLocaleString('fr-FR').replace(/\u202f|\u00a0/g, ' ')} DA`;

export const categoryOf = (id) => CATEGORIES.find((c) => c.id === id) || CATEGORIES[0];
