export type ActorOrigin = 'RU' | 'KP' | 'CN' | 'IR' | 'Unknown';

export interface ThreatActorRecord {
  id: string;
  name: string;
  aliases: string[];
  origin: ActorOrigin;
  originLabel: string;
  sectors: string[];
  malware: string[];
  mitreIds: string[];
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  active: boolean;
  summary: string;
}

export interface CveRecord {
  id: string;
  cvss: number;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  product: string;
  vendor: string;
  publishedAt: string;
  exploited: boolean;
  mitigation: string;
  summary: string;
}

export type IocVerdict = 'malicious' | 'suspicious' | 'clean' | 'unknown';

export interface IocReputationRecord {
  value: string;
  type: 'ip' | 'hash' | 'domain' | 'url' | 'cve';
  verdict: IocVerdict;
  confidence: number;
  sources: string[];
  actor?: string;
  malware?: string;
  firstSeen: string;
  notes: string;
}

export interface FeedIntegration {
  id: string;
  name: string;
  category: string;
  status: 'connected' | 'degraded' | 'disconnected';
  lastSync: string;
  items24h: number;
  description: string;
}

export const THREAT_ACTORS: ThreatActorRecord[] = [
  {
    id: 'apt29',
    name: 'APT29',
    aliases: ['Cozy Bear', 'The Dukes'],
    origin: 'RU',
    originLabel: 'Russia',
    sectors: ['Government', 'Diplomatic', 'Think tanks'],
    malware: ['WellMess', 'MiniDuke', 'SUNBURST'],
    mitreIds: ['G0016', 'T1071', 'T1195'],
    severity: 'CRITICAL',
    active: true,
    summary: 'Long-running espionage cluster associated with cloud identity abuse and supply-chain staging.',
  },
  {
    id: 'lazarus',
    name: 'Lazarus Group',
    aliases: ['HIDDEN COBRA', 'Labyrinth Chollima'],
    origin: 'KP',
    originLabel: 'North Korea',
    sectors: ['Financial', 'Cryptocurrency', 'Defense'],
    malware: ['BLINDINGCAN', 'AppleJeus', 'Dtrack'],
    mitreIds: ['G0032', 'T1566', 'T1486'],
    severity: 'CRITICAL',
    active: true,
    summary: 'Financially motivated and destructive operations spanning SWIFT, exchanges, and wipers.',
  },
  {
    id: 'apt28',
    name: 'APT28',
    aliases: ['Fancy Bear', 'Sofacy'],
    origin: 'RU',
    originLabel: 'Russia',
    sectors: ['Military', 'NATO', 'Media'],
    malware: ['X-Agent', 'Zebrocy', 'GAMEFISH'],
    mitreIds: ['G0007', 'T1588', 'T1059'],
    severity: 'HIGH',
    active: true,
    summary: 'Credential harvesting and strategic leak operations against political and military targets.',
  },
  {
    id: 'sandworm',
    name: 'Sandworm',
    aliases: ['Voodoo Bear', 'ELECTRUM'],
    origin: 'RU',
    originLabel: 'Russia',
    sectors: ['Energy', 'ICS', 'Telecommunications'],
    malware: ['Industroyer', 'BlackEnergy', 'CaddyWiper'],
    mitreIds: ['G0034', 'T0816', 'T0826'],
    severity: 'CRITICAL',
    active: true,
    summary: 'ICS-capable actor with documented disruptive operations against energy infrastructure.',
  },
  {
    id: 'kimsuky',
    name: 'Kimsuky',
    aliases: ['Velvet Chollima', 'Thallium'],
    origin: 'KP',
    originLabel: 'North Korea',
    sectors: ['Think tanks', 'Nuclear policy', 'Academia'],
    malware: ['AppleSeed', 'BabyShark', 'KGH_SPY'],
    mitreIds: ['G0094', 'T1566.001', 'T1056'],
    severity: 'HIGH',
    active: true,
    summary: 'Spearphishing and document-based collection focused on policy and research communities.',
  },
  {
    id: 'lockbit',
    name: 'LockBit',
    aliases: ['LockBit 3.0', 'LockBit Black'],
    origin: 'Unknown',
    originLabel: 'Unknown / RaaS',
    sectors: ['Healthcare', 'Manufacturing', 'Legal'],
    malware: ['LockBit 3.0', 'StealBit'],
    mitreIds: ['G1072', 'T1486', 'T1490'],
    severity: 'HIGH',
    active: true,
    summary: 'Ransomware-as-a-service affiliate model with double-extortion leak sites.',
  },
];

export const CVE_FEED: CveRecord[] = [
  {
    id: 'CVE-2024-3400',
    cvss: 10.0,
    severity: 'CRITICAL',
    product: 'PAN-OS GlobalProtect',
    vendor: 'Palo Alto Networks',
    publishedAt: '2024-04-12T00:00:00.000Z',
    exploited: true,
    mitigation: 'Upgrade to hotfixed PAN-OS; restrict GlobalProtect portal exposure.',
    summary: 'Command injection in GlobalProtect gateway enabling unauthenticated remote code execution.',
  },
  {
    id: 'CVE-2024-21887',
    cvss: 9.1,
    severity: 'CRITICAL',
    product: 'Ivanti Connect Secure',
    vendor: 'Ivanti',
    publishedAt: '2024-01-10T00:00:00.000Z',
    exploited: true,
    mitigation: 'Apply vendor mitigation XML and subsequent patches; rotate credentials.',
    summary: 'Command injection chained with authentication bypass in SSL VPN appliances.',
  },
  {
    id: 'CVE-2024-1709',
    cvss: 10.0,
    severity: 'CRITICAL',
    product: 'ConnectWise ScreenConnect',
    vendor: 'ConnectWise',
    publishedAt: '2024-02-19T00:00:00.000Z',
    exploited: true,
    mitigation: 'Upgrade ScreenConnect to 23.9.8 or later immediately.',
    summary: 'Authentication bypass allowing remote compromise of on-prem ScreenConnect servers.',
  },
  {
    id: 'CVE-2023-38831',
    cvss: 7.8,
    severity: 'HIGH',
    product: 'WinRAR',
    vendor: 'RARLAB',
    publishedAt: '2023-08-23T00:00:00.000Z',
    exploited: true,
    mitigation: 'Update WinRAR to 6.23+; block inbound archives from untrusted mail.',
    summary: 'Crafted archive exploitation used in spearphishing lures.',
  },
  {
    id: 'CVE-2024-21412',
    cvss: 8.1,
    severity: 'HIGH',
    product: 'Internet Shortcut Files',
    vendor: 'Microsoft',
    publishedAt: '2024-02-13T00:00:00.000Z',
    exploited: false,
    mitigation: 'Apply February 2024 security updates; SmartScreen enforcement.',
    summary: 'Security feature bypass affecting internet shortcut handling.',
  },
  {
    id: 'CVE-2024-3094',
    cvss: 10.0,
    severity: 'CRITICAL',
    product: 'XZ Utils 5.6.0/5.6.1',
    vendor: 'Tukaani',
    publishedAt: '2024-03-29T00:00:00.000Z',
    exploited: false,
    mitigation: 'Downgrade to 5.4.x; verify package integrity in CI supply chain.',
    summary: 'Supply-chain backdoor in liblzma with SSH-adjacent impact.',
  },
];

export const IOC_REPUTATION: IocReputationRecord[] = [
  {
    value: '203.0.113.45',
    type: 'ip',
    verdict: 'malicious',
    confidence: 92,
    sources: ['AbuseIPDB', 'Internal Sensor', 'OTX'],
    actor: 'Unknown scanner cluster',
    malware: undefined,
    firstSeen: '2026-09-01T08:00:00.000Z',
    notes: 'DOCUMENTATION RANGE used in lab VPN brute-force scenario. Treat as demonstration IOC.',
  },
  {
    value: '203.0.113.46',
    type: 'ip',
    verdict: 'suspicious',
    confidence: 74,
    sources: ['Internal Sensor'],
    firstSeen: '2026-09-01T08:05:00.000Z',
    notes: 'Sibling address in the same scanning burst against corporate VPN endpoints.',
  },
  {
    value: 'http://phish.example/login',
    type: 'url',
    verdict: 'malicious',
    confidence: 88,
    sources: ['Open-source reports', 'MISP'],
    malware: 'Credential harvester',
    firstSeen: '2026-09-02T10:45:00.000Z',
    notes: 'Brand-impersonation login page used in the laboratory phishing awareness actuality.',
  },
  {
    value: 'phish.example',
    type: 'domain',
    verdict: 'malicious',
    confidence: 86,
    sources: ['OTX', 'MISP'],
    firstSeen: '2026-09-02T10:45:00.000Z',
    notes: 'Parent domain of the credential-harvesting lure.',
  },
  {
    value: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    type: 'hash',
    verdict: 'clean',
    confidence: 99,
    sources: ['VirusTotal'],
    firstSeen: '2026-01-01T00:00:00.000Z',
    notes: 'SHA-256 of empty file. Control hash for analyzer regression checks.',
  },
  {
    value: 'CVE-2024-3400',
    type: 'cve',
    verdict: 'malicious',
    confidence: 95,
    sources: ['NVD', 'CISA KEV'],
    firstSeen: '2024-04-12T00:00:00.000Z',
    notes: 'Actively exploited PAN-OS GlobalProtect gateway issue. Map to perimeter assets.',
  },
];

export const FEED_INTEGRATIONS: FeedIntegration[] = [
  {
    id: 'virustotal',
    name: 'VirusTotal',
    category: 'File / URL reputation',
    status: 'connected',
    lastSync: '2026-09-05T08:42:00.000Z',
    items24h: 1842,
    description: 'Hash and URL enrichment for malware family clustering.',
  },
  {
    id: 'otx',
    name: 'AlienVault OTX',
    category: 'Open threat exchange',
    status: 'connected',
    lastSync: '2026-09-05T08:40:00.000Z',
    items24h: 640,
    description: 'Pulse subscriptions for IP, domain, and CVE indicators.',
  },
  {
    id: 'abuseipdb',
    name: 'AbuseIPDB',
    category: 'IP reputation',
    status: 'degraded',
    lastSync: '2026-09-05T07:11:00.000Z',
    items24h: 210,
    description: 'Rate-limited lookups for scanner and brute-force source IPs.',
  },
  {
    id: 'misp',
    name: 'MISP',
    category: 'Internal sharing',
    status: 'connected',
    lastSync: '2026-09-05T08:55:00.000Z',
    items24h: 96,
    description: 'Lab event sync for published actualities and IOC objects.',
  },
  {
    id: 'taxii',
    name: 'TAXII 2.1',
    category: 'STIX collections',
    status: 'disconnected',
    lastSync: '2026-09-03T16:00:00.000Z',
    items24h: 0,
    description: 'Upstream collection endpoint awaiting credential rotation.',
  },
];

export function lookupIoc(query: string): IocReputationRecord | null {
  const q = query.trim().toLowerCase();
  if (!q) return null;
  return (
    IOC_REPUTATION.find((row) => row.value.toLowerCase() === q) ||
    IOC_REPUTATION.find((row) => row.value.toLowerCase().includes(q)) ||
    null
  );
}
