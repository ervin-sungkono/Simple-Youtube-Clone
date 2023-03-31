import ytch from 'yt-channel-info'

export default async function handler(req, res){
    const {channelId, query} = req.query
    if(!channelId) return res.json({data: null})
    const entry = Date.now()
    const payload = {
        channelId: channelId,
        query: query
    }
    const searchResult = await ytch.searchChannel(payload)
        .then(videos => ({
            data: videos.items.filter(video => video.type === "video").map(video => ({
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
        data: searchResult.data,
        continuation: searchResult.continuation,
        time: Date.now() - entry
    })
}