import React, { Component } from 'react';
import { createStackNavigator, createAppContainer } from 'react-navigation';

import splash from './components/splash';
import login from './components/login';
import home from './components/home';

const createStackNavigators = () => {
    return createStackNavigator({
            SplashScreen: { 
                screen: splash   
            },
            LoginScreen: {
                screen: login
            },
            HomeScreen: {
                screen: home
            }
        },
        {
            initialRouteName: 'SplashScreen',
            headerMode: 'none'
        });
    }
  
class Root extends Component {

    render() {
        const Navigator = createStackNavigators();
        const AppContainer = createAppContainer(Navigator);
        return (<AppContainer/>);
    }

}

export default Root;