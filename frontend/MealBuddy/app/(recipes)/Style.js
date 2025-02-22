import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#FFF4E4',
        borderRadius: 10,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        elevation: 2,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginVertical: 10,
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: '600',
        color: '#555',
        marginVertical: 10,
    },
    ingredient: {
        fontSize: 18,
        color: '#444',
        marginVertical: 4,
    },
    instruction: {
        fontSize: 18,
        color: '#444',
        marginVertical: 4,
    },
    nutritionalInfo: {
        fontSize: 18,
        color: '#444',
    },
    noData: {
        fontSize: 18,
        color: '#888',
    },
});

export default styles;
