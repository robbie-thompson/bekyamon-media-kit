export const PLATFORM_IDS = ['instagram', 'tiktok', 'youtube', 'twitch'];

export const CONTENT_IMAGES = [
  { value: 'bekyamon-close.jpg', label: 'Close portrait' },
  { value: 'bekyamon-profile.jpg', label: 'Profile portrait' },
  { value: 'bekyamon-wide.jpg', label: 'Wide portrait' },
];

export const DEFAULT_DATA = {
  updatedLabel: 'July 2026',
  overview: {
    followers: '1.55M',
    avgViews: '1.08M',
    engagement: '8.3%',
  },
  platforms: [
    {
      id: 'instagram',
      name: 'Instagram',
      handle: '@bekyamon',
      icon: 'instagram',
      followers: '484K',
      avgViews: '318K',
      engagement: '7.8%',
      locations: [['United Kingdom', 48], ['United States', 22], ['Australia', 8]],
      genders: [['Women', 72], ['Men', 24], ['Other', 4]],
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
      followers: '728K',
      avgViews: '526K',
      engagement: '10.4%',
      locations: [['United Kingdom', 52], ['United States', 19], ['Ireland', 7]],
      genders: [['Women', 76], ['Men', 20], ['Other', 4]],
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
      followers: '211K',
      avgViews: '148K',
      engagement: '6.2%',
      locations: [['United Kingdom', 44], ['United States', 27], ['Canada', 9]],
      genders: [['Women', 69], ['Men', 26], ['Other', 5]],
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
      followers: '126K',
      avgViews: '92K',
      engagement: '9.1%',
      locations: [['United Kingdom', 46], ['United States', 25], ['Canada', 8]],
      genders: [['Women', 67], ['Men', 28], ['Other', 5]],
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
    overviewMetrics: { followers: true, avgViews: true, engagement: true },
    platformOrder: [...PLATFORM_IDS],
    platforms: Object.fromEntries(PLATFORM_IDS.map((id) => [id, {
      visible: true,
      handle: true,
      metrics: { followers: true, avgViews: true, engagement: true },
      locations: true,
      locationItems: {},
      genders: true,
      genderItems: {},
      content: true,
      contentItems: {},
    }])),
  };
}
