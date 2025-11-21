import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, Package2, SendHorizonal, Tag, ScrollText } from "lucide-react-native";
import { StyleSheet, Dimensions } from 'react-native';
import { moderateScale } from 'react-native-size-matters';
import MainScreenSeller from '../../screens/vendedor/MainScreenSeller';
import ProductsScreenSeller from '../../screens/vendedor/ProductsScreenSeller';
import CouponsScreenSeller from '../../screens/vendedor/CouponsScreenSeller';
import OrdersScreenSeller from '../../screens/vendedor/OrdersScreenSeller';
import RequestScreenSeller from '../../screens/vendedor/RequestScreenSeller';

const screenWidth = Dimensions.get('screen').width;
const screenHeight = Dimensions.get('screen').height

const Tab = createBottomTabNavigator();

const HomeTabsSeller = () => {
    return (
        <Tab.Navigator initialRouteName='HomeSeller'
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarShowLabel: false,
                tabBarIcon: ({ color, focused, size }) => {
                    const iconProps = {
                        color: color,
                        size: screenWidth * 0.062,
                        strokeWidth: focused ? moderateScale(2.5) : moderateScale(2),
                    };
                    
                    if (route.name === 'RequestScreenSeller') return <ScrollText {...iconProps} />;
                    else if (route.name === 'CouponsScreenSeller') return <Tag {...iconProps} />;
                    else if (route.name === 'HomeSeller') return <Home {...iconProps} />;
                    else if (route.name === 'ProductsScreenSeller') return <Package2 {...iconProps} />;
                    else if (route.name === 'OrdersScreenSeller') return <SendHorizonal {...iconProps} />;

                    return null;
                },
                tabBarActiveTintColor: '#DE1484',
                tabBarInactiveTintColor: 'gray',
                tabBarStyle: styles.tabBarStyle,
            })}
        >
            <Tab.Screen name="RequestScreenSeller" component={RequestScreenSeller} />
            <Tab.Screen name="CouponsScreenSeller" component={CouponsScreenSeller} />
            <Tab.Screen name="HomeSeller" component={MainScreenSeller} />
            <Tab.Screen name="ProductsScreenSeller" component={ProductsScreenSeller} />
            <Tab.Screen name="OrdersScreenSeller" component={OrdersScreenSeller} />

        </Tab.Navigator>
    );
};

const styles = StyleSheet.create({
    tabBarStyle: {
        position: 'absolute',
        backgroundColor: '#F3F4F6',
        borderRadius: moderateScale(100),
        marginVertical: screenHeight * 0.064,
        marginHorizontal: screenWidth * 0.032,
        height: screenHeight * 0.072,
        alignItems: "center",
        justifyContent: "center",
        paddingTop: screenHeight * 0.012
    },
});

export default HomeTabsSeller;
