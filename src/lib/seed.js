const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const dbPath = process.env.DATABASE_PATH || './data/tss-wheel.db';
const db = new Database(dbPath);

// Services ordered by weight (largest to smallest) for clockwise display
const seedData = [
  {
    name: 'Cyber Security',
    tooltip: 'Cyber Security, Made Simple',
    description: 'Discover peace of mind with our three-tiered cyber security packages – SecureStart, SecureAware, and SecureComplete – giving you complete peace of mind which scales to your needs.',
    color: '#b40007',
    // weight = 60 + 50 + 40 + 35 + 30 + 25 + 20 = 260
    subservices: [
      { name: 'Email Filtering*', tooltip: 'Block malicious emails', color: '#D42A46', weight: 60, link: null },
      { name: 'Managed Detection & Response*', tooltip: 'Proactive threat monitoring', color: '#C41E3A', weight: 50, link: null },
      { name: 'DNS Filtering*', tooltip: 'Block malicious websites', color: '#B41830', weight: 40, link: null },
      { name: 'Vulnerability Scanning & Penetration Testing', tooltip: 'Identify weaknesses', color: '#A41228', weight: 35, link: null },
      { name: 'Enterprise Credential Management', tooltip: 'Secure password management', color: '#D42A46', weight: 30, link: null },
      { name: 'Cyber Essentials Basic & Plus', tooltip: 'UK government certification', color: '#C41E3A', weight: 25, link: null },
      { name: 'Human Risk Management', tooltip: 'Security awareness training', color: '#B41830', weight: 20, link: null },
    ]
  },
  {
    name: 'M365',
    tooltip: 'Microsoft 365 expertise',
    description: 'Complete Microsoft 365 management including deployment, migration, optimization, and ongoing support for all M365 services.',
    color: '#3f80a0',
    // weight = 10 + 60 + 45 + 50 + 40 + 40 + 10 = 255
    subservices: [
      { name: 'Microsoft 365 Plan Selection', tooltip: 'License planning', color: '#4B8DE8', weight: 10, link: null },
      { name: '365 Management*', tooltip: 'Full M365 administration', color: '#3B7DD8', weight: 60, link: null },
      { name: '365 Backup*', tooltip: 'Data protection', color: '#2B6DC8', weight: 45, link: null },
      { name: '365 Moving to Premium or Enterprise', tooltip: 'License upgrades', color: '#4B8DE8', weight: 50, link: null },
      { name: '365 Entra & Identity Management', tooltip: 'Identity management', color: '#3B7DD8', weight: 40, link: null },
      { name: '365 Security, Compliance & Information Governance', tooltip: 'Data protection policies', color: '#2B6DC8', weight: 40, link: null },
      { name: '365 Copilot', tooltip: 'AI assistant', color: '#4B8DE8', weight: 0, link: null },
      { name: '365 Automation', tooltip: 'Power Platform workflows', color: '#3B7DD8', weight: 10, link: null },
    ]
  },
  {
    name: 'Support Level',
    tooltip: 'Tiered support services',
    description: 'Multi-level IT support from basic help desk to advanced technical support with guaranteed response times.',
    color: '#141414',
    // weight = 50 + 75 + 100 = 225
    subservices: [
      { name: 'Remote Support*', tooltip: 'Remote assistance', color: '#5A5A5A', weight: 50, link: null },
      { name: 'Onsite Support*', tooltip: 'On-location support', color: '#4A4A4A', weight: 75, link: null },
      { name: 'Fully Managed*', tooltip: 'Complete IT management', color: '#3A3A3A', weight: 100, link: null },
    ]
  },
  {
    name: 'Servers & Cloud',
    tooltip: 'Infrastructure management',
    description: 'Full-stack server and cloud infrastructure management including AWS, Azure, on-premise servers, and hybrid solutions.',
    color: '#6f1394',
    // weight = 70 + 40 + 25 + 20 = 155
    subservices: [
      { name: 'Patch & Monitor*', tooltip: 'System updates & monitoring', color: '#8B3D9E', weight: 70, link: null },
      { name: 'Managed Server Backup*', tooltip: 'Server backup solutions', color: '#7B2D8E', weight: 40, link: null },
      { name: 'Disaster Recovery & Testing', tooltip: 'DR planning & validation', color: '#6B1D7E', weight: 25, link: null },
      { name: 'Microsoft Azure', tooltip: 'Azure cloud services', color: '#8B3D9E', weight: 20, link: null },
    ]
  },
  {
    name: 'People & Communications',
    tooltip: 'Unified communications',
    description: 'Modern communication solutions including VoIP, video conferencing, and unified communications platforms.',
    color: '#bc6a13',
    // weight = 20 + 40 + 10 + 10 + 30 + 10 + 10 + 20 = 150
    subservices: [
      { name: 'Connectivity*', tooltip: 'Internet services', color: '#008B8B', weight: 20, link: null },
      { name: 'Managed Network*', tooltip: 'Network management', color: '#009B9B', weight: 40, link: null },
      { name: 'Computer Patching*', tooltip: 'System updates', color: '#007B7B', weight: 10, link: null },
      { name: 'Print Solutions', tooltip: 'Managed print services', color: '#008B8B', weight: 10, link: null },
      { name: 'Hosted Voice/VOIP*', tooltip: 'Cloud phone systems', color: '#009B9B', weight: 30, link: null },
      { name: 'Leasing & Rental', tooltip: 'Hardware leasing', color: '#007B7B', weight: 10, link: null },
      { name: 'Mobile Phone and SIM', tooltip: 'Mobile connectivity', color: '#008B8B', weight: 10, link: null },
      { name: 'Mobile Device Management', tooltip: 'MDM solutions', color: '#009B9B', weight: 20, link: null },
    ]
  },
  {
    name: 'Business Continuity',
    tooltip: 'Disaster recovery & backup',
    description: 'Ensure your business stays operational with comprehensive backup, disaster recovery, and business continuity planning.',
    color: '#193635',
    // weight = 30 + 40 + 20 + 25 + 10 = 125
    subservices: [
      { name: 'Domains & Hosting*', tooltip: 'Web hosting services', color: '#AB3D7E', weight: 30, link: null },
      { name: 'Endpoint Protection*', tooltip: 'Device security', color: '#9B2D6E', weight: 40, link: null },
      { name: 'Centrally Managed Email Signatures', tooltip: 'Email signature management', color: '#8B1D5E', weight: 20, link: null },
      { name: 'Device Encryption', tooltip: 'Data encryption', color: '#AB3D7E', weight: 25, link: null },
      { name: 'WordPress Patching', tooltip: 'CMS security updates', color: '#9B2D6E', weight: 10, link: null },
    ]
  },
  {
    name: 'Building Services',
    tooltip: 'Facilities IT infrastructure',
    description: 'Complete building IT infrastructure including networking, WiFi, access control, and smart building solutions.',
    color: '#1c3a11',
    // weight = 15 + 15 + 15 + 15 = 60
    subservices: [
      { name: 'Structured Cabling', tooltip: 'Network cabling', color: '#7B9E33', weight: 15, link: null },
      { name: 'WiFi Surveys & Installation', tooltip: 'Wireless solutions', color: '#6B8E23', weight: 15, link: null },
      { name: 'CCTV & Access Control', tooltip: 'Security systems', color: '#5B7E13', weight: 15, link: null },
      { name: 'Audio Visual', tooltip: 'AV solutions', color: '#7B9E33', weight: 15, link: null },
    ]
  },
];

// Calculate service weights as sum of subservice weights
seedData.forEach(service => {
  service.weight = service.subservices.reduce((sum, sub) => sum + sub.weight, 0);
});

// Clear existing data
db.prepare('DELETE FROM subservices').run();
db.prepare('DELETE FROM services').run();

// Insert seed data
const insertService = db.prepare(`
  INSERT INTO services (name, tooltip, description, color, weight, sort_order)
  VALUES (?, ?, ?, ?, ?, ?)
`);

const insertSubservice = db.prepare(`
  INSERT INTO subservices (service_id, name, tooltip, color, weight, link, sort_order)
  VALUES (?, ?, ?, ?, ?, ?, ?)
`);

seedData.forEach((service, idx) => {
  const result = insertService.run(
    service.name,
    service.tooltip,
    service.description,
    service.color,
    service.weight,
    idx
  );

  const serviceId = result.lastInsertRowid;

  service.subservices.forEach((sub, subIdx) => {
    insertSubservice.run(
      serviceId,
      sub.name,
      sub.tooltip,
      sub.color,
      sub.weight,
      sub.link,
      subIdx
    );
  });
});

console.log('Database seeded successfully with', seedData.length, 'services');
console.log('Service weights:', seedData.map(s => `${s.name}: ${s.weight}`).join(', '));
db.close();
