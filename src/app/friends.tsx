import { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, ActivityIndicator } from "react-native";
import * as Security from 'expo-secure-store';
import { httpClient } from "../../utils/generic-request";
import { environment } from "../environment/environment";
import Header from "../../components/header";
import LayoutPage from "../../layouts/dark-layout";
import Icon from "react-native-vector-icons/FontAwesome5";

interface IFriends {
    id: string;
    requesterUserId: string;
    requesterUserName: string;
    requesterUserImg: string;
}

const FriendsPage = () => {
    const title = "Amigos / Solicitações";
    const [friends, setFriends] = useState<IFriends[]>([]);
    const [requestsFriends, setRequestsFriends] = useState<IFriends[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        fetchFriends();
        listAllFriendRequest();
    }, []);

    const listAllFriendRequest = async () => {
        try {
            const userId = await Security.getItemAsync('userId');
            if (!userId) return;

            const response = await httpClient.genericRequest(`${environment.listAllFriendRequest}/${userId}`, "GET") as IFriends[];
            setRequestsFriends(response);
        } catch (error) {
            console.error("Erro ao buscar solicitações de amizade:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchFriends = async () => {
        try {
            const userId = await Security.getItemAsync('userId');
            if (!userId) return;

            const response = await httpClient.genericRequest(`${environment.findAllFriends}/${userId}`, "GET") as IFriends[];
            setFriends(response);
        } catch (error) {
            console.error("Erro ao buscar amigos:", error);
        } finally {
            setLoading(false);
        }
    };

    const renderAllFriends = ({ item }: { item: IFriends }) => (
        <TouchableOpacity style={styles.card}>
            <Image source={{ uri: item.requesterUserImg }} style={styles.image} />
            <View style={styles.info}>
                <Text style={styles.friendName}>{item.requesterUserName}</Text>
            </View>
            <Icon name="comment-dots" size={24} color="#fff" style={styles.Icon} />
        </TouchableOpacity>
    );

    const renderRequestsFriends = ({ item }: { item: IFriends }) => (
        <TouchableOpacity style={styles.card}>
            <Image source={{ uri: item.requesterUserImg }} style={styles.image} />
            <View style={styles.info}>
                <Text style={styles.friendName}>{item.requesterUserName}</Text>
            </View>
            <Icon name="user-plus" size={24} color="#fff" style={styles.Icon}/>
        </TouchableOpacity>
    );

    return (
        <LayoutPage>
            <Header title={title} />
            <View style={styles.container}>
                <Text style={styles.sectionTitle}>Solicitações de Amizade</Text>
                {loading ? (
                    <ActivityIndicator size="large" color="#6200EE" />
                ) : requestsFriends.length > 0 ? (
                    <FlatList
                        data={requestsFriends}
                        keyExtractor={(item) => item.id}
                        renderItem={renderRequestsFriends}
                        contentContainerStyle={styles.list}
                    />
                ) : (
                    <Text style={styles.noFriendsText}>Nenhuma solicitação pendente</Text>
                )}

                <Text style={styles.sectionTitle}>Amigos</Text>
                {loading ? (
                    <ActivityIndicator size="large" color="#6200EE" />
                ) : friends.length > 0 ? (
                    <FlatList
                        data={friends}
                        keyExtractor={(item) => item.id}
                        renderItem={renderAllFriends}
                        contentContainerStyle={styles.list}
                    />
                ) : (
                    <Text style={styles.noFriendsText}>Nenhum amigo encontrado</Text>
                )}
            </View>
        </LayoutPage>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
    },
    list: {
        paddingBottom: 16,
    },
    card: {
        flexDirection: "row",
        backgroundColor: "#1E1E1E",
        borderRadius: 12,
        padding: 12,
        marginBottom: 16,
        alignItems: "center",
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 5,
    },
    image: {
        width: 60,
        height: 60,
        borderRadius: 30,
        marginRight: 12,
    },
    info: {
        flex: 1,
        justifyContent: "center",
    },
    friendName: {
        fontSize: 18,
        color: "#fff",
        fontWeight: "bold",
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#fff",
        marginBottom: 10,
        marginTop: 20,
    },
    noFriendsText: {
        textAlign: "center",
        fontSize: 16,
        marginTop: 20,
        color: "#fff",
    },
    Icon: {
        marginRight: 15,

    }
});

export default FriendsPage;
