import { MockQuestion, MockTest } from '../types';

export const initialMockQuestions: MockQuestion[] = [
  {
    id: 'q-pib-01',
    articleId: 'pib-2025-01',
    articleTitle: 'Cabinet approves National Mission on Critical Minerals',
    gsPaper: 'GS-3',
    topic: 'Mineral Resources & Policy',
    questionType: 'statement_based',
    questionText: 'With reference to the Mines and Minerals (Development and Regulation) Amendment Act, 2023 and Critical Minerals in India, consider the following statements:\n1. Lithium and Beryllium were omitted from the list of atomic minerals to allow private commercial exploration and auction.\n2. The holder of an exploration license for deep-seated minerals automatically acquires the mining lease upon successful mineral discovery.\n3. The Central Government has exclusive powers to auction mining leases and composite licenses for specified critical and strategic minerals.',
    statements: [
      '1. Lithium and Beryllium were omitted from the list of atomic minerals to allow private commercial exploration and auction.',
      '2. The holder of an exploration license for deep-seated minerals automatically acquires the mining lease upon successful mineral discovery.',
      '3. The Central Government has exclusive powers to auction mining leases and composite licenses for specified critical and strategic minerals.'
    ],
    options: [
      { id: 'A', text: '1 and 2 only' },
      { id: 'B', text: '1 and 3 only' },
      { id: 'C', text: '2 and 3 only' },
      { id: 'D', text: '1, 2 and 3' }
    ],
    correctAnswer: 'B',
    explanation: 'Statement 1 is correct: The MMDR Amendment Act, 2023 removed 6 minerals (including Lithium, Beryllium, Titanium, Niobium, Tantalum, Zirconium) from the list of atomic minerals, thereby allowing private entities to explore and mine them.\nStatement 2 is incorrect: An exploration license holder does NOT automatically receive a mining lease. Upon successful reconnaissance/exploration, the state government auctions the mining lease, and the exploration license holder receives a share of the auction premium.\nStatement 3 is correct: The 2023 amendment explicitly empowered the Central Government to exclusively conduct auctions for composite licenses and mining leases for 24 critical and strategic minerals, though revenue continues to accrue to the concerned State governments.',
    prelimsTip: 'Eliminate absolute claims regarding "automatic acquisition of mining rights" in mineral regulatory regimes.',
    difficulty: 'UPSC Standard'
  },
  {
    id: 'q-pib-02',
    articleId: 'pib-2025-02',
    articleTitle: 'MoEFCC Wetlands Conservation Rules & Ramsar Sites',
    gsPaper: 'GS-3',
    topic: 'Environment & Biodiversity',
    questionType: 'statement_based',
    questionText: 'With reference to the Wetlands (Conservation and Management) Rules, 2017 in India, consider the following statements:\n1. The Rules apply to natural wetlands as well as river channels and agricultural paddy fields.\n2. State Wetland Authorities are empowered to identify and notify wetlands within their respective territories.\n3. Conversion of wetland for non-wetland uses is strictly prohibited within the zone of influence.',
    statements: [
      '1. The Rules apply to natural wetlands as well as river channels and agricultural paddy fields.',
      '2. State Wetland Authorities are empowered to identify and notify wetlands within their respective territories.',
      '3. Conversion of wetland for non-wetland uses is strictly prohibited within the zone of influence.'
    ],
    options: [
      { id: 'A', text: '1 only' },
      { id: 'B', text: '2 and 3 only' },
      { id: 'C', text: '1 and 3 only' },
      { id: 'D', text: '1, 2 and 3' }
    ],
    correctAnswer: 'B',
    explanation: 'Statement 1 is incorrect: Under Rule 2(b) of the Wetlands (Conservation and Management) Rules 2017, wetlands do NOT include river channels, paddy fields, human-made water bodies constructed for drinking water, aquaculture, salt production, and recreation.\nStatements 2 & 3 are correct: The 2017 Rules decentralized wetland conservation by constituting State Wetland Authorities (SWAs) headed by the State Environment Minister. Prohibition is enforced on reclaiming, converting, and discharging untreated effluents into notified wetlands.',
    prelimsTip: 'UPSC has previously asked about exclusions in Environmental notifications. River channels and paddy fields are standard statutory exclusions in Wetland Rules.',
    difficulty: 'Tricky'
  },
  {
    id: 'q-pib-03',
    articleId: 'pib-2025-03',
    articleTitle: 'PM-PRANAM Operational Guidelines',
    gsPaper: 'GS-3',
    topic: 'Agriculture & Farm Subsidies',
    questionType: 'statement_based',
    questionText: 'Regarding the PM-PRANAM scheme launched by the Government of India, consider the following statements:\n1. It has a separate budgetary allocation under the Union Budget to distribute cash incentives directly to small and marginal farmers.\n2. 50% of the fertilizer subsidy saved by a State is returned to that State as a grant.\n3. A minimum of 70% of the grant provided to States under the scheme must be utilized for asset creation related to alternative fertilizers and organic manures.',
    statements: [
      '1. It has a separate budgetary allocation under the Union Budget to distribute cash incentives directly to small and marginal farmers.',
      '2. 50% of the fertilizer subsidy saved by a State is returned to that State as a grant.',
      '3. A minimum of 70% of the grant provided to States under the scheme must be utilized for asset creation related to alternative fertilizers and organic manures.'
    ],
    options: [
      { id: 'A', text: '1 and 2 only' },
      { id: 'B', text: '2 and 3 only' },
      { id: 'C', text: '3 only' },
      { id: 'D', text: '1, 2 and 3' }
    ],
    correctAnswer: 'B',
    explanation: 'Statement 1 is incorrect: PM-PRANAM has NO separate budget allocation. It is financed entirely by savings generated by States through reduced consumption of chemical fertilizers.\nStatements 2 & 3 are correct: 50% of the saved central subsidy is granted to the State. Out of this grant, at least 70% must be deployed for capital asset creation (e.g. bio-fertilizer production infrastructure at panchayat/block levels), while 30% can be used to incentivize farmers, panchayats, and SHGs promoting soil rejuvenation.',
    prelimsTip: 'Whenever a scheme is heralded as non-budgetary or based on efficiency savings, UPSC tests if candidates confuse it with DBT or direct fiscal grants.',
    difficulty: 'UPSC Standard'
  },
  {
    id: 'q-pib-04',
    articleId: 'pib-2025-04',
    articleTitle: 'Implementation of PESA Act, 1996 in Fifth Schedule Areas',
    gsPaper: 'GS-2',
    topic: 'Polity & Tribal Self-Governance',
    questionType: 'pair_matching',
    questionText: 'Under the Provisions of the Panchayats (Extension to the Scheduled Areas) Act, 1996 (PESA), consider the following powers vested in the Gram Sabha:\n1. Mandatory prior consent for acquisition of land for development projects.\n2. Mandatory prior recommendation for granting prospecting license or mining lease for minor minerals.\n3. Ownership of Minor Forest Produce.\n\nHow many of the above statements are correct?',
    statements: [
      '1. Mandatory prior consent for acquisition of land for development projects.',
      '2. Mandatory prior recommendation for granting prospecting license or mining lease for minor minerals.',
      '3. Ownership of Minor Forest Produce.'
    ],
    options: [
      { id: 'A', text: 'Only one' },
      { id: 'B', text: 'Only two' },
      { id: 'C', text: 'All three' },
      { id: 'D', text: 'None' }
    ],
    correctAnswer: 'B',
    explanation: 'Statement 1 is incorrect: Section 4(i) of PESA stipulates that the Gram Sabha or the Panchayats at the appropriate level shall be "consulted" before making the acquisition of land in Scheduled Areas for development projects; it requires "prior consultation", NOT mandatory "prior consent". (Mandatory consent applies under FRA 2006 and LARR Act 2013).\nStatement 2 is correct: Section 4(k) mandates the prior recommendation of the Gram Sabha for granting prospecting license or mining lease for minor minerals in Scheduled Areas.\nStatement 3 is correct: Section 4(m)(ii) explicitly endows Gram Sabhas and Panchayats with ownership of minor forest produce (MFP).\nTherefore, exactly two statements are correct.',
    prelimsTip: 'Note the recent UPSC pattern shift from combination options (1, 2 only) to count options (Only one, Only two, All three, None). Exact statutory wordings like "consultation" vs "consent" are prime elimination grounds.',
    difficulty: 'Tricky'
  },
  {
    id: 'q-pib-05',
    articleId: 'pib-2025-07',
    articleTitle: '16th Finance Commission Terms of Reference',
    gsPaper: 'GS-2',
    topic: 'Constitutional Bodies & Fiscal Federalism',
    questionType: 'statement_based',
    questionText: 'With reference to the Finance Commission of India, consider the following statements:\n1. The qualifications of the Chairman and members of the Finance Commission are specified in Article 280 of the Constitution.\n2. Cesses and surcharges levied by the Union are excluded from the divisible tax pool devolved to States.\n3. The recommendations made by the Finance Commission are binding on the Union Government once placed before Parliament.',
    statements: [
      '1. The qualifications of the Chairman and members of the Finance Commission are specified in Article 280 of the Constitution.',
      '2. Cesses and surcharges levied by the Union are excluded from the divisible tax pool devolved to States.',
      '3. The recommendations made by the Finance Commission are binding on the Union Government once placed before Parliament.'
    ],
    options: [
      { id: 'A', text: '1 and 2 only' },
      { id: 'B', text: '2 only' },
      { id: 'C', text: '1 and 3 only' },
      { id: 'D', text: '2 and 3 only' }
    ],
    correctAnswer: 'B',
    explanation: 'Statement 1 is incorrect: Article 280(2) empowers Parliament to determine by law the qualifications requisite for appointment as members. Parliament enacted the Finance Commission (Miscellaneous Provisions) Act, 1951 to specify these qualifications, they are not listed in Article 280 itself.\nStatement 2 is correct: Under Article 271, cesses and surcharges levied by the Union for specific purposes do not form part of the divisible tax pool shared with the States under Article 270.\nStatement 3 is incorrect: The recommendations made by the Finance Commission are of an advisory nature only and are not binding on the Union Government.',
    prelimsTip: 'Always differentiate between Constitutional mandates vs Statutory enactments (Parliament by law).',
    difficulty: 'UPSC Standard'
  },
  {
    id: 'q-pib-06',
    articleId: 'pib-2025-08',
    articleTitle: 'National Green Hydrogen Mission',
    gsPaper: 'GS-3',
    topic: 'Science & Environment',
    questionType: 'statement_based',
    questionText: 'Consider the following statements regarding the National Green Hydrogen Mission and Green Hydrogen standards:\n1. Green Hydrogen is produced through electrolysis of water powered by renewable electricity sources.\n2. India\'s national standard specifies that non-biogenic greenhouse gas emissions must not exceed 2 kg CO2 equivalent per kg of H2 produced.\n3. The Strategic Interventions for Green Hydrogen Transition (SIGHT) programme is implemented by the Indian Renewable Energy Development Agency (IREDA).',
    statements: [
      '1. Green Hydrogen is produced through electrolysis of water powered by renewable electricity sources.',
      '2. India\'s national standard specifies that non-biogenic greenhouse gas emissions must not exceed 2 kg CO2 equivalent per kg of H2 produced.',
      '3. The Strategic Interventions for Green Hydrogen Transition (SIGHT) programme is implemented by the Indian Renewable Energy Development Agency (IREDA).'
    ],
    options: [
      { id: 'A', text: '1 only' },
      { id: 'B', text: '1 and 2 only' },
      { id: 'C', text: '2 and 3 only' },
      { id: 'D', text: '1, 2 and 3' }
    ],
    correctAnswer: 'B',
    explanation: 'Statements 1 & 2 are correct: Green Hydrogen is defined as hydrogen produced through electrolysis of water powered by renewable energy or biomass. The Ministry of New and Renewable Energy (MNRE) notified India\'s Green Hydrogen Standard defining it with a well-to-gate emission cap of not exceeding 2 kg CO2 equivalent per kg H2 taken as an average over 12 months.\nStatement 3 is incorrect: The Solar Energy Corporation of India (SECI) is the designated implementing agency for both Component I (Electrolyser manufacturing) and Component II (Green Hydrogen production) under the SIGHT programme, not IREDA.',
    prelimsTip: 'Pay special attention to Nodal Implementing Agencies (SECI vs IREDA vs BEE). UPSC routinely tests institutional swaps.',
    difficulty: 'UPSC Standard'
  }
];

export const initialMockTests: MockTest[] = [
  {
    id: 'test-pib-prelims-01',
    title: 'PIB High-Yield Prelims Test - Economy & Environment Special',
    description: 'High-probability UPSC GS Paper 1 questions drawn directly from latest Cabinet decisions, MoEFCC notifications, and Ministry of Mines policies.',
    sourceArticleIds: ['pib-2025-01', 'pib-2025-02', 'pib-2025-03', 'pib-2025-04', 'pib-2025-07', 'pib-2025-08'],
    questions: initialMockQuestions,
    durationMinutes: 15,
    totalMarks: 12,
    createdAt: '2025-02-25'
  }
];
