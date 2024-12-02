import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Dimensions} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {StackNavigationProp} from '@react-navigation/stack';
import {useUserStore} from '../store/userStore';
import AllergyRegistration from '../components/AllergyRegistration';
import LinearGradient from 'react-native-linear-gradient';
import {BlurView} from '@react-native-community/blur';
import BodyInfoRegistration from '../components/BodyInfoRegistration';
import api from '../api/axiosConfig';
import WeightRegistration from '../components/WeightRegistration';

type RootStackParamList = {
  Main: undefined;
  Profile: undefined;
  FoodInput: undefined;
  ChatRoom: undefined;
  ChartPage: undefined;
  WorkoutRecommend: undefined;
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
  const userInfo = useUserStore(state => state.userInfo);
  const fetchUserInfo = useUserStore(state => state.fetchUserInfo);
  const [showBodyInfoModal, setShowBodyInfoModal] = useState(false);
  const [showWeightModal, setShowWeightModal] = useState(false);

  const handleAllergyClose = () => {
    console.log('Allergy modal closed');
    setAllergyModalVisible(false);
    if (!userInfo?.registered_body_info) {
      console.log('Opening body info modal');
      setShowBodyInfoModal(true);
    }
  };

  let flag = false;
  useEffect(() => {
    const checkUserStatus = async () => {
      await fetchUserInfo();
      console.log('Fetched user info:', userInfo);
      console.log('');
      if (userInfo) {
        if (!userInfo.registered_allergy) {
          console.log('Opening allergy modal');
          setAllergyModalVisible(true);
          flag = true;
        } else if (!userInfo.registered_body_info) {
          console.log('Opening body info modal');
          setShowBodyInfoModal(true);
        }
      }
    };

    checkUserStatus();
  }, [flag, userInfo?.registered_allergy, userInfo?.registered_body_info]);

  useEffect(() => {
    const checkWeight = async () => {
      try {
        const response = await api.get('/exercise/weight');
        console.log('Weight:', response.data.weights);

        if (response.data.weights && response.data.weights.length > 0) {
          const latestDate = new Date(response.data.weights[0].date);
          const today = new Date();
          const diffDays = Math.floor(
            (today.getTime() - latestDate.getTime()) / (1000 * 60 * 60 * 24),
          );

          if (diffDays >= 5) {
            navigation.navigate('Profile');
          }
        }
      } catch (error: any) {
        console.error('체중 정보 조회 실패:', error);
        if (error.response && error.response.status === 404) {
          setShowWeightModal(true);
        }
      }
    };
    checkWeight();
  }, [navigation]);

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
      route: 'WorkoutRecommend',
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
            <BlurView
              style={styles.blurContainer}
              blurType='dark'
              blurAmount={10}
              reducedTransparencyFallbackColor='transparent'
            >
              <LinearGradient
                colors={[`${item.gradient[0]}50`, `${item.gradient[1]}50`]}
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
            </BlurView>
          </TouchableOpacity>
        ))}
      </View>

      <AllergyRegistration visible={allergyModalVisible} onClose={handleAllergyClose} />

      <BodyInfoRegistration
        visible={showBodyInfoModal}
        onClose={() => setShowBodyInfoModal(false)}
      />
      <WeightRegistration visible={showWeightModal} onClose={() => setShowWeightModal(false)} />
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
    overflow: 'hidden',
    borderRadius: 20,
  },
  blurContainer: {
    flex: 1,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  gradientBox: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  // menuTextContainer: {
  //   marginTop: 'auto',
  //   backgroundColor: 'rgba(0, 0, 0, 0.2)',
  //   padding: 10,
  //   borderRadius: 10,
  // },
  menuTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 3,
  },
  menuSubtitle: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 3,
  },
  icon: {
    width: 28,
    height: 28,
    textAlign: 'center',
  },
});
