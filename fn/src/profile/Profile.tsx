import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import JWTManager from '../utils/jwtManager';
import {useUserStore} from '../store/userStore';
import AllergyRegistration from '../components/AllergyRegistration';

type RootStackParamList = {
  Login: undefined;
  Main: undefined;
};

interface InfoRowProps {
  label: string;
  value: string;
}

const InfoRow = ({label, value}: InfoRowProps) => (
  <View style={styles.infoRow}>
    <Text style={styles.label}>{label}:</Text>
    <Text style={styles.value}>{value}</Text>
  </View>
);

export default function Profile(): React.JSX.Element {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [allergyModalVisible, setAllergyModalVisible] = useState(false);
  const {userInfo, fetchUserInfo} = useUserStore();

  useEffect(() => {
    fetchUserInfo();
  }, []);

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
          <InfoRow label='Email' value={userInfo.email} />
          <InfoRow label='Name' value={`${userInfo.first_name} ${userInfo.last_name}`} />
          <InfoRow label='Gender' value={userInfo.gender} />
          <InfoRow label='Vegan' value={userInfo.vegan ? 'Yes' : 'No'} />
          <InfoRow label='Allergy Registered' value={userInfo.registered_allergy ? 'Yes' : 'No'} />
        </View>

        <TouchableOpacity style={styles.allergyButton} onPress={() => setAllergyModalVisible(true)}>
          <Text style={styles.allergyButtonText}>
            {userInfo.registered_allergy ? '알러지 정보 수정' : '알러지 등록'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>

      <AllergyRegistration
        visible={allergyModalVisible}
        onClose={() => setAllergyModalVisible(false)}
      />
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
  allergyButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  allergyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
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