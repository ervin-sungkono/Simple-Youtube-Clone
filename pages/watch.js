import { Box, Stack, Card, Divider, Typography, CardContent, Button, Link, ButtonGroup, IconButton, CardActionArea, Collapse } from '@mui/material'
import { Share, ThumbUp, ThumbDown } from '@mui/icons-material'
import YoutubeCard2 from '../components/YoutubeCard2'
import useLoading from '../util/use-loading'
import parser from 'html-react-parser'
import ImageWithFallback from '../components/ImageWithFallback'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

import useLocalStorage from '../util/use-local-storage'
import abbrev from '../util/format'

export default function Search({mainVideo, similarVideo, time}) {
    console.log(`Time taken(watch): ${time}ms`)
    // console.log(mainVideo, similarVideo)
    const isLoading = useLoading()
    const [isSubscribed, setSubscribed] = useState(false)
    const [channels, setChannels] = useLocalStorage("channels", [])
    const [showMore, setShowMore] = useState(false);
    const { asPath } = useRouter()

    useEffect(() => {
        if(channels.find(channel => channel.id === mainVideo.channel.id)) setSubscribed(true)
        else setSubscribed(false)
    }, [channels])

    const handleSubscription = () => {
        if(!isSubscribed){ 
            const newChannel = {
                id: mainVideo.channel.id,
                name: mainVideo.channel.name,
                icon: mainVideo.channel.icon
            }
            setChannels([...channels, newChannel])
        }else{
            const newChannels = channels.filter(channel => channel.id !== mainVideo.channel.id)
            setChannels(newChannels)
        }
    }

    const handleSharing = async() => {
        await navigator.share({
            title: mainVideo.title,
            url: asPath
        })
    }

    return (
      <Box sx={{display: 'flex', gap: 4, flexGrow: 1, flexDirection: {xs: 'column', md: 'row'}}}>
        <Stack sx={{flexGrow: 1, gap: 4}}>
            <iframe width={"100%"} style={{aspectRatio: '16 / 9', border: 'none', borderRadius: '8px'}} src={`https://www.youtube.com/embed/${mainVideo.id}?autoplay=1&enablejsapi=1`} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen title="video"></iframe>
            <Box>
                <Typography gutterBottom fontSize={{xs: 16, md: 20}} variant='h6' fontWeight={"bold"}>
                    {mainVideo.title}
                </Typography>
                <Box sx={{
                    display: 'flex', justifyContent: 'space-between', alignItems: {xs: 'start', md: 'center'}, marginBottom: 2,
                    flexDirection: {xs: 'column', md: 'row'}}}>
                    <Link href={`/channel?id=${mainVideo.channel.id}`} underline='none'>
                        <Box sx={{display: 'flex', alignItems: 'center', gap: 2, marginBottom: {xs: 2, md: 0}}}>
                            <ImageWithFallback
                                src={mainVideo.channel.icon}
                                fallbackSrc={"/static/default-profile-icon.jpg"}
                                width={48} 
                                height={48} 
                                style={{objectFit: 'cover', borderRadius: '50%'}}
                                alt=""
                            />
                            <Typography fontWeight={"bold"} color='text.primary'>
                                {mainVideo.channel.name}
                            </Typography>
                        </Box>
                    </Link>
                    <Box sx={{display: 'flex', columnGap: 2}}>
                        <ButtonGroup variant='contained' sx={{bgcolor: 'rgb(255,255,255,0.15)', borderRadius: 999, px: 1.5}}>
                            <IconButton><ThumbUp/></IconButton>
                            <Divider orientation='vertical'/>
                            <IconButton><ThumbDown/></IconButton>
                        </ButtonGroup>
                        <Button variant='contained' sx={{borderRadius: 999, textTransform: 'none', fontWeight: 'bold'}} color={isSubscribed ? 'success' : 'error'} onClick={handleSubscription}>{isSubscribed ? "Subscribed!" : "Subscribe"}</Button>
                        <Button startIcon={<Share/>} variant='contained' sx={{borderRadius: 999, textTransform: 'none', fontWeight: 'bold', bgcolor: 'rgb(255,255,255,0.15)', color: '#FFF', ':hover': {bgcolor: 'rgb(255,255,255,0.25)'}}} onClick={handleSharing}>Share</Button>
                    </Box>
                </Box>
                <Box sx={{display: 'flex', columnGap: 1, marginBottom: 2}}>
                    <Typography fontSize={14} fontWeight={"bold"}>{abbrev(mainVideo.views)} views</Typography>
                    <Divider orientation='vertical' flexItem/>
                    <Typography fontSize={14} fontWeight={"bold"}>{mainVideo.uploadedAt}</Typography>
                </Box>
                <CardActionArea sx={{borderRadius: 3}} onClick={() => setShowMore(!showMore)}>
                        <Card sx={{borderRadius: 3}}>
                            <CardContent>
                                <Typography fontSize={14} component="div">
                                    {showMore ? parser(mainVideo.description.split('\n').join('<br/>')) : parser((mainVideo.description.substring(0, 200) + "...").split('\n').join('<br/>'))}
                                    <span style={{fontWeight: 'bold'}}>{showMore ? <><br/><br/>{"Show less"}</> : " Show more"}</span>
                                </Typography>
                            </CardContent>
                        </Card>
                </CardActionArea>
            </Box>
            <Divider/>
        </Stack>
        
        <Stack sx={{minWidth: {md: '360px', lg: '402px'}, maxWidth: {md: '360px', lg: '402px'}}} rowGap={2}>
            {(isLoading ? Array.from(new Array(9)) : similarVideo).map((video,index)=> (
                <YoutubeCard2 video={video} key={video?.id ?? index}/>
            ))}
        </Stack>
      </Box>
    )
}

export async function getServerSideProps({query}){
    if(!query.id){
        return {
            redirect: {
                destination: '/'
            }
        }
    }
    
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/video?id=${query.id}`)
        .then(res => res.json())

    return{
      props:{
        mainVideo: res.data.main,
        similarVideo: res.data.similar,
        time: res.time
      }
    }
}