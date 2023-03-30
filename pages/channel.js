import { Avatar, Box, Button, Divider, Link, Typography, Grid } from '@mui/material'
import ImageWithFallback from '../components/ImageWithFallback'
import { useEffect, useState } from 'react'
import useLoading from '../util/use-loading'
import useLocalStorage from '../util/use-local-storage'

import YoutubeCard from '../components/YoutubeCard'

export default function Home({channelInfo, homepageData, actualTime, totalTime}) {
    console.log(`Time taken(channel): ${actualTime}ms (saved ${totalTime - actualTime}ms with Promise.all())`)
    // console.log(channelInfo, homepageData)
    const isLoading = useLoading()
    const [isSubscribed, setSubscribed] = useState(false)
    const [channels, setChannels] = useLocalStorage("channels", [])

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
 
    return (
        <Box sx={{flexGrow: 1}} height={"100%"}>
            <Box sx={{position: 'relative', aspectRatio: {xs: '16 / 5',md: '16 / 3'}}} width={"100%"} component={"div"}>
                <ImageWithFallback
                    src={channelInfo.authorBanners?.[channelInfo.authorBanners.length - 1].url}
                    fallbackSrc={"/static/placeholder-banner.png"}
                    fill
                    style={{objectFit: 'cover'}}
                    alt=""
                />
            </Box>
            <Box px={{xs: 0, md: 8}} py={{xs: 2, md: 4}} display={'flex'} flexDirection={{xs: 'column', sm: 'row'}} justifyContent={'space-between'} alignItems={'center'}>
                <Box component={"div"} sx={{display: 'flex', alignItems: 'center'}} flexDirection={{xs: 'column', sm: 'row'}} marginBottom={{xs: 2, sm: 0}}>
                    <Avatar 
                        src={channelInfo.authorThumbnails?.[channelInfo.authorThumbnails.length - 1].url}
                        sx={{width: {xs: 64, sm: 96, md: 128}, height: {xs: 64, sm: 96, md: 128}, marginBottom: {xs: 2, md: 0}}}
                        alt={channelInfo.author}
                    />
                    <Box flexDirection={"column"} marginLeft={{xs: 2, md: 4}} textAlign={{xs: "center", sm: "start"}}>
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
                <Button variant='contained' sx={{borderRadius: 999, textTransform: 'none', fontWeight: 'bold'}} color={isSubscribed ? 'success' : 'error'} onClick={handleSubscription}>{isSubscribed ? "Subscribed!" : "Subscribe"}</Button>
            </Box>
            <Divider variant='middle'/>
            {/* <Grid container rowSpacing={4} columnSpacing={2}>
                {(isLoading ? Array.from(new Array(9)) : homepageData).map((video, index) => (
                    <YoutubeCard video={video} key={video?.id ?? index}/>
                ))}
            </Grid> */}
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
    const homepageRequest = fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/channel/homepage?channelId=${id}`).then(res => res.json())

    const [channelData, homepageData] = await Promise.all([channelRequest, homepageRequest])

    return{
        props:{
            channelInfo: channelData.data,
            homepageData: homepageData.data,
            actualTime: Date.now() - entry,
            totalTime: channelData.time + homepageData.time
        }
    }
}