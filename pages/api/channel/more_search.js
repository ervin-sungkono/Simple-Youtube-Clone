import ytch from 'yt-channel-info'

export default async function handler(req, res){
    const entry = Date.now()
    const payload = {
        continuation: req.query.continuation
    }
    const searchResult = await ytch.searchChannelMore(payload)
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