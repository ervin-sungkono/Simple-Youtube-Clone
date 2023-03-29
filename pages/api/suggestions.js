import YouTube from "youtube-sr"

export default async function handler(req, res){
    const query = req.query.query
    if (!query) return res.json({ data: [] })

    const entry = Date.now()
    const suggestResult = await YouTube.getSuggestions(query)
        .catch((e) => [])
    return res.json({
        data: suggestResult,
        time: Date.now() - entry
    })
}