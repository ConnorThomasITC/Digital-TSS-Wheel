const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const dbPath = process.env.DATABASE_PATH || './data/tss-wheel.db';
const db = new Database(dbPath);

const seedData = [
  {
    name: 'Cyber Security',
    tooltip: 'Comprehensive security solutions',
    description: 'Protect your business with advanced cyber security measures including threat detection, vulnerability assessments, and security audits.',
    color: '#FF6B6B',
    subservices: [
      { name: 'Threat Detection', tooltip: '24/7 monitoring', color: '#FF5252', weight: 30 },
      { name: 'Vulnerability Scanning', tooltip: 'Regular security audits', color: '#FF7B7B', weight: 25 },
      { name: 'Penetration Testing', tooltip: 'Identify weaknesses', color: '#FF9B9B', weight: 20 },
      { name: 'Security Training', tooltip: 'Employee education', color: '#FFBBBB', weight: 15 },
      { name: 'Compliance', tooltip: 'Regulatory adherence', color: '#FFDBDB', weight: 10 },
    ]
  },
  {
    name: 'M365',
    tooltip: 'Microsoft 365 expertise',
    description: 'Complete Microsoft 365 management including deployment, migration, optimization, and ongoing support for all M365 services.',
    color: '#4ECDC4',
    subservices: [
      { name: 'Exchange Online', tooltip: 'Email management', color: '#3EBDB4', weight: 25 },
      { name: 'SharePoint', tooltip: 'Collaboration platform', color: '#4ECDC4', weight: 20 },
      { name: 'Teams', tooltip: 'Communication hub', color: '#5EDDD4', weight: 30 },
      { name: 'OneDrive', tooltip: 'Cloud storage', color: '#6EEDE4', weight: 15 },
      { name: 'Security & Compliance', tooltip: 'Data protection', color: '#7EFDF4', weight: 10 },
    ]
  },
  {
    name: 'Support Level',
    tooltip: 'Tiered support services',
    description: 'Multi-level IT support from basic help desk to advanced technical support with guaranteed response times.',
    color: '#95E1D3',
    subservices: [
      { name: 'Level 1 - Help Desk', tooltip: 'First line support', color: '#85D1C3', weight: 40 },
      { name: 'Level 2 - Technical', tooltip: 'Advanced troubleshooting', color: '#95E1D3', weight: 35 },
      { name: 'Level 3 - Expert', tooltip: 'Specialist support', color: '#A5F1E3', weight: 25 },
    ]
  },
  {
    name: 'Servers & Cloud',
    tooltip: 'Infrastructure management',
    description: 'Full-stack server and cloud infrastructure management including AWS, Azure, on-premise servers, and hybrid solutions.',
    color: '#F38181',
    subservices: [
      { name: 'Azure', tooltip: 'Microsoft cloud platform', color: '#E37171', weight: 30 },
      { name: 'AWS', tooltip: 'Amazon cloud services', color: '#F38181', weight: 25 },
      { name: 'On-Premise Servers', tooltip: 'Local infrastructure', color: '#FF9191', weight: 20 },
      { name: 'Hybrid Cloud', tooltip: 'Best of both worlds', color: '#FFA1A1', weight: 15 },
      { name: 'Monitoring', tooltip: 'Performance tracking', color: '#FFB1B1', weight: 10 },
    ]
  },
  {
    name: 'Business Continuity',
    tooltip: 'Disaster recovery & backup',
    description: 'Ensure your business stays operational with comprehensive backup, disaster recovery, and business continuity planning.',
    color: '#AA96DA',
    subservices: [
      { name: 'Backup Solutions', tooltip: 'Automated backups', color: '#9A86CA', weight: 35 },
      { name: 'Disaster Recovery', tooltip: 'Quick restoration', color: '#AA96DA', weight: 30 },
      { name: 'High Availability', tooltip: 'Minimize downtime', color: '#BAA6EA', weight: 20 },
      { name: 'Testing & Planning', tooltip: 'Verify readiness', color: '#CAB6FA', weight: 15 },
    ]
  },
  {
    name: 'People & Communications',
    tooltip: 'Unified communications',
    description: 'Modern communication solutions including VoIP, video conferencing, and unified communications platforms.',
    color: '#FCBAD3',
    subservices: [
      { name: 'VoIP Systems', tooltip: 'Voice over IP', color: '#ECAAC3', weight: 30 },
      { name: 'Video Conferencing', tooltip: 'Virtual meetings', color: '#FCBAD3', weight: 25 },
      { name: 'Unified Messaging', tooltip: 'Centralized comms', color: '#FFCAE3', weight: 20 },
      { name: 'Collaboration Tools', tooltip: 'Team productivity', color: '#FFDAF3', weight: 25 },
    ]
  },
  {
    name: 'Building Services',
    tooltip: 'Facilities IT infrastructure',
    description: 'Complete building IT infrastructure including networking, WiFi, access control, and smart building solutions.',
    color: '#FFFFD2',
    subservices: [
      { name: 'Networking', tooltip: 'LAN/WAN setup', color: '#EFEFC2', weight: 30 },
      { name: 'WiFi Solutions', tooltip: 'Wireless coverage', color: '#FFFFD2', weight: 25 },
      { name: 'Access Control', tooltip: 'Security systems', color: '#FFFFE2', weight: 20 },
      { name: 'CCTV', tooltip: 'Surveillance', color: '#FFFFF2', weight: 15 },
      { name: 'Smart Building', tooltip: 'IoT integration', color: '#FFFFFB', weight: 10 },
    ]
  },
];

// Clear existing data
db.prepare('DELETE FROM subservices').run();
db.prepare('DELETE FROM services').run();

// Insert seed data
const insertService = db.prepare(`
  INSERT INTO services (name, tooltip, description, color, sort_order)
  VALUES (?, ?, ?, ?, ?)
`);

const insertSubservice = db.prepare(`
  INSERT INTO subservices (service_id, name, tooltip, color, weight, sort_order)
  VALUES (?, ?, ?, ?, ?, ?)
`);

seedData.forEach((service, idx) => {
  const result = insertService.run(
    service.name,
    service.tooltip,
    service.description,
    service.color,
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
      subIdx
    );
  });
});

console.log('Database seeded successfully with', seedData.length, 'services');
db.close();
