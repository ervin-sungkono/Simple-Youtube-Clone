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
        .then(res => res)
        .catch(e => console.log(e))
    return res.json({
        data: searchResult,
        time: Date.now() - entry
    })
}