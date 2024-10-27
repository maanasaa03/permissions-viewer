import { NativeModules } from 'react-native';
import React, { useEffect, useState } from 'react';
import { View, FlatList } from 'react-native';
import { Provider as PaperProvider, Text, Appbar, List, Divider, Avatar } from 'react-native-paper';

const { AppPermissions } = NativeModules;

const AppPermissionsScreen = () => {
    const [apps, setApps] = useState([]);

    useEffect(() => {
        AppPermissions.getInstalledAppsWithPermissions()
            .then((result) => {
                const filteredApps = result.filter((app) => {
                    const permissions = app.permissions || [];
                    return permissions.some((permission) =>
                        ["android.permission.CAMERA", "android.permission.ACCESS_FINE_LOCATION", "android.permission.RECORD_AUDIO"].includes(permission)
                    );
                });
                setApps(filteredApps);
            })
            .catch((error) => console.error(error));
    }, []);

    const renderAppItem = ({ item }) => (
        <List.Item
            title={item.appName}
            description={`Permissions: ${item.permissions.join(", ")}`}
            left={() => <Avatar.Icon icon="alert" />}
            right={() => <Text style={{ color: 'red' }}>Sensitive Access</Text>}
        />
    );

    return (
        <PaperProvider>
            <Appbar.Header>
                <Appbar.Content title="App Permissions" subtitle="Sensitive Permissions Warning" />
            </Appbar.Header>
            <View style={{ flex: 1, padding: 10 }}>
                <Text style={{ fontSize: 18, fontWeight: 'bold', marginVertical: 10 }}>Apps Using Sensitive Permissions:</Text>
                <FlatList
                    data={apps}
                    keyExtractor={(item) => item.packageName}
                    renderItem={renderAppItem}
                    ItemSeparatorComponent={() => <Divider />}
                />
            </View>
        </PaperProvider>
    );
};

export default AppPermissionsScreen;
