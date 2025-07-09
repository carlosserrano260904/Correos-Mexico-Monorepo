import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeUser from '../../screens/usuario/HomePage/HomeUser';
import ProfileUser from '../../screens/usuario/profile/ProfileUser';
import { Home, User } from "lucide-react-native";
import { StyleSheet } from 'react-native';
import { moderateScale } from 'react-native-size-matters';

const Tab = createBottomTabNavigator();

const HomeTabs = () => {
  return (
    <Tab.Navigator initialRouteName='HomeUser'
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarIcon: ({ color, focused, size }) => {
          const iconProps = {
            color: color,
            size: moderateScale(24),
            strokeWidth: focused ? moderateScale(2.5) : moderateScale(1.5),
          };

          if (route.name === 'HomeUser') return <Home {...iconProps} />;
          else if (route.name === 'Perfil') return <User {...iconProps} />;

          return null;
        },
        tabBarActiveTintColor: '#DE1484',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: styles.tabBarStyle,
      })}
    >
      <Tab.Screen name="HomeUser" component={HomeUser} />
      <Tab.Screen name="Perfil" component={ProfileUser} />
      
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBarStyle: {
    position: 'absolute',
    backgroundColor: '#F3F4F6',
    borderRadius: 100,
    marginVertical: moderateScale(52),
    marginHorizontal: moderateScale(12),
    height: moderateScale(60),
    alignItems: "center",
    justifyContent: "center",
    paddingTop: moderateScale(10)
  },
});

export default HomeTabs;
