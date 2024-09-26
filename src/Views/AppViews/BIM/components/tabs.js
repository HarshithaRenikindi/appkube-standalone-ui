


// import React, { useState } from 'react';
// import { Tabs, Tab, Button, Menu, MenuItem, Popover, ListItemIcon, Typography } from '@mui/material';
// import SettingsIcon from '@mui/icons-material/Settings';
// import Calendar from './Calendar';
// import menuicon from 'assets/img/allservices/menuicon.png'
// import { Navigate } from 'react-router-dom';
// import { APP_PREFIX_PATH } from 'Configs/AppConfig';
// const Timerange = () => {
//   const [selectedTab, setSelectedTab] = useState(0);
//   const [anchorEl, setAnchorEl] = useState(null);
//   const [calendarAnchorEl, setCalendarAnchorEl] = useState(null);
//   const [selectedDate, setSelectedDate] = useState(new Date());
//   const open = Boolean(anchorEl);
//   const calendarOpen = Boolean(calendarAnchorEl);

//   function handlenavigate(){
//     Navigate(`${APP_PREFIX_PATH}/bim/performance`)
//   }

//   const handleTabChange = (event, newValue) => {
//     setSelectedTab(newValue);
//   };

//   const handleMenuClick = (event) => {
//     setAnchorEl(event.currentTarget);
//   };

//   const handleMenuClose = () => {
//     setAnchorEl(null);
//   };

//   const handleCustomClick = (event) => {
//     setCalendarAnchorEl(event.currentTarget);
//   };

//   const handleCalendarClose = () => {
//     setCalendarAnchorEl(null);
//   };

//   const handleDateSelect = (date) => {
//     setSelectedDate(date);
//     handleCalendarClose();
//   };

//   return (
//     <div className="p-2 flex justify-between items-center space-x-2">
//       <div className="flex">
//         <Tabs
//           value={selectedTab}
//           onChange={handleTabChange}
//           aria-label="environment-tabs"
//           sx={{
//             '& .MuiTab-root': {
//               color: '#383874',
//               textTransform: 'none',
//               '&.Mui-selected': {
//                 color: '#383874',
//               },
//             },
//             '& .MuiTabs-indicator': {
//               backgroundColor: '#8676FF',
//             },
//           }}
//         >
//           <Tab label="Development" />
//           <Tab label="Test" />
//           <Tab label="Stage" />
//           <Tab label="Production" />
//         </Tabs>
//       </div>

//       <div className="flex justify-end items-center space-x-2">
//         <div className="Timerange flex space-x-1 rounded-full bg-white shadow-md">
//           <Button
//             className="px-2 text-black border-0 rounded-full hover:bg-gray-100"
//             sx={{ textTransform: 'none', color: '#05050F' }}
//           >
//             Today
//           </Button>
//           <Button
//             className="text-black border-0 rounded-full hover:bg-gray-100"
//             sx={{ textTransform: 'none', color: '#05050F' }}
//           >
//             1W
//           </Button>
//           <Button
//             className="text-black border-0 rounded-full hover:bg-gray-100"
//             sx={{ textTransform: 'none', color: '#05050F' }}
//           >
//             1M
//           </Button>
//           <Button
//             className="text-black border-0 rounded-full hover:bg-gray-100"
//             sx={{ textTransform: 'none', color: '#05050F' }}
//           >
//             3M
//           </Button>
//           <Button
//             className="text-black border-0 rounded-full hover:bg-gray-100"
//             sx={{ textTransform: 'none', color: '#05050F' }}
//             onClick={handleCustomClick}
//           >
//             Custom
//           </Button>
//         </div>

//         <Button
//           className='sla'
//           variant="contained"
//           startIcon={<SettingsIcon />}
//           onClick={handleMenuClick}
//           sx={{ backgroundColor: '#DDE1F8', color: '#383874', paddingLeft: '16px', paddingRight: '16px' }}
//         >
//           SLA
//         </Button>
//       </div>

//       {/* Modified SLA Menu */}
//       <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
//         <MenuItem onClick={handleMenuClose} sx={{
//           backgroundColor: '#EEF2FF', // Light indigo background for selected item
//           '&:hover': { backgroundColor: '#E0E7FF' }, // Slightly darker on hover
//         }}>
//           <ListItemIcon>
//             <img src={menuicon} alt="menu"/>
//           </ListItemIcon>
//           <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#3730A3' }} onClick={handlenavigate}>
//             Performance & Reliability
//           </Typography>
//         </MenuItem>
//         <MenuItem onClick={handleMenuClose}>
//           <ListItemIcon>
//           <img src={menuicon} alt="menu"/>

//           </ListItemIcon>
//           <Typography variant="body1" sx={{ color: '#3730A3' }}>
//             Availability & End User
//           </Typography>
//         </MenuItem>
//         <MenuItem onClick={handleMenuClose}>
//           <ListItemIcon>
//           <img src={menuicon} alt="menu"/>

//        </ListItemIcon>
//           <Typography variant="body1" sx={{ color: '#3730A3' }}>
//             Auto Scaling & Security
//           </Typography>
//         </MenuItem>
//         <MenuItem onClick={handleMenuClose}>
//           <ListItemIcon>
//           <img src={menuicon} alt="menu"/>

//           </ListItemIcon>
//           <Typography variant="body1" sx={{ color: '#3730A3' }}>
//             Cost
//           </Typography>
//         </MenuItem>
//       </Menu>

//       <Popover
//         open={calendarOpen}
//         anchorEl={calendarAnchorEl}
//         onClose={handleCalendarClose}
//         anchorOrigin={{
//           vertical: 'bottom',
//           horizontal: 'left',
//         }}
//         transformOrigin={{
//           vertical: 'top',
//           horizontal: 'left',
//         }}
//       >
//         <Calendar selectedDate={selectedDate} onSelectDate={handleDateSelect} />
//       </Popover>
//     </div>
//   );
// };

// export default Timerange;




import React, { useState } from 'react';
import { Tabs, Tab, Button, Menu, MenuItem, Popover, ListItemIcon, Typography } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import Calendar from './Calendar';
import menuicon from 'assets/img/allservices/menuicon.png';
import { useNavigate } from 'react-router-dom'; // Corrected import
import { APP_PREFIX_PATH } from 'Configs/AppConfig';

const Timerange = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const [calendarAnchorEl, setCalendarAnchorEl] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const open = Boolean(anchorEl);
  const calendarOpen = Boolean(calendarAnchorEl);

  const navigate = useNavigate(); // Use the hook to navigate

  const handleNavigate = () => {
    navigate(`${APP_PREFIX_PATH}/bim/performance`); // Call navigate as a function
  };

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleCustomClick = (event) => {
    setCalendarAnchorEl(event.currentTarget);
  };

  const handleCalendarClose = () => {
    setCalendarAnchorEl(null);
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    handleCalendarClose();
  };

  return (
    <div className="p-2 flex justify-between items-center space-x-2">
      <div className="flex">
        <Tabs
          value={selectedTab}
          onChange={handleTabChange}
          aria-label="environment-tabs"
          sx={{
            '& .MuiTab-root': {
              color: '#383874',
              textTransform: 'none',
              '&.Mui-selected': {
                color: '#383874',
              },
            },
            '& .MuiTabs-indicator': {
              backgroundColor: '#8676FF',
            },
          }}
        >
          <Tab label="Development" />
          <Tab label="Test" />
          <Tab label="Stage" />
          <Tab label="Production" />
        </Tabs>
      </div>

      <div className="flex justify-end items-center space-x-2">
        <div className="Timerange flex space-x-1 rounded-full bg-white shadow-md">
          <Button
            className="px-2 text-black border-0 rounded-full hover:bg-gray-100"
            sx={{ textTransform: 'none', color: '#05050F' }}
          >
            Today
          </Button>
          <Button
            className="text-black border-0 rounded-full hover:bg-gray-100"
            sx={{ textTransform: 'none', color: '#05050F' }}
          >
            1W
          </Button>
          <Button
            className="text-black border-0 rounded-full hover:bg-gray-100"
            sx={{ textTransform: 'none', color: '#05050F' }}
          >
            1M
          </Button>
          <Button
            className="text-black border-0 rounded-full hover:bg-gray-100"
            sx={{ textTransform: 'none', color: '#05050F' }}
          >
            3M
          </Button>
          <Button
            className="text-black border-0 rounded-full hover:bg-gray-100"
            sx={{ textTransform: 'none', color: '#05050F' }}
            onClick={handleCustomClick}
          >
            Custom
          </Button>
        </div>

        <Button
          className="sla"
          variant="contained"
          startIcon={<SettingsIcon />}
          onClick={handleMenuClick}
          sx={{ backgroundColor: '#DDE1F8', color: '#383874', paddingLeft: '16px', paddingRight: '16px' }}
        >
          SLA
        </Button>
      </div>

      <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
        <MenuItem
          onClick={handleMenuClose}
          sx={{
            backgroundColor: '#EEF2FF',
            '&:hover': { backgroundColor: '#E0E7FF' },
          }}
        >
          <ListItemIcon>
            <img src={menuicon} alt="menu" />
          </ListItemIcon>
          <Typography
            variant="body1"
            sx={{ fontWeight: 'bold', color: '#3730A3' }}
            onClick={() => handleNavigate()} // Corrected navigation call
          >
            Performance & Reliability
          </Typography>
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon>
            <img src={menuicon} alt="menu" />
          </ListItemIcon>
          <Typography variant="body1" sx={{ color: '#3730A3' }}>
            Availability & End User
          </Typography>
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon>
            <img src={menuicon} alt="menu" />
          </ListItemIcon>
          <Typography variant="body1" sx={{ color: '#3730A3' }}>
            Auto Scaling & Security
          </Typography>
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon>
            <img src={menuicon} alt="menu" />
          </ListItemIcon>
          <Typography variant="body1" sx={{ color: '#3730A3' }}>
            Cost
          </Typography>
        </MenuItem>
      </Menu>

      <Popover
        open={calendarOpen}
        anchorEl={calendarAnchorEl}
        onClose={handleCalendarClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <Calendar selectedDate={selectedDate} onSelectDate={handleDateSelect} />
      </Popover>
    </div>
  );
};

export default Timerange;
