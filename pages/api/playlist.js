import { YouTube } from "youtube-sr";

export default async function handler (req, res){
    const {id} = req.query;
    if (!id) return res.json({ data: null });
    const entry = Date.now();
    const playlistData = await YouTube.getPlaylist(`https://youtube.com/playlist?list=${id}`, { fetchAll: true })
        .then((result) => result.toJSON())
        .catch((e) => null)
    return res.json({
        data: playlistData,
        time: Date.now() - entry
    })
}