import ytch from 'yt-channel-info'

export default async function handler(req, res){
    const entry = Date.now()
    const payload = {
        continuation: req.query.continuation
    }
    const channelVideos = await ytch.getChannelVideos(payload)
        .then(res => res)
        .catch(e => console.log(e))
    return res.json({
        data: channelVideos,
        time: Date.now() - entry
    })
}