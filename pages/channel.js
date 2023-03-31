import { Avatar, Box, Button, Link, Typography, Grid, CircularProgress, Divider } from '@mui/material'
import ImageWithFallback from '../components/ImageWithFallback'
import InfiniteScroll from 'react-infinite-scroll-component'
import { useEffect, useState } from 'react'
import useLoading from '../util/use-loading'
import useLocalStorage from '../util/use-local-storage'
import moment from 'moment/moment'
import parser from 'html-react-parser'

import YoutubeCard from '../components/YoutubeCard'
import BasicTab from '../components/BasicTab'

export default function Home({channelInfo, videosData, statsData, continuationId, actualTime, totalTime}) {
    console.log(`Time taken(channel): ${actualTime}ms (saved ${totalTime - actualTime}ms with Promise.all())`)
    console.log(statsData)
    // console.log(channelInfo, videosData)
    const isLoading = useLoading()
    const [isSubscribed, setSubscribed] = useState(false)
    const [channels, setChannels] = useLocalStorage("channels", [])
    const [moreVideos, setMoreVideos] = useState([])
    const [hasMore, setHasMore] = useState(false)
    const [continuation, setContinuation] = useState(continuationId)

    useEffect(() => {
        if(channels.find(channel => channel.id === channelInfo.authorId)) setSubscribed(true)
        else setSubscribed(false)
    }, [channels])

    const handleSubscription = () => {
        if(!isSubscribed){ 
            const newChannel = {
                id: channelInfo.authorId,
                name: channelInfo.author,
                icon: channelInfo.authorThumbnails?.[0].url ?? ""
            }
            setChannels([...channels, newChannel])
        }else{
            const newChannels = channels.filter(channel => channel.id !== channelInfo.authorId)
            setChannels(newChannels)
        }
    }

    const fetchMoreVideos = async() => {
        // if(continuation === null){
        //     setHasMore(false)
        //     return
        // }
        // await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/channel/more_videos?continuation=${continuation}`)
        //     .then(res => res.json())
        //     .then(videos => {
        //         setMoreVideos(videos.data)
        //         setContinuation(videos.continuation)
        //     })
    }

    const channelLinks = [
        {
            label: "Home",
            component: 
                <InfiniteScroll
                    dataLength={videosData.length}
                    next={fetchMoreVideos}
                    hasMore={hasMore}
                    loader={
                        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                            <CircularProgress disableShrink/>
                        </Box>
                    }
                    endMessage={
                        <Typography textAlign={'center'} marginTop={2} color={'text.secondary'}>
                            Yay! You have seen it all
                        </Typography>
                    }
                >
                    <Grid container rowSpacing={4} columnSpacing={2}>
                        {(isLoading ? Array.from(new Array(9)) : [...videosData, ...moreVideos]).map((video, index) => (
                            <YoutubeCard video={video} isChannel key={video?.id ?? index}/>
                        ))}
                    </Grid>
                </InfiniteScroll>
        },
        {
            label: "About",
            component: 
            <Box width={"100%"}>
                <Typography gutterBottom variant='subtitle2' fontWeight={"bold"}>
                    Description
                </Typography>
                <Typography gutterBottom variant='body2' color={'text.secondary'}>
                    {parser(channelInfo.description.split('\n').join('<br/>'))}
                </Typography>
                <Divider sx={{my: 2}}/>
                <Typography gutterBottom variant='subtitle2' fontWeight={"bold"}>
                    Joined
                </Typography>
                <Typography gutterBottom variant='body2' color={'text.secondary'}>
                    {moment(statsData.joinedDate).format("DD MMM YYYY")}
                </Typography>
                <Divider sx={{my: 2}}/>
                <Typography gutterBottom variant='subtitle2' fontWeight={"bold"}>
                    Location
                </Typography>
                <Typography gutterBottom variant='body2' color={'text.secondary'}>
                    {statsData.location}
                </Typography>
            </Box>
        }
    ]
 
    return (
        <Box sx={{flexGrow: 1}} height={"100%"}>
            <Box sx={{position: 'relative', aspectRatio: {xs: '16 / 5',md: '16 / 2'}}} width={"100%"} component={"div"}>
                <ImageWithFallback
                    src={channelInfo.authorBanners?.[channelInfo.authorBanners.length - 1].url}
                    fallbackSrc={"/static/placeholder-banner.png"}
                    fill
                    style={{objectFit: 'cover'}}
                    alt=""
                />
            </Box>
            <Box px={{xs: 0,sm:4, md: 8}} py={{xs: 2, md: 4}} display={'flex'} flexDirection={{xs: 'column', sm: 'row'}} justifyContent={'space-between'} alignItems={'center'}>
                <Box component={"div"} sx={{display: 'flex', alignItems: 'center'}} flexDirection={{xs: 'column', sm: 'row'}} marginBottom={{xs: 2, sm: 0}}>
                    <Avatar 
                        src={channelInfo.authorThumbnails?.[channelInfo.authorThumbnails.length - 1].url}
                        sx={{width: {xs: 64, sm: 96, md: 128}, height: {xs: 64, sm: 96, md: 128}, marginBottom: {xs: 2, md: 0}}}
                        alt={channelInfo.author}
                    />
                    <Box flexGrow={1} flexDirection={"column"} marginLeft={{xs: 2, md: 4}} textAlign={{xs: "center", sm: "start"}}>
                        <Typography gutterBottom variant='h5' fontSize={{xs: 16, sm: 20, md: 24}} fontWeight={'bold'}>
                            {channelInfo.author}
                        </Typography>
                        <Typography marginBottom={2} variant='body2' color={'text.secondary'}>
                            <span>
                                <Link href={channelInfo.authorUrl} underline='hover' color={'inherit'}>
                                    {channelInfo.authorUrl.split('/').reverse()[0]}
                                </Link>
                            </span>
                            <span style={{marginLeft: '12px'}}>
                                {channelInfo.subscriberText}
                            </span>
                        </Typography>
                        <Typography variant='body2' color={'text.secondary'}>
                            {channelInfo.description}
                        </Typography>
                    </Box>
                </Box>
                <Box sx={{ml: 2}}>
                    <Button variant='contained' sx={{borderRadius: 999, textTransform: 'none', fontWeight: 'bold'}} color={isSubscribed ? 'success' : 'error'} onClick={handleSubscription}>{isSubscribed ? "Subscribed!" : "Subscribe"}</Button>
                </Box>
            </Box>
            <BasicTab links={channelLinks}/>
        </Box>
    )
}

export async function getServerSideProps({query}){
    const {id} = query
    if(!id) {
        return {
            redirect: {
                destination: '/'
            }
        }
    }
    
    const entry = Date.now()
    
    const channelRequest = fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/channel?channelId=${id}`).then(res => res.json())
    const videosRequest = fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/channel/videos?channelId=${id}`).then(res => res.json())
    const statsRequest = fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/channel/stats?channelId=${id}`).then(res => res.json())

    const [channelData, videosData, statsData] = await Promise.all([channelRequest, videosRequest, statsRequest])

    return{
        props:{
            channelInfo: channelData.data,
            videosData: videosData.data,
            statsData : statsData.data,
            continuationId: videosData.continuation,
            actualTime: Date.now() - entry,
            totalTime: channelData.time + videosData.time + statsData.time
        }
    }
}