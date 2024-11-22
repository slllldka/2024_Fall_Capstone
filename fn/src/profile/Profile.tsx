import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import api from '../api/axiosConfig';
import JWTManager from '../utils/jwtManager';
import {StackNavigationProp} from '@react-navigation/stack';

interface UserInfo {
  email: string;
  first_name: string;
  last_name: string;
  gender: string;
  vegan: boolean;
  registered_allergy: boolean;
}

type RootStackParamList = {
  Profile: undefined;
  Login: undefined;
};

export default function Profile(): React.JSX.Element {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  useEffect(() => {
    fetchUserInfo();
  }, []);

  const fetchUserInfo = async () => {
    try {
      const response = await api.get('/account/myinfo');
      setUserInfo(response.data);
    } catch (error) {
      console.error('사용자 정보 조회 실패:', error);
    }
  };

  const handleLogout = async () => {
    await JWTManager.clearTokens();
    navigation.navigate('Login');
  };

  if (!userInfo) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerButton}>
          <Text style={styles.headerText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Profile</Text>
        <View style={styles.headerButton} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.infoSection}>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Email:</Text>
            <Text style={styles.value}>{userInfo.email}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Name:</Text>
            <Text style={styles.value}>{`${userInfo.first_name} ${userInfo.last_name}`}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Gender:</Text>
            <Text style={styles.value}>{userInfo.gender}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Vegan:</Text>
            <Text style={styles.value}>{userInfo.vegan ? 'Yes' : 'No'}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Allergy Registered:</Text>
            <Text style={styles.value}>{userInfo.registered_allergy ? 'Yes' : 'No'}</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#262626',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  headerButton: {
    width: 80,
  },
  headerText: {
    color: '#f3f3f3',
    fontSize: 16,
  },
  headerTitle: {
    color: '#f3f3f3',
    fontSize: 18,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  infoSection: {
    backgroundColor: '#333',
    borderRadius: 10,
    padding: 16,
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#444',
  },
  label: {
    color: '#888',
    fontSize: 16,
  },
  value: {
    color: '#f3f3f3',
    fontSize: 16,
    fontWeight: '500',
  },
  logoutButton: {
    backgroundColor: '#e74c3c',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingText: {
    color: '#f3f3f3',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
});
