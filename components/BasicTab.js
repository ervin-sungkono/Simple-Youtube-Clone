import {Tabs, Tab, Box} from '@mui/material'
import TabPanel from './BasicTabPanel';
import { useState } from 'react';

export default function BasicTab({links, activeTab}) {
    const [value, setValue] = useState(0);
  
    const handleChange = (event, newValue) => {
      setValue(newValue);
    };
  
    return (
      <Box sx={{ width: '100%'}}>
        <Box sx={{ borderBottom: 1, mb: 2, borderColor: 'divider' }}>
          <Tabs value={value} onChange={handleChange}>
            {links.map(link => (
                <Tab label={link.label} key={link.label}/>
            ))}
          </Tabs>
        </Box>
        {links.map((link, index)=> (
            <TabPanel value={value} index={index} key={link.label}>
                {link.component}
            </TabPanel>
        ))}
      </Box>
    );
  }