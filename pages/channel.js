import useLoading from '../util/use-loading'

export default function Home({channelInfo, time}) {
  console.log(`Time taken(channel): ${time}ms`)
  const isLoading = useLoading()
  console.log(channelInfo)
  return (
    <></>
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
    
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/channel?channelId=${id}`)
        .then(res => res.json())

    return{
        props:{
            channelInfo: res.data  ?? [],
            time: res.time
        }
    }
}