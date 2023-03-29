import { YouTube } from "youtube-sr";

export default async function handler(req, res){
    const {id} = req.query;
    if (!id) return res.json({ data: null });
    const entry = Date.now();
    const videoData = await YouTube.getVideo(`https://youtube.com/watch?v=${id}`)
        .then(result => ({
            main: result,
            similar: result.videos
        }))
        .catch((e) => null)
    return res.json({
        data: videoData,
        time: Date.now() - entry
    })
}