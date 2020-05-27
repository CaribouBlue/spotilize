export interface Grant {
  access_token: string,
  token_type: string,
  expires_in: number,
  expires_at: number,
  refresh_token: string,
  scope: string,
}

export interface Image {
  height: number | null,
  url: string,
  width: number | null
}

export interface User {
  display_name: string,
  external_urls: {
    spotify: string
  },
  followers: {
    href: null,
    total: number
  },
  href: string,
  id: string,
  images: Image[],
  type: string,
  uri: string,
}

export interface Playlist {
  collaborative: boolean,
  description: string,
  external_urls: {
    spotify: string,
  },
  followers: {
    href: null,
    total: number
  },
  href: string,
  id: string,
  images: Image[],
  name: string,
  owner: {
    display_name: string,
    external_urls: {
      spotify: string,
    },
    href: string,
    id: string,
    type: string,
    uri: string,
  },
  primary_color: null,
  public: boolean,
  snapshot_id: string,
  tracks: {
    href: string,
    items: PlaylistTrack[],
  }
  type: string,
  uri: string,
}

export interface PlaylistTrack {
  added_at: string,
  added_by: {
    external_urls: {
      spotify: string
    },
    href: string,
    id: string,
    type: string,
    uri: string,
  },
  is_local: boolean,
  primary_color: null,
  track: Track,
  video_thumbnail: {
    url: string | null,
  }
}

export interface Track {
  album: AlbumAbbrv,
  artists: [ArtistAbbrv],
  available_markets: [string],
  disc_number: number,
  duration_ms: number,
  episode: boolean,
  explicit: boolean,
  external_ids: {
    isrc: string,
  },
  external_urls: {
    spotify: string,
  },
  href: string,
  id: string,
  is_local: boolean,
  name: string,
  popularity: number,
  preview_url: string,
  track: boolean,
  track_number: number,
  type: string,
  uri: string,
}

export interface AlbumAbbrv {
  album_type: string,
  artists: [ArtistAbbrv],
  available_markets: [string],
  external_urls: {
    spotify: string,
  },
  href: string,
  id: string,
  images: Image[],
  name: string,
  release_date: string,
  release_date_precision: string,
  total_tracks: number,
  type: string,
  uri: string
}

export interface ArtistAbbrv {
  external_urls: {
    spotify: string
  },
  href: string,
  id: string,
  name: string,
  type: string,
  uri: string
}
