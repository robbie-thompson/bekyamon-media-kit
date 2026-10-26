export const PLATFORM_IDS = ['instagram', 'tiktok', 'youtube', 'twitch'];

// Share platform metric definitions between the editor, validation, and public page.
export const PLATFORM_METRICS = {
  instagram: [
    ['followers', 'Followers'],
    ['views90d', '90d views'],
    ['interactions90d', '90d interactions'],
  ],
  tiktok: [
    ['followers', 'Followers'],
    ['views90d', '90d views'],
    ['likes90d', '90d likes'],
  ],
  youtube: [
    ['followers', 'Subscribers'],
    ['views90d', '90d views'],
  ],
  twitch: [
    ['followers', 'Followers'],
    ['totalViews90d', '90d total views'],
    ['avgViewers90d', '90d avg. viewers'],
  ],
};

export const CONTENT_IMAGES = [
  { value: 'bekyamon-close.jpg', label: 'Close portrait' },
  { value: 'bekyamon-profile.jpg', label: 'Profile portrait' },
  { value: 'bekyamon-wide.jpg', label: 'Wide portrait' },
];

export const DEFAULT_DATA = {
  updatedLabel: 'October 2026',
  overview: {
    followers: '281.6K',
    // Sum 90-day views across all platforms, shown to two decimal places in millions.
    views90d: '2.35M',
    // Combine Instagram interactions and TikTok likes.
    engagement90d: '78.6K',
  },
  platforms: [
    {
      id: 'instagram',
      name: 'Instagram',
      handle: '@bekyamon',
      icon: 'instagram',
      followers: '32.2K',
      views90d: '997K',
      interactions90d: '75K',
      locations: [['United States', 30], ['United Kingdom', 25], ['Australia', 5]],
      genders: [['Women', 67], ['Men', 33]],
      content: [
        { id: 'instagram-1', title: 'A slow afternoon by the sea', format: 'Reel', views: '842K', image: 'bekyamon-close.jpg' },
        { id: 'instagram-2', title: 'Three ways I style summer', format: 'Carousel', views: '316K', image: 'bekyamon-profile.jpg' },
        { id: 'instagram-3', title: 'What I actually packed', format: 'Reel', views: '691K', image: 'bekyamon-wide.jpg' },
      ],
    },
    {
      id: 'tiktok',
      name: 'TikTok',
      handle: '@bekyamon',
      icon: 'music-2',
      followers: '69K',
      views90d: '35.5K',
      likes90d: '3.6K',
      locations: [['United Kingdom', 40], ['United States', 15], ['Australia', 4]],
      genders: [['Women', 66], ['Men', 30], ['Other', 4]],
      content: [
        { id: 'tiktok-1', title: 'POV: the outfit finally works', format: 'Video', views: '1.8M', image: 'bekyamon-profile.jpg' },
        { id: 'tiktok-2', title: 'Beach day reality check', format: 'Video', views: '934K', image: 'bekyamon-wide.jpg' },
        { id: 'tiktok-3', title: 'This changed my morning', format: 'Video', views: '712K', image: 'bekyamon-close.jpg' },
      ],
    },
    {
      id: 'youtube',
      name: 'YouTube',
      handle: 'Bekyamon',
      icon: 'youtube',
      // Sum channel counts and take a simple mean of their audience percentages.
      followers: '41.4K',
      views90d: '989K',
      locations: [['United States', 36.5], ['United Kingdom', 25.5], ['South Africa', 10.5]],
      genders: [['Women', 48.5], ['Men', 49.5], ['Other', 2]],
      content: [
        { id: 'youtube-1', title: 'A very honest summer reset', format: 'Vlog · 18:42', views: '284K', image: 'bekyamon-wide.jpg' },
        { id: 'youtube-2', title: 'Things I wish I knew sooner', format: 'Video · 14:08', views: '197K', image: 'bekyamon-close.jpg' },
        { id: 'youtube-3', title: 'Come away with me for 48 hours', format: 'Vlog · 22:16', views: '163K', image: 'bekyamon-profile.jpg' },
      ],
    },
    {
      id: 'twitch',
      name: 'Twitch',
      handle: 'bekyamon',
      icon: 'twitch',
      followers: '139K',
      totalViews90d: '333K',
      avgViewers90d: '301',
      locations: [['United Kingdom', 30], ['United States', 28], ['Canada', 4]],
      gendersLabel: 'Gender split (18–24)',
      // Normalize the 18–24 entries by their total of 52.17% of the full audience.
      genders: [['Women', 51.5], ['Men', 9.6], ['Unknown', 38.9]],
      content: [
        { id: 'twitch-1', title: 'Cosy games and a proper catch-up', format: 'Stream · 03:18:42', views: '156K', image: 'bekyamon-close.jpg' },
        { id: 'twitch-2', title: 'Chat chooses everything I do', format: 'Stream · 02:46:19', views: '121K', image: 'bekyamon-profile.jpg' },
        { id: 'twitch-3', title: 'Late-night community games', format: 'Stream · 04:02:07', views: '98K', image: 'bekyamon-wide.jpg' },
      ],
    },
  ],
};

export function defaultLayout(slug = 'default', name = 'Default') {
  return {
    slug,
    name,
    overviewVisible: true,
    overviewMetrics: { followers: true, views90d: true, engagement90d: true },
    platformOrder: [...PLATFORM_IDS],
    platforms: Object.fromEntries(PLATFORM_IDS.map((id) => [id, {
      visible: true,
      handle: true,
      metrics: Object.fromEntries(PLATFORM_METRICS[id].map(([key]) => [key, true])),
      locations: true,
      locationItems: {},
      genders: true,
      genderItems: {},
      content: true,
      contentItems: {},
    }])),
  };
}
