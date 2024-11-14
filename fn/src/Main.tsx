import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, SafeAreaView} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';

export default function Main(): React.ReactElement {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerButton}>
          {/*<Icon name='arrow-back' size={24} color='#ffffff' />*/}
          <Text style={styles.userText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>FLEX Coach</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Profile')} style={styles.userText}>
          {/*<Icon name='person-circle' size={24} color='#ffffff' />*/}
          <Text style={styles.headerTitle}>Profile</Text>
        </TouchableOpacity>
      </View>

      {/* Box field */}
      <View style={styles.container}>
        <View style={styles.boxRow}>
          <TouchableOpacity onPress={() => navigation.navigate('ChatRoom')} style={styles.inbox}>
            <Text style={styles.userText}>IF You ate something?</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('ChatRoom')} style={styles.inbox}>
            <Text style={styles.userText}>Meal recommendation</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.boxRow}>
          <TouchableOpacity onPress={() => navigation.navigate('ChatRoom')} style={styles.inbox}>
            <Text style={styles.userText}>Exercise</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('ChatRoom')} style={styles.inbox}>
            <Text style={styles.userText}>Exercise Charts</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#1e1e1e',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 15,
    backgroundColor: '#1e1e1e',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  headerButton: {
    padding: 10,
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  boxRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  inbox: {
    flex: 1,
    height: 150,
    marginHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#262626',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  userText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
