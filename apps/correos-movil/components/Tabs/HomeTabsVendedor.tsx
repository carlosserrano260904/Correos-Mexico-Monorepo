import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ProfileUser from '../../screens/usuario/profile/ProfileUser';
import Correomex from '../../screens/usuario/correos-mex-page/correos-principal';
import { Home, Package2, SendHorizonal, Tag } from "lucide-react-native";
import { StyleSheet } from 'react-native';
import { moderateScale } from 'react-native-size-matters';
import MainScreenSeller from '../../screens/vendedor/MainScreenSeller';
import ProductsScreenSeller from '../../screens/vendedor/ProductsScreenSeller';
import CouponsScreenSeller from '../../screens/vendedor/CouponsScreenSeller';
import OrdersScreenSeller from '../../screens/vendedor/OrdersScreenSeller';

const Tab = createBottomTabNavigator();

const HomeTabs = () => {
    return (
        <Tab.Navigator initialRouteName='HomeSeller'
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarShowLabel: false,
                tabBarIcon: ({ color, focused, size }) => {
                    const iconProps = {
                        color: color,
                        size: moderateScale(24),
                        strokeWidth: focused ? moderateScale(2.5) : moderateScale(2),
                    };

                    if (route.name === 'CouponsScreenSeller') return <Tag {...iconProps} />;
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
        marginVertical: moderateScale(52),
        marginHorizontal: moderateScale(12),
        height: moderateScale(60),
        alignItems: "center",
        justifyContent: "center",
        paddingTop: moderateScale(10)
    },
});

export default HomeTabs;
