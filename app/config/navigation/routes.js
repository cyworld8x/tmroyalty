import {FontIcons,FontAwesome} from '../../assets/icons';
import * as Screens from '../../screens/index';
import _ from 'lodash';

export const DefaultRoutes = {
    id: 'HomePage',
    title: 'Home',
    icon: FontAwesome.homepage,
    screen: Screens.HomePage,
    children: []
}

export const ProfileRoutes = {
  id: 'UserPage',
  title: 'Thông tin cá nhân',
  icon: FontAwesome.user,
  screen: Screens.ProfilePage,
  children: []
}

export const MainRoutes = [
  // {
  //   id: 'LoginMenu',
  //   title: 'Auth',
  //   icon: FontIcons.login,
  //   screen: Screens.LoginMenu,
  //   children: [
  //     {
  //       id: 'Login1',
  //       title: 'Login V1',
  //       screen: Screens.LoginV1,
  //       children: []
  //     },
  //     {
  //       id: 'Login2',
  //       title: 'Login V2',
  //       screen: Screens.LoginV2,
  //       children: []
  //     },
  //     {
  //       id: 'SignUp',
  //       title: 'Sign Up',
  //       screen: Screens.SignUp,
  //       children: []
  //     },
  //     {
  //       id: 'password',
  //       title: 'Password Recovery',
  //       screen: Screens.PasswordRecovery,
  //       children: []
  //     },
  //   ]
  // },
  // {
  //   id: 'SocialMenu',
  //   title: 'Social',
  //   icon: FontIcons.profile,
  //   screen: Screens.SocialMenu,
  //   children: [
  //     {
  //       id: 'ProfileV1',
  //       title: 'User Profile V1',
  //       screen: Screens.ProfileV1,
  //       children: []
  //     },
  //     {
  //       id: 'ProfileV2',
  //       title: 'User Profile V2',
  //       screen: Screens.ProfileV2,
  //       children: []
  //     },
  //     {
  //       id: 'ProfileV3',
  //       title: 'User Profile V3',
  //       screen: Screens.ProfileV3,
  //       children: []
  //     },
  //     {
  //       id: 'ProfileSettings',
  //       title: 'Profile Settings',
  //       screen: Screens.ProfileSettings,
  //       children: []
  //     },
  //     {
  //       id: 'Notifications',
  //       title: 'Notifications',
  //       screen: Screens.Notifications,
  //       children: []
  //     },
  //     {
  //       id: 'Contacts',
  //       title: 'Contacts',
  //       screen: Screens.Contacts,
  //       children: []
  //     },
  //     {
  //       id: 'Feed',
  //       title: 'Feed',
  //       screen: Screens.Feed,
  //       children: []
  //     },
  //   ]
  // },
  // {
  //   id: 'ArticlesMenu',
  //   title: 'Articles',
  //   icon: FontIcons.article,
  //   screen: Screens.ArticleMenu,
  //   children: [
  //     {
  //       id: 'Articles1',
  //       title: 'Article List V1',
  //       screen: Screens.Articles1,
  //       children: []
  //     },
  //     {
  //       id: 'Articles2',
  //       title: 'Article List V2',
  //       screen: Screens.Articles2,
  //       children: []
  //     },
  //     {
  //       id: 'Articles3',
  //       title: 'Article List V3',
  //       screen: Screens.Articles3,
  //       children: []
  //     },
  //     {
  //       id: 'Articles4',
  //       title: 'Article List V4',
  //       screen: Screens.Articles4,
  //       children: []
  //     },
  //     {
  //       id: 'Blogposts',
  //       title: 'Blogposts',
  //       screen: Screens.Blogposts,
  //       children: []
  //     },
  //     {
  //       id: 'Article',
  //       title: 'Article View',
  //       screen: Screens.Article,
  //       children: []
  //     }
  //   ]
  // },
  // {
  //   id: 'MessagingMenu',
  //   title: 'Messaging',
  //   icon: FontIcons.mail,
  //   screen: Screens.MessagingMenu,
  //   children: [
  //     {
  //       id: 'Chat',
  //       title: 'Chat',
  //       screen: Screens.Chat,
  //       children: []
  //     },
  //     {
  //       id: 'ChatList',
  //       title: 'Chat List',
  //       screen: Screens.ChatList,
  //       children: []
  //     },
  //     {
  //       id: 'Comments',
  //       title: 'Comments',
  //       screen: Screens.Comments,
  //       children: []
  //     },
  //   ]
  // },
  // {
  //   id: 'DashboardsMenu',
  //   title: 'Dashboards',
  //   icon: FontIcons.dashboard,
  //   screen: Screens.DashboardMenu,
  //   children: [{
  //     id: 'Dashboard',
  //     title: 'Dashboard',
  //     screen: Screens.Dashboard,
  //     children: []
  //   },]
  // },
  // {
  //   id: 'WalkthroughMenu',
  //   title: 'Walkthroughs',
  //   icon: FontIcons.mobile,
  //   screen: Screens.WalkthroughMenu,
  //   children: [{
  //     id: 'Walkthrough',
  //     title: 'Walkthrough',
  //     screen: Screens.WalkthroughScreen,
  //     children: []
  //   }]
  // },
  // {
  //   id: 'EcommerceMenu',
  //   title: 'Ecommerce',
  //   icon: FontIcons.card,
  //   screen: Screens.EcommerceMenu,
  //   children: [
  //     {
  //       id: 'Cards',
  //       title: 'Cards',
  //       icon: FontIcons.card,
  //       screen: Screens.Cards,
  //       children: []
  //     },
  //     {
  //       id: 'AddToCardForm',
  //       title: 'Add Card Form',
  //       icon: FontIcons.addToCardForm,
  //       screen: Screens.AddToCardForm,
  //       children: []
  //     },

  //   ]
  // },
  // {
  //   id: 'NavigationMenu',
  //   icon: FontIcons.navigation,
  //   title: 'Navigation',
  //   screen: Screens.NavigationMenu,
  //   children: [
  //     {
  //       id: 'GridV1',
  //       title: 'Grid Menu V1',
  //       screen: Screens.GridV1,
  //       children: []
  //     },
  //     {
  //       id: 'GridV2',
  //       title: 'Grid Menu V2',
  //       screen: Screens.GridV2,
  //       children: []
  //     },
  //     {
  //       id: 'List',
  //       title: 'List Menu',
  //       screen: Screens.ListMenu,
  //       children: []
  //     },
  //     {
  //       id: 'Side',
  //       title: 'Side Menu',
  //       action: 'DrawerOpen',
  //       screen: Screens.SideMenu,
  //       children: []
  //     }
  //   ]
  // },
  // {
  //   id: 'OtherMenu',
  //   title: 'Other',
  //   icon: FontIcons.other,
  //   screen: Screens.OtherMenu,
  //   children: [
  //     {
  //       id: 'Settings',
  //       title: 'Settings',
  //       screen: Screens.Settings,
  //       children: []
  //     }
  //   ]
  // },
  // {
  //   id: 'Themes',
  //   title: 'Themes',
  //   icon: FontIcons.theme,
  //   screen: Screens.Themes,
  //   children: []
  // },
  // {
  //   id: 'CategoryPage',
  //   title: 'Category',
  //   icon: FontIcons.other,
  //   screen: Screens.CategoryPage,
  //   children: [
  //     {
  //       id: 'NewsPage',
  //       title: 'News',
  //       screen: Screens.NewsPage,
  //       children: []
  //     },
  //     {
  //       id: 'DetailPage',
  //       title: 'DetailPage',
  //       screen: Screens.DetailPage,
  //       children: []
  //     },
  //     {
  //       id: 'TermConditionPage',
  //       title: 'CÀI ĐẶT',
  //       screen: Screens.TermConditionPage,
  //       children: []
  //     }
      
  //   ]
  // },
  {
    id: 'Alert',
    title: 'Alert',
    icon: FontIcons.other,
    screen: Screens.NotificationMenu,
    children: [
      {
        id: 'Notification',
        title: 'Thông báo',
        icon: FontAwesome.messase,
        screen: Screens.NotificationPage,
        children: []
      },    
      {
        id: 'Setting',
        title: 'Cài đặt',
        icon: FontAwesome.setting,
        screen: Screens.SettingPage,
        children: []
      },
    ]
  },
  {
    id: 'Other',
    title: 'Home',
    icon: FontIcons.other,
    screen: Screens.HomePage,
    children: [
      {
        id: 'Contact',
        title: 'Liên hệ',
        screen: Screens.ContactPage,
        children: []
      },
      {
        id: 'ContentPage',
        title: 'ContentPage',
        screen: Screens.ContentPage,
        children: []
      },
      {
        id: 'NewsPage',
        title: 'NewsPage',
        screen: Screens.NewsPage,
        children: []
      },
      {
        id: 'ReviewServicePage',
        title: 'ReviewServicePage',
        screen: Screens.ReviewServicePage,
        children: []
      },
      {
        id: 'ProfilePage',
        title: 'Thông tin cá nhân',
        screen: Screens.ProfilePage,
        children: []
      },
      {
        id: 'UserPage',
        title: 'Thông tin cá nhân',
        screen: Screens.UserPage,
        children: []
      },
      {
        id: 'FAQDetailPage',
        title: 'Hỏi đáp',
        screen: Screens.FAQDetailPage,
        children: []
      },
      {
        id: 'CodeVerificationPage',
        title: 'Nhập mã giới thiệu',
        icon: FontAwesome.friends,
        screen: Screens.CodeVerificationPage,
        children: []
      },
    ]
  },
  {
    id: 'Home',
    title: 'Home',
    icon: FontIcons.other,
    screen: Screens.HomePage,
    children: [
      {
        id: 'ProfilePage',
        title: 'Thông tin thành viên',
        screen: Screens.ProfilePage,
        icon: FontAwesome.user,
        children: []
      },
      {
        id: 'About',
        title: 'Giới thiệu dịch vụ TM Group',
        icon: FontAwesome.copyright,
        screen: Screens.ChildrenMenu,
        children: [ {
          id: 'AboutTMLoyalty',
          title: 'Về TM Loyalty',
          icon: FontAwesome.copyright,
          screen: Screens.WebPage,
          children: []
        },
        {
          id: 'AboutTMGroup',
          title: 'Về TM Group',
          icon: FontAwesome.copyright,
          screen: Screens.WebPage,
          children: []
        }, {
          id: 'PrivacyPolicy',
          title: 'Quyền riêng tư',
          icon: FontAwesome.termandcondition,
          screen: Screens.WebPage,
          data: {page:'PrivacyPolicy'},
          children: []
        }, 
        {
          id: 'TermAndCondition',
          title: 'Điều khoản sử dụng',
          icon: FontAwesome.termandcondition,
          screen: Screens.WebPage,
          data: {page:'TermAndCondition'},
          children: []
        },]
      },
      
      {
        id: 'ServicePage',
        title: 'Yêu cầu dịch vụ',
        icon: FontAwesome.certificate,
        screen: Screens.ServicePage,
        children: []
      },
      {
        id: 'ChildrenMenu',
        title: 'Lịch sử nhận & rút tiền',
        icon: FontAwesome.exchange,
        screen: Screens.ChildrenMenu,
        children: [
          {
            id: 'LoyaltyPage',
            title: 'Lịch sử Loyalty',
            icon: FontAwesome.trophy,
            screen: Screens.LoyaltyPage,
            children: []
          }, {
            id: 'WithdrawalHistory',
            title: 'Lịch sử nhận & rút tiền',
            icon: FontAwesome.exchange,
            screen: Screens.WithdrawalHistoryPage,
            children: []
          }]
      },
      {
        id: 'GrabPointPage',
        title: 'Quét mã tích điểm',
        icon: FontAwesome.ticket,
        screen: Screens.GrabPointPage,
        children: []
      },
      {
        id: 'CodeVerificationPage',
        title: 'Nhập mã và giới thiệu bạn bè',
        icon: FontAwesome.friends,
        screen: Screens.CodeVerificationPage,
        children: []
      },
      {
        id: 'HomePage',
        title: 'Tin tức và khuyến mãi TM',
        icon: FontAwesome.news,
        screen: Screens.HomePage,
        children: []
      },
      {
        id: 'ChildrenMenu',
        title: 'H/dẫn và C/Hỏi thường gặp',
        icon: FontAwesome.guide,
        screen: Screens.ChildrenMenu,
        children: [{
          id: 'UserGuide',
          title: 'Hướng dẫn',
          icon: FontAwesome.guide,
          screen: Screens.WebPage,
          children: []
        },  
        {
          id: 'FAQ',
          title: 'Câu hỏi thường gặp',
          icon: FontAwesome.questioncircle,
          screen: Screens.FAQPage,
          children: []
        },{
          id: 'ContactPage',
          title: 'Liên hệ',
          icon: FontAwesome.contact,
          screen: Screens.ContactPage,
          children: []
        },]
      },
     
      {
        id: 'Logout',
        title: 'Đăng xuất',
        icon: FontAwesome.logout,
        screen: Screens.LoginPage,
        children: []
      },
      
    ]
  },
];

let menuRoutes = _.cloneDeep(MainRoutes);
menuRoutes.unshift({
  id: 'HomePage',
  title: 'Start',
  screen: Screens.HomePage,
  children: []
},);

export const MenuRoutes = menuRoutes;