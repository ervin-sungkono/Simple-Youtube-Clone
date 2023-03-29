import ytch from 'yt-channel-info'

export default async function handler(req, res){
    const entry = Date.now()
    const payload = {
        continuation: req.query.continuation
    }
    const searchResult = await ytch.searchChannelMore(payload)
        .then(res => res)
        .catch(e => console.log(e))
    return res.json({
        data: searchResult,
        time: Date.now() - entry
    })
}