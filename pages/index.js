import { Grid, Box} from '@mui/material'
import YoutubeCard from '../components/YoutubeCard'
import useLoading from '../util/use-loading'

export default function Home({homepageData, time}) {
  console.log(`Time taken(homepage): ${time}ms`)
  const isLoading = useLoading()
  return (
    <Box sx={{ flexGrow: 1, paddingInline: {xs: 0, sm: 4, md: 6} }}>
      <Grid container rowSpacing={4} columnSpacing={2}>
        {(isLoading ? Array.from(new Array(9)) : homepageData).map((video, index) => (
          <YoutubeCard video={video} key={video?.id ?? index}/>
        ))}
      </Grid>
    </Box>
  )
}

export async function getServerSideProps(){
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/homepage`)
    .then(res => res.json())

  return{
    props:{
      homepageData: res.data  ?? [],
      time: res.time
    }
  }
}