import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Dimensions} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {StackNavigationProp} from '@react-navigation/stack';
import {useUserStore} from '../store/userStore';
import AllergyRegistration from '../components/AllergyRegistration';
import LinearGradient from 'react-native-linear-gradient';

type RootStackParamList = {
  Main: undefined;
  Profile: undefined;
  FoodInput: undefined;
  ChatRoom: undefined;
  ChartPage: undefined;
};

interface UserState {
  userInfo: {
    registered_allergy: boolean;
    name?: string;
    email?: string;
    age?: number;
    height?: number;
    weight?: number;
    gender?: 'male' | 'female' | 'other';
    allergies?: string[];
  } | null;
  fetchUserInfo: () => Promise<void>;
}

const {width} = Dimensions.get('window');

export default function Main(): React.ReactElement {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [allergyModalVisible, setAllergyModalVisible] = useState(false);
  const userInfo = useUserStore((state: UserState) => state.userInfo);
  const fetchUserInfo = useUserStore((state: UserState) => state.fetchUserInfo);

  useEffect(() => {
    const checkAllergyStatus = async () => {
      await fetchUserInfo();
      if (userInfo && !userInfo.registered_allergy) {
        setAllergyModalVisible(true);
      }
    };

    checkAllergyStatus();
  }, []);

  const menuItems = [
    {
      title: 'Food Tracking',
      subtitle: 'Record your meals',
      icon: 'food-apple',
      route: 'FoodInput',
      gradient: ['#FF6B6B', '#FF8E8E'],
    },
    {
      title: 'Meal Plan',
      subtitle: 'Get recommendations',
      icon: 'silverware-fork-knife',
      route: 'ChatRoom',
      gradient: ['#4ECDC4', '#45B7AF'],
    },
    {
      title: 'Workout',
      subtitle: 'Exercise guide',
      icon: 'dumbbell',
      route: 'ChatRoom',
      gradient: ['#6C5CE7', '#8067E7'],
    },
    {
      title: 'Progress',
      subtitle: 'View your stats',
      icon: 'chart-line',
      route: 'ChartPage',
      gradient: ['#F9C74F', '#F3B233'],
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerButton}>
          <Icon
            onPress={() => navigation.goBack()}
            name='arrow-left'
            size={28}
            color='#ffffff'
            style={styles.icon}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>FLEX Coach</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('Profile')}
          style={styles.headerButton}
        >
          <Icon name='account' size={28} color='#ffffff' style={styles.icon} />
        </TouchableOpacity>
      </View>

      <View style={styles.welcomeSection}>
        <Text style={styles.welcomeText}>Hello, {userInfo?.name || 'User'}!</Text>
        <Text style={styles.welcomeSubtext}>Ready to achieve your goals?</Text>
      </View>

      <View style={styles.container}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => navigation.navigate(item.route)}
            style={styles.menuItem}
          >
            <LinearGradient
              colors={item.gradient}
              style={styles.gradientBox}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 1}}
            >
              <Icon name={item.icon} size={32} color='#ffffff' />
              <View style={styles.menuTextContainer}>
                <Text style={styles.menuTitle}>{item.title}</Text>
                <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </View>

      <AllergyRegistration
        visible={allergyModalVisible}
        onClose={() => setAllergyModalVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#1A1A1A',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#1A1A1A',
  },
  headerButton: {
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: 'System',
  },
  welcomeSection: {
    padding: 20,
    marginBottom: 10,
  },
  welcomeText: {
    color: '#ffffff',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  welcomeSubtext: {
    color: '#9E9E9E',
    fontSize: 16,
  },
  container: {
    flex: 1,
    padding: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  menuItem: {
    width: (width - 40) / 2,
    height: 160,
    margin: 5,
  },
  gradientBox: {
    flex: 1,
    borderRadius: 20,
    padding: 20,
    justifyContent: 'space-between',
  },
  menuTextContainer: {
    marginTop: 'auto',
  },
  menuTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  menuSubtitle: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
  },
  icon: {
    width: 28,
    height: 28,
    textAlign: 'center',
  },
});
