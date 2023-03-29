import { YouTube } from "youtube-sr"

export default async function handler(req, res){
    const entry = Date.now()
    const homepageData = await YouTube.homepage()
        .then(results => results.map(result => result.toJSON()))
        .catch(e => [])
    return res.json({
        data: homepageData,
        time: Date.now() - entry
    })
}