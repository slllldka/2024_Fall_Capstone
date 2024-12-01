import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import JWTManager from '../utils/jwtManager';
import {useUserStore} from '../store/userStore.tsx';
import AllergyRegistration from '../components/AllergyRegistration.tsx';
import WeightRegistration from '../components/WeightRegistration.tsx';
import MuscleRegistration from '../components/MuscleRegistration.tsx';
import LinearGradient from 'react-native-linear-gradient';
import {BlurView} from '@react-native-community/blur';

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
  const [weightModalVisible, setWeightModalVisible] = useState(false);
  const [muscleModalVisible, setMuscleModalVisible] = useState(false);
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

        <TouchableOpacity style={styles.menuItem} onPress={() => setWeightModalVisible(true)}>
          <BlurView
            style={styles.blurContainer}
            blurType='dark'
            blurAmount={10}
            reducedTransparencyFallbackColor='transparent'
          >
            <LinearGradient
              colors={['#007AFF50', '#0055FF50']}
              style={styles.gradientButton}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 1}}
            >
              <Text style={styles.buttonText}>Register Weight</Text>
            </LinearGradient>
          </BlurView>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => setMuscleModalVisible(true)}>
          <BlurView
            style={styles.blurContainer}
            blurType='dark'
            blurAmount={10}
            reducedTransparencyFallbackColor='transparent'
          >
            <LinearGradient
              colors={['#007AFF50', '#0055FF50']}
              style={styles.gradientButton}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 1}}
            >
              <Text style={styles.buttonText}>Register Muscle Information</Text>
            </LinearGradient>
          </BlurView>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => setAllergyModalVisible(true)}>
          <BlurView
            style={styles.blurContainer}
            blurType='dark'
            blurAmount={10}
            reducedTransparencyFallbackColor='transparent'
          >
            <LinearGradient
              colors={['#007AFF50', '#0055FF50']}
              style={styles.gradientButton}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 1}}
            >
              <Text style={styles.buttonText}>
                {userInfo.registered_allergy ? 'Fix Allergic foods' : 'Register Allergic'}
              </Text>
            </LinearGradient>
          </BlurView>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
          <BlurView
            style={styles.blurContainer}
            blurType='dark'
            blurAmount={10}
            reducedTransparencyFallbackColor='transparent'
          >
            <LinearGradient
              colors={['#e74c3c50', '#c0392b50']}
              style={styles.gradientButton}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 1}}
            >
              <Text style={styles.buttonText}>Logout</Text>
            </LinearGradient>
          </BlurView>
        </TouchableOpacity>
      </ScrollView>

      <AllergyRegistration
        visible={allergyModalVisible}
        onClose={() => setAllergyModalVisible(false)}
      />
      <WeightRegistration
        visible={weightModalVisible}
        onClose={() => setWeightModalVisible(false)}
      />
      <MuscleRegistration
        visible={muscleModalVisible}
        onClose={() => setMuscleModalVisible(false)}
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
  loadingText: {
    color: '#f3f3f3',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  menuItem: {
    height: 56,
    marginBottom: 12,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  blurContainer: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  gradientButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});
