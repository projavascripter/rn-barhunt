import React from 'react';
import { TabNavigator, StackNavigator } from 'react-navigation';
import Icon from 'react-native-vector-icons/FontAwesome';

import Register from './Register';
import RegistrationHome from './RegistrationHome';
import RegistrationStart from './RegistrationStart';
import RegistrationHuntList from './RegistrationHuntList';
import RegistrationGroupType from './RegistrationGroupType';
import RegistrationHuntInfo from './RegistrationHuntInfo';
import RegistrationThemeSelection from './RegistrationThemeSelection';
import RegistrationLargeGroup from './RegistrationLargeGroup';
import RegistrationTeamInfo from './RegistrationTeamInfo';
import RegistrationConfirm from './RegistrationConfirm';
import CardStackStyleInterpolator from 'react-navigation/src/views/CardStack/CardStackStyleInterpolator';
import {getStateForAction, withNavigationPreventDuplicate} from '../../Drawer_actions'



const RegistratonMainStack = StackNavigator({
  RegistrationHome: {
    screen: RegistrationHome,
    navigationOptions: {
      header: null
    }
  },
  RegistrationStart: {
    screen: RegistrationStart,
    navigationOptions: {
      header: null
    }
  },
  RegistrationHuntList: {
    screen: RegistrationHuntList,
    navigationOptions: {
      header: null
    }
  },
  RegistrationGroupType: {
    screen: RegistrationGroupType,
    navigationOptions: {
      title: 'What type of group are you?',
      headerTitleStyle: { color: '#E87722', fontWeight: '400' }
    }
  },
  RegistrationLargeGroup: {
    screen: RegistrationLargeGroup,
    navigationOptions: {
      title: 'Register your Group!',
      headerTitleStyle: { color: '#E87722', fontWeight: '400' }
    }
  },
  RegistrationHuntInfo: {
    screen: RegistrationHuntInfo,
    navigationOptions: {
      header: null
    }
  },
  RegistrationThemeSelection: {
    screen: RegistrationThemeSelection,
    navigationOptions: {
      header: null
    }
  },
  RegistrationConfirm: {
    screen: RegistrationConfirm,
    navigationOptions: {
      header: null
    }
  },
  RegistrationTeamInfo: {
    screen: RegistrationTeamInfo,
    navigationOptions: {
      title: 'Enter your teams info!',
      headerTitleStyle: { color: '#E87722', fontWeight: '400' }
    }
  },
}, {
    navigationOptions: {
      tabBarPosition: 'bottom'
    },
    transitionConfig: () => {
      return { screenInterpolator: CardStackStyleInterpolator.forHorizontal }
    }

  });

  RegistratonMainStack.router.getStateForAction = withNavigationPreventDuplicate(
    RegistratonMainStack.router.getStateForAction
  );


export default RegistratonMainStack;

// const Registration = TabNavigator({
//   Register: {
//     screen: RegistratonMainStack,
//     navigationOptions: {
//       tabBarLabel: 'Play Now',
//       tabBarIcon: ({ tintColor }) => <Icon name="check-circle" size={25} color={tintColor} />,
//     },
//   },
//   FindHunt: {
//     screen: FindHunt,
//     navigationOptions: {
//       tabBarLabel: 'Find Hunt',
//       tabBarIcon: ({ tintColor }) => <Icon name="search" size={25} color={tintColor} />,
//     },
//   },
//   Spy: {
//     screen: Spy,
//     navigationOptions: {
//       tabBarLabel: 'Other Teams',
//       tabBarIcon: ({ tintColor }) => <Icon name="users" size={25} color={tintColor} />,
//     },
//   },
// }, {
//   tabBarPosition: 'bottom',  
//   navigationOptions: {
//       tabBarPosition: 'bottom'
//     },
//     tabBarOptions: {
//       showIcon: true,
//       activeTintColor: 'blue',
//       inactiveTintColor:'#999999',
//       style: {
//           backgroundColor: '#ffffff',
//       },
//       indicatorStyle: {
//           backgroundColor: 'white'
//       }
//   }
// });

