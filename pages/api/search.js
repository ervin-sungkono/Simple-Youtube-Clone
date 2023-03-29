import YouTube from "youtube-sr"

export default async function handler(req, res){
    const query = req.query.query
    if (!query) return res.json({ data: [] })

    const type = req.query.type
    const safeSearch = req.query.safeSearch

    const entry = Date.now()
    const searchResult = await YouTube.search(query, { type: type, safeSearch: safeSearch })
        .then((results) => results.map((result) => result.toJSON()))
        .catch((e) => [])
    return res.json({
        data: searchResult,
        time: Date.now() - entry
    })
}