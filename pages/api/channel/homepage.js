import ytch from 'yt-channel-info'

export default async function handler(req, res){
    const {channelId} = req.query
    if(!channelId) return res.json({data: null})
    const entry = Date.now()
    const payload = {
        channelId: channelId,
    }
    const channelHomeData = await ytch.getChannelHome(payload)
        .then(res => res)
        .catch(e => console.log(e))
    return res.json({
        data: channelHomeData,
        time: Date.now() - entry
    })
}