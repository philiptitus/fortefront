/**
 * The folder sub-components contains sub component of all the pages,
 * so here you will find folder names which are listed in root pages.
 */

// sub components for /pages/dashboard
import ActiveProjects from 'sub-components/dashboard/ActiveProjects';
import TasksPerformance from 'sub-components/dashboard/TasksPerformance';
import Teams from 'sub-components/dashboard/Teams';
import ActivePayments from './dashboard/ActivePayments';
import Details from './dashboard/Details';



// sub components for /pages/profile
import AboutMe from 'sub-components/profile/AboutMe';
import ActivityFeed from 'sub-components/profile/ActivityFeed';
import MyTeam from 'sub-components/profile/MyTeam';
import ProfileHeader from 'sub-components/profile/ProfileHeader';
import SamplePictures from './profile/SamplePictures';

import ProjectsContributions from 'sub-components/profile/ProjectsContributions';
import RecentFromBlog from 'sub-components/profile/RecentFromBlog';

// sub components for /pages/billing

// sub components for /pages/settings
import DeleteAccount from 'sub-components/settings/DeleteAccount';
import VerifyAccount from './settings/VerifyAccoount';
import EmailSetting from 'sub-components/settings/EmailSetting';
import GeneralSetting from 'sub-components/settings/GeneralSetting';
import Notifications from 'sub-components/settings/Notifications';
import Preferences from 'sub-components/settings/Preferences';




import CloseHostel from './adminsettings/CloseHostel';
import DeleteImage from './adminsettings/DeleteImages';
import HostelImage from './adminsettings/HostelImage';
import Hostelinformation from './adminsettings/HostelInformation';
import NewRooms from './adminsettings/NewRooms';
import NewStaff from './adminsettings/NewStaff';


import NewAccomodation from './accomodation/NewAccomodation';
import RoomPrices from './hostel/RoomPrices';



import ActivityFeed2 from './hostel/ActivityFeed2';


export {
   ActiveProjects,
   TasksPerformance,
   Teams,
   ActivePayments,
   Details,
   
   
   AboutMe,
   ActivityFeed,
   MyTeam,
   ProfileHeader,
   ProjectsContributions,
   RecentFromBlog,

   SamplePictures,


   DeleteAccount, 
   EmailSetting,  
   GeneralSetting, 
   Notifications, 
   Preferences,
   VerifyAccount,



   CloseHostel,
   DeleteImage,
   HostelImage,
   Hostelinformation,
   NewRooms,
   NewStaff,


   NewAccomodation,
   RoomPrices,


   ActivityFeed2
   
};
