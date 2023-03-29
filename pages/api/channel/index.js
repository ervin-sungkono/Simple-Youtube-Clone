import ytch from 'yt-channel-info'

export default async function handler(req, res){
    const {channelId} = req.query
    if(!channelId) return res.json({data: null})
    const entry = Date.now()
    const payload = {
        channelId: channelId,
    }
    const channelInfo = await ytch.getChannelInfo(payload)
        .then(res => {
            if(!res.alertMessage) return res
            else throw new Error('Channel could not be found.')
        })
        .catch(e => console.log(e))
    return res.json({
        data: channelInfo,
        time: Date.now() - entry
    })
}