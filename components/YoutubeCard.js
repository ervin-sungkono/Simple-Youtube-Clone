import { Sensors } from '@mui/icons-material'
import { Grid, Box, Card, CardMedia, Typography, Skeleton, Link, Chip, CardActionArea, Tooltip} from '@mui/material'
import abbrev from '../util/format'
import ImageWithFallback from './ImageWithFallback'

export default function YoutubeCard({video}){
    return(
        <Grid item xs={12} sm={6} md={4} xl={3}>
            <Link href={video ? `/watch?id=${video.id}` : "#"} underline='none'>
                <CardActionArea sx={{borderRadius: 2, pb: 2}}>
                    <Card elevation={0}>
                        {video ?
                        <CardMedia
                            sx={{ aspectRatio: '16 / 9', borderRadius: 2, marginBottom: 2 }}
                            image={video.thumbnail.url}
                            title={video.title}
                        />
                        :
                        <Skeleton variant="rounded" animation={"wave"} width={"100%"} height={360*9/16} sx={{aspectRatio: '16 / 9', marginBottom: 2}}/>}
                    <Box sx={{display: 'flex', gap: 2}}>
                        {video ?
                        <Tooltip title={`${video.channel.name}'s Channel`} arrow placement='top'>
                            <Link href={`/channel?id=${video.channel.id}`} sx={{zIndex: 999}}>
                                <ImageWithFallback
                                    src={video.channel.icon}
                                    fallbackSrc={"/static/default-profile-icon.jpg"}
                                    width={36} 
                                    height={36} 
                                    style={{objectFit: 'cover', borderRadius: '50%'}}
                                    alt=""
                                />
                            </Link>
                        </Tooltip>
                        :
                        <Skeleton variant="circular" animation={"wave"} width={36} height={36} />}
                        <Box sx={{flexGrow: 1}}>
                            {video ?
                                <>
                                    <Typography gutterBottom variant="subtitle2" component="div" 
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
                                    <Typography variant="body2" component="div" color="text.secondary">
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
                        </Box>
                    </Box>
                    </Card>
                </CardActionArea>
            </Link>
        </Grid>
    )
}