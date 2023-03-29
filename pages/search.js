import { Grid, Box} from '@mui/material'
import YoutubeCard from '../components/YoutubeCard'
import useLoading from '../util/use-loading'

export default function Search({searchResult, time}) {
    console.log(`Time taken(search): ${time}ms`)
    const isLoading = useLoading()
    return (
      <Box sx={{ flexGrow: 1, paddingInline: {xs: 0, sm: 4, md: 8} }}>
        <Grid container rowSpacing={5} columnSpacing={2}>
          {(isLoading ? Array.from(new Array(9)) : searchResult).map((video, index) => (
            <YoutubeCard video={video} key={video?.id ?? index}/>
          ))}
        </Grid>
      </Box>
    )
}

export async function getServerSideProps({query}){
    if(!query.query){
        return {
            redirect: {
                destination: '/'
            }
        }
    }
    
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/search?query=${query.query}`)
        .then(res => res.json())

    return{
      props:{
        searchResult: res.data,
        time: res.time
      }
    }
}