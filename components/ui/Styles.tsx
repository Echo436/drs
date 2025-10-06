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
        gap: 30,
    },
    card: {
        // borderWidth: 0.5,
        borderRadius: 20,
        // shadowColor: 'rgb(0, 0, 0)',
        // shadowOffset: {
        //     width: 0,
        //     height: 0.5,
        // },
        // shadowOpacity: 0.05,
        // shadowRadius: 4,

        // marginBottom: 25,
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