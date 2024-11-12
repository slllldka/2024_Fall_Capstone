import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import Login from './src/auth/pages/Login';
import Register from './src/auth/pages/Register';
import ChatRoom from './src/chat/ChatRoom';

const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Chatroom'>
        <Stack.Screen name='Login' component={Login} options={{headerShown: false}} />
        <Stack.Screen name='Register' component={Register} options={{headerShown: false}} />
        <Stack.Screen name='ChatRoom' component={ChatRoom} options={{headerShown: false}} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
