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

}
