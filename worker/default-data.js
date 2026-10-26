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
  { value: 'content/instagram-1.jpg', label: 'Instagram · Moving update' },
  { value: 'content/instagram-2.jpg', label: 'Instagram · Minecraft Dungeons II loadout' },
  { value: 'content/instagram-3.jpg', label: 'Instagram · New in Minecraft Dungeons II' },
  { value: 'content/tiktok-1.avif', label: 'TikTok · Minecraft Dungeons II loadout' },
  { value: 'content/tiktok-2.avif', label: 'TikTok · New in Minecraft Dungeons II' },
  { value: 'content/tiktok-3.avif', label: 'TikTok · LEGO Minecraft Chicken Mounts' },
  { value: 'content/youtube-1.jpg', label: 'YouTube · The Last Stand' },
  { value: 'content/youtube-2.jpg', label: 'YouTube · Festivale SMP day 4' },
  { value: 'content/youtube-3.jpg', label: 'YouTube · Bombanana with the besties' },
  { value: 'content/twitch-1.jpg', label: 'Twitch · Building my desk in the USA' },
  { value: 'content/twitch-2.jpg', label: 'Twitch · Last stream in the UK' },
  { value: 'content/twitch-3.jpg', label: 'Twitch · Festivaling with friends' },
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
        // Reel view counts supplied by the user on 26 October 2026.
        {
          id: 'instagram-1',
          title: 'an update on my big move!!! more to come soon :)',
          format: 'Reel · 3 Oct 2026',
          views: '66.2K',
          image: 'content/instagram-1.jpg',
        },
        {
          id: 'instagram-2',
          title: 'mix and match your perfect loadout in Minecraft Dungeons II, out NOW!',
          format: 'Reel · Ad · 1 Oct 2026',
          views: '20.2K',
          image: 'content/instagram-2.jpg',
        },
        {
          id: 'instagram-3',
          title: "find out everything that's NEW in Minecraft Dungeons II, out NOW!!",
          format: 'Reel · Ad · 30 Sep 2026',
          views: '23.4K',
          image: 'content/instagram-3.jpg',
        },
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
        {
          id: 'tiktok-1',
          title: 'mix and match your perfect loadout in Minecraft Dungeons II, out NOW!',
          format: 'Video · Ad',
          views: '2,540',
          image: 'content/tiktok-1.avif',
        },
        {
          id: 'tiktok-2',
          title: "find out everything that's NEW in Minecraft Dungeons II, out NOW!!",
          format: 'Video · Ad',
          views: '938',
          image: 'content/tiktok-2.avif',
        },
        {
          id: 'tiktok-3',
          title: 'Check out the LEGO Minecraft Chicken Mounts add-on on the Bedrock marketplace!',
          format: 'Video · Ad',
          views: '2,670',
          image: 'content/tiktok-3.avif',
        },
      ],
    },
    {
      id: 'youtube',
      name: 'YouTube',
      handle: '@bekyamonlive',
      icon: 'youtube',
      // Sum channel counts and take a simple mean of their audience percentages.
      followers: '41.4K',
      views90d: '989K',
      locations: [['United States', 36.5], ['United Kingdom', 25.5], ['South Africa', 10.5]],
      genders: [['Women', 48.5], ['Men', 49.5], ['Other', 2]],
      content: [
        {
          id: 'youtube-1',
          title: 'THE LAST STAND - MINECRAFT EVENT',
          format: 'VOD · 04:36:01',
          views: '2.8K',
          image: 'content/youtube-1.jpg',
        },
        {
          id: 'youtube-2',
          title: 'FESTIVALE SMP DAY 4 (KIND OF)',
          format: 'VOD · 03:30:25',
          views: '2.5K',
          image: 'content/youtube-2.jpg',
        },
        {
          id: 'youtube-3',
          title: 'BOMBANANA WITH THE BESTIES!!!',
          format: 'VOD · 01:54:48',
          views: '6.4K',
          image: 'content/youtube-3.jpg',
        },
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
        {
          id: 'twitch-1',
          title: 'I MADE IT TO THE USA!!!! BUILD MY DESK WITH ME',
          format: 'Stream · 01:50:00',
          views: '5.1K',
          image: 'content/twitch-1.jpg',
        },
        {
          id: 'twitch-2',
          title: 'MY LAST STREAM IN THE UK!!!',
          format: 'Stream · 01:46:30',
          views: '4.5K',
          image: 'content/twitch-2.jpg',
        },
        {
          id: 'twitch-3',
          title: 'FESTIVALING WITH MY FRIENDS PERHAPS',
          format: 'Stream · 02:16:38',
          views: '3.4K',
          image: 'content/twitch-3.jpg',
        },
      ],
    },
  ],
};

export function defaultLayout(slug = 'default', name = 'Default') {
  return {
    slug,
    name,
    bio: '',
    bioVisible: false,
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
