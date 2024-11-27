import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import api from '../api/axiosConfig';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface Exercise {
  main: string[];
  add: string[];
}

export default function WorkoutRecommend(): React.ReactElement {
  const navigation = useNavigation();
  const [exercises, setExercises] = useState<Exercise | null>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    fetchWorkoutPlan();
  }, []);

  const fetchWorkoutPlan = async () => {
    try {
      const response = await api.get('/exercise/plan');
      if (response.status === 200) {
        setExercises(response.data);
      }
    } catch (error: any) {
      if (error.response?.status === 401) {
        setError('인증이 필요합니다.');
      } else if (error.response?.status === 500) {
        setError('서버 오류가 발생했습니다.');
        console.error('서버 응답:', error.response?.data);
      } else {
        setError('운동 계획을 불러오는데 실패했습니다.');
      }
      console.error('운동 계획 조회 실패:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerButton}>
          <Icon name='arrow-left' size={24} color='#fff' />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Today's Workout</Text>
        <View style={styles.headerButton} />
      </View>

      {error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : (
        <ScrollView style={styles.content}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Main Exercises</Text>
            {exercises?.main.map((exercise, index) => (
              <View key={index} style={styles.exerciseItem}>
                <Icon name='dumbbell' size={24} color='#4ECDC4' style={styles.exerciseIcon} />
                <Text style={styles.exerciseText}>{exercise}</Text>
              </View>
            ))}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Additional Exercises</Text>
            {exercises?.add.map((exercise, index) => (
              <View key={index} style={styles.exerciseItem}>
                <Icon name='arm-flex' size={24} color='#6C5CE7' style={styles.exerciseIcon} />
                <Text style={styles.exerciseText}>{exercise}</Text>
              </View>
            ))}
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1A1A',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  headerButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  exerciseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#333',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  exerciseIcon: {
    marginRight: 12,
  },
  exerciseText: {
    fontSize: 16,
    color: '#fff',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 16,
  },
});
