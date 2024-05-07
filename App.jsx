import {NavigationContainer} from '@react-navigation/native';
import 'react-native-gesture-handler';
import {createStackNavigator} from '@react-navigation/stack';
import Splash from './src/screens/Splash';
import ToDo from './src/screens/ToDo';
import Done from './src/screens/Done';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Task from './src/screens/Task';
import {Provider} from 'react-redux';
import {Store} from './src/redux/store';
import Camera from './src/screens/Camera';

const Tab = createBottomTabNavigator();
const HomeTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarActiveTintColor: '#0080ff',
        tabBarInactiveTintColor: '#777777',
        tabBarLabelStyle: {
          fontSize: 15,
          fontFamily: 'ShadowsIntoLight-Regular',
        },
        headerTitleAlign: 'center',
        headerStyle: {
          backgroundColor: '#0080ff',
        },
        tabBarIcon: ({focused, size, color}) => {
          let iconName;
          if (route.name === 'My Tasks') {
            iconName = 'clipboard-list';
            size = focused ? 25 : 20;
          } else if (route.name === 'Done') {
            iconName = 'clipboard-check';
            size = focused ? 25 : 20;
          }
          return <FontAwesome5 name={iconName} size={size} color={color} />;
        },
      })}>
      <Tab.Screen name="My Tasks" component={ToDo} />
      <Tab.Screen name="Done" component={Done} />
    </Tab.Navigator>
  );
};

const App = () => {
  const Stack = createStackNavigator();

  return (
    <Provider store={Store}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Splash"
          screenOptions={{
            headerTitleAlign: 'center',
            headerStyle: {
              backgroundColor: '#0080ff',
            },
            headerTintColor: '#ffffff',
            headerTitleStyle: {
              fontSize: 25,
              fontWeight: 'bold',
            },
          }}>
          <Stack.Screen
            name="Splash"
            component={Splash}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="HomeTabs"
            component={HomeTabs}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Camera"
            component={Camera}
            options={{headerShown: false}}
          />
          <Stack.Screen name="Task" component={Task} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
};

export default App;
