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
        .catch(e => console.log(e))
    return res.json({
        data: channelVideos,
        time: Date.now() - entry
    })
}