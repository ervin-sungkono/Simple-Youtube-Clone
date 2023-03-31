import ytch from 'yt-channel-info'

export default async function handler(req, res){
    const {channelId, sortBy} = req.query
    if(!channelId) return res.json({data: null})
    const entry = Date.now()
    const payload = {
        channelId: channelId,
        sortBy: sortBy,
    }
    const channelVideos = await ytch.getChannelVideos(payload)
        .then(res => {
            if(!res.alertMessage) return res
            else throw new Error('Channel could not be found.')
        })
        .then(videos => ({
            data: videos.items.map(video => ({
                id: video.videoId,
                title: video.title,
                channel: {
                    id: video.authorId,
                    name: video.author
                },
                thumbnail: {
                    url: video.videoThumbnails?.[video.videoThumbnails.length - 1].url
                },
                views: video.viewCount,
                uploadedAt: video.publishedText
            })),
            continuation: videos.continuation
        }))
        .catch(e => console.log(e))
    return res.json({
        data: channelVideos.data,
        continuation: channelVideos.continuation,
        time: Date.now() - entry
    })
}