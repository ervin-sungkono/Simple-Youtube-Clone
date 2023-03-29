import { Card, CardMedia, Typography, Skeleton, Link, Grid, Box, Chip, CardActionArea} from '@mui/material'
import { Sensors } from '@mui/icons-material'
import abbrev from '../util/format'

export default function YoutubeCard2({video}){
    return(
        <Box sx={{width: '100%'}}>
            <Link href={video ? `/watch?id=${video.id}` : "#"} underline='none'>
                <CardActionArea sx={{borderRadius: 2}}>
                    <Card elevation={0}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={5}>
                                {video ?
                                <CardMedia
                                    sx={{ aspectRatio: '16 / 9', borderRadius: 2}}
                                    image={video.thumbnail.url}
                                    title={video.title}
                                />
                                :
                                <Skeleton variant="rounded" animation={"wave"} width={"100%"} height={360*9/16} sx={{aspectRatio: '16 / 9', marginBottom: 2}}/>}
                            </Grid>
                            <Grid item xs={12} sm={7}>
                                {video ?
                                    <>
                                        <Typography variant="subtitle2" component="div" 
                                            sx={{
                                            fontWeight: 700,
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                            display: "-webkit-box",
                                            WebkitLineClamp: "2",
                                            WebkitBoxOrient: "vertical",
                                            }}
                                        >
                                            {video.title}
                                        </Typography>
                                        <Typography variant="caption" component="div" color="text.secondary">
                                            {video.channel.name}
                                        </Typography>
                                        {video.uploadedAt ?
                                            <Typography variant="caption" component="div" color="text.secondary" sx={{display: 'flex', gap: '4px'}}>
                                                <span>{abbrev(video.views)} views</span>
                                                <span>•</span>
                                                <span>{video.uploadedAt}</span>
                                            </Typography> :
                                            <Chip label="LIVE" icon={<Sensors/>} sx={{cursor: 'pointer', backgroundColor: 'rgba(204, 0, 0, 0.9)', fontWeight: 'bold'}} size={"small"}/>
                                        }
                                    </>:
                                    <>
                                        <Skeleton animation={"wave"} />
                                        <Skeleton animation={"wave"} width="60%" />
                                    </>
                                }
                            </Grid>
                        </Grid>
                    </Card>
                </CardActionArea>
            </Link>
        </Box>
    )
}