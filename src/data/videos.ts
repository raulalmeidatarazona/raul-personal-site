export interface ShortVideo {
  id: string;
  title: string;
  originalTitle: string;
  topic: string;
  summary: string;
  durationSeconds: number;
  featuredRank?: number;
}

// Editorial sequence, not upload order. Durations verified against YouTube metadata.
export const videos: ShortVideo[] = [
  {
    id: 'EJ5NpxJ_SGU',
    title: 'When your systems stop talking to each other.',
    originalTitle: 'Tu empresa tiene una plataforma digitalizada...o en realidad depende de un "ERP Frankenstein"?🧟‍♂️📊',
    topic: 'Integrations',
    summary: 'Disconnected tools, spreadsheets as glue, and the operational cost of keeping everything in sync by hand.',
    durationSeconds: 111,
  },
  {
    id: 'b7IqZczTcGI',
    title: 'The hidden cost of spreadsheet glue.',
    originalTitle: 'Tu Excel está MATANDO tu margen 💸',
    topic: 'Business operations',
    summary: 'A short introduction to the manual work and fragmented information that can quietly erode a business’s margin.',
    durationSeconds: 63,
  },
  {
    id: 'VnLj11LXxzo',
    title: 'Hiring is not always the next step.',
    originalTitle: '¡No contrates más gente sin ver esto primero!',
    topic: 'Bottlenecks',
    summary: 'Before adding people, check whether disconnected data and processes are creating the extra work.',
    durationSeconds: 88,
  },
  {
    id: 'GbBUQexIUrs',
    title: 'Old software is not a reason to rewrite.',
    originalTitle: 'No modernices un sistema solo porque es viejo',
    topic: 'Modernisation',
    summary: 'Start with the real constraint. Change a clear boundary, account for retries, and avoid turning an upgrade into a business risk.',
    durationSeconds: 151,
    featuredRank: 1,
  },
  {
    id: 'wnF2yn-QjWM',
    title: 'Can your operations handle the next demand spike?',
    originalTitle: '¿Tu e-commerce aguantará el Black Friday? 🛒⚡',
    topic: 'E-commerce reliability',
    summary: 'Orders, stock, the warehouse and delivery need to agree. A Black Friday example of keeping a promise to the customer.',
    durationSeconds: 114,
    featuredRank: 2,
  },
  {
    id: 'QD0J1roHq5o',
    title: '“We need AI.” Start with the problem.',
    originalTitle: 'Tenemos que meter IA en la empresa." 🤖',
    topic: 'AI & judgement',
    summary: 'AI is one possible tool, not a diagnosis. Understand the friction in the business before choosing what to introduce.',
    durationSeconds: 107,
    featuredRank: 3,
  },
];

export const featuredVideos = videos
  .filter(video => video.featuredRank !== undefined)
  .sort((a, b) => a.featuredRank! - b.featuredRank!);
