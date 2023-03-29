import { useEffect, useState } from "react";
import { TextField, Autocomplete, Stack, IconButton, InputAdornment } from "@mui/material";
import { Search } from "@mui/icons-material";

export default function SearchBar({data, getSearchAutocomplete, handleSearch}){
    const [query, setQuery] = useState("")

    const THROTTLE_DELAY = 100
    let timeout
    const handleUpdateQuery = (text) => {
        clearTimeout(timeout)
        timeout = setTimeout(() => setQuery(text), THROTTLE_DELAY)
    }

    const handleInputSearch = () => {
      const query = document.getElementById('yt-video-search')?.value ?? ""
      handleSearch(query)
    }

    useEffect(() => {
        getSearchAutocomplete(query)
    }, [query])
    return(
        <Stack sx={{width: '480px', margin: 'auto'}}>
            <Autocomplete
              id="yt-video-search"
              freeSolo
              options={data.slice(0,8)}
              getOptionLabel={(option) => option.title ?? option}
              onChange={(e, newValue) => {
                if (typeof newValue === 'string') {
                  handleSearch(newValue)
                }
              }}
              onInputChange={(e) => {
                if(e.type === 'change') handleUpdateQuery(e.target.value)
              }}
              renderInput={(params) => (
                <TextField 
                  {...params} 
                  variant="outlined"
                  placeholder="Search Video.."
                  InputProps={{
                    ...params.InputProps,
                    style: {
                      paddingBlock: 2,
                      paddingInline: 12,
                      borderRadius: 999
                    },
                    endAdornment: 
                      <InputAdornment position="end">
                        <IconButton onClick={handleInputSearch}><Search/></IconButton>
                      </InputAdornment>
                  }}
                />
              )}
            />
          </Stack>
    )
}