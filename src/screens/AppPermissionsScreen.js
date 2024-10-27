import { NativeModules } from 'react-native';
import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Provider as PaperProvider, Text, Appbar, List, Divider, Avatar } from 'react-native-paper';

const { AppPermissions } = NativeModules;

const AppPermissionsScreen = () => {
    const [apps, setApps] = useState([]);

    // Map Android permissions to user-friendly labels
    const permissionLabels = {
        "android.permission.CAMERA": "Camera",
        "android.permission.ACCESS_FINE_LOCATION": "Location",
        "android.permission.RECORD_AUDIO": "Microphone",
        // Add additional sensitive permissions as needed
    };

    useEffect(() => {
        AppPermissions.getInstalledAppsWithPermissions()
            .then((result) => {
                const filteredApps = result.filter((app) => {
                    const permissions = app.permissions || [];
                    // Filter for apps that use any of the sensitive permissions
                    return permissions.some((permission) =>
                        ["android.permission.CAMERA", "android.permission.ACCESS_FINE_LOCATION", "android.permission.RECORD_AUDIO"].includes(permission)
                    );
                });
                setApps(filteredApps);
            })
            .catch((error) => console.error(error));
    }, []);

    const renderAppItem = ({ item }) => {
        const filteredPermissions = item.permissions
            .filter(permission => permissionLabels[permission]) // Only include sensitive permissions
            .map(permission => permissionLabels[permission]); // Convert to friendly names

        return (
            <List.Item
                title={item.appName}
                description={`Permissions: ${filteredPermissions.join(", ")}`}
                left={() => <Avatar.Icon icon="alert" color="#f44336" />}
                right={() => <Text style={styles.sensitiveText}>Sensitive Access</Text>}
            />
        );
    };

    return (
        <PaperProvider>
            <Appbar.Header>
                <Appbar.Content title="App Permissions" subtitle="Sensitive Permissions Warning" />
            </Appbar.Header>
            <View style={styles.container}>
                <Text style={styles.header}>Apps Using Sensitive Permissions:</Text>
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    header: {
        fontSize: 18,
        fontWeight: 'bold',
        marginVertical: 10,
    },
    sensitiveText: {
        color: 'red',
        fontWeight: 'bold',
    },
});

export default AppPermissionsScreen;

