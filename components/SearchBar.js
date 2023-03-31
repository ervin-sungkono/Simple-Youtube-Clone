import { useEffect, useState } from "react";
import { TextField, Autocomplete, Stack, IconButton, InputAdornment } from "@mui/material";
import { Search } from "@mui/icons-material";

export default function SearchBar({id, data, placeholder = "Search Video...", getSearchAutocomplete, handleSearch}){
    const [query, setQuery] = useState("")

    const THROTTLE_DELAY = 100
    let timeout
    const handleUpdateQuery = (text) => {
        clearTimeout(timeout)
        timeout = setTimeout(() => setQuery(text), THROTTLE_DELAY)
    }

    const handleInputSearch = () => {
      const searchParams = document.getElementById(id)?.value ?? ""
      handleSearch(searchParams)
    }

    useEffect(() => {
        getSearchAutocomplete(query)
    }, [query])
    return(
        <Stack width={"100%"} sx={{maxWidth: '480px', margin: 'auto'}}>
            <Autocomplete
              id={id}
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
                  placeholder={placeholder}
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