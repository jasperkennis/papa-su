/**
 * Gets the list of songs available on
 * https://music.youtube.com/playlist?list=PLe4etrkqQQuttD9tCh4610EaVoUvX5Rco
 */

import {google}  from 'googleapis'

const youtube = google.youtube({
  version: 'v3',
  auth: process.env.GOOGLE_CLOUD_YOUTUBE_API // specify your API key here
});

/**
 * Recursively get all the songs in the list
 *
 * @param {Array} results
 * @param {string} pageToken
 */
const getPlaylistItemIds = async (results = [], pageToken) => {
  const res = await youtube.playlistItems.list({
    part: 'id,contentDetails',
    playlistId: 'PLe4etrkqQQuttD9tCh4610EaVoUvX5Rco',
    pageToken
  });

  results = [...results, ...res.data.items]
  if (res.data.nextPageToken) {
    return getPlaylistItemIds(results, res.data.nextPageToken)
  }

  // console.log(results)

  return results.map(playlistItem => playlistItem.contentDetails.videoId)
};


/**
 * Get the datails of each song.
 * @param {Array} ids
 */
const getPlaylistSongs = async (results = [], pageToken, ids) => {
  const res = await youtube.videos.list({
    part: 'snippet',
    id: ids.join(','),
    pageToken
  });

  results = [...results, ...res.data.items]
  if (res.data.nextPageToken) {
    return getPlaylistSongs(results, res.data.nextPageToken, ids)
  }

  console.log(results)
  return results.map((video) => {
    return {
      id: video.id,
      title: video.snippet.title,
      channelTitle: video.snippet.channelTitle,
      description: video.snippet.description,
      thumbnailUrl: video.snippet.thumbnails.standard.url,
    }
  })
}

export default async (req, res) => {
  const playlistItemIds = await getPlaylistItemIds().catch(console.error);
  const playlistSongs = await getPlaylistSongs([], null, playlistItemIds)
  res.status(200).json(playlistSongs)
}
