import { StyleSheet } from "react-native";

export const layoutStyles = StyleSheet.create({
    centerContainer: {
        flex: 1,
        alignItems: 'center',
    },
    listContainer: {
        width: '100%',
        paddingHorizontal: 14,
    },
});

export const cardStyles = StyleSheet.create({
    cardsContainer: {
        flex: 1,
        paddingHorizontal: 6,
    },
    card: {
        backgroundColor: 'rgb(255, 255, 255)',
        borderWidth: 0.5,
        borderRadius: 20,
        shadowColor: 'rgb(0, 0, 0)',
        shadowOffset: {
            width: 0,
            height: 0.5,
        },
        shadowOpacity: 0.1,
        shadowRadius: 5,

        marginBottom: 15,
    },
    cardTitle: {
        marginLeft: 15,
        marginBottom: 5,
        fontSize: 18,
        fontWeight: 'bold',
    },
    infoSection: {
        flexDirection: 'row',
        paddingVertical: 10,
        alignItems: 'center',
    },
    separator: {
        height: 1,
    },
});