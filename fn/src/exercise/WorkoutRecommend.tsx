import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import api from '../api/axiosConfig';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Exercise {
  main: ExerciseItem[];
  add: ExerciseItem[];
}

interface ExerciseItem {
  id: number;
  name: string;
  muscle_part: string;
  sub_part: string;
  calorie_male: number;
  calorie_female: number;
  setnum: number;
  default: boolean;
  isCompleted?: boolean;
}

export default function WorkoutRecommend(): React.ReactElement {
  const navigation = useNavigation();
  const [exercises, setExercises] = useState<Exercise | null>(null);
  const [error, setError] = useState<string>('');

  // 오늘 날짜의 키 생성
  const getTodayKey = () => {
    const today = new Date();
    return `completed_exercises_${today.toISOString().split('T')[0]}`;
  };

  // 완료된 운동 목록 불러오기
  const loadCompletedExercises = async () => {
    try {
      const todayKey = getTodayKey();
      const savedExercises = await AsyncStorage.getItem(todayKey);
      if (savedExercises) {
        const completedExercises = JSON.parse(savedExercises);
        return completedExercises;
      }
      return {main: [], add: []};
    } catch (error) {
      console.error('완료된 운동 불러오기 실패:', error);
      return {main: [], add: []};
    }
  };

  // 완료된 운동 저장하기
  const saveCompletedExercise = async (exerciseName: string, type: 'main' | 'add') => {
    try {
      const todayKey = getTodayKey();
      const completedExercises = await loadCompletedExercises();
      completedExercises[type].push(exerciseName);
      await AsyncStorage.setItem(todayKey, JSON.stringify(completedExercises));
    } catch (error) {
      console.error('완료된 운동 저장 실패:', error);
    }
  };

  useEffect(() => {
    const initializeExercises = async () => {
      try {
        const response = await api.get('/exercise/plan');
        if (response.status === 200) {
          const completedExercises = await loadCompletedExercises();

          const exercisesWithCompletionStatus = {
            main: response.data.main.map((exercise: ExerciseItem) => ({
              ...exercise,
              isCompleted: completedExercises.main.includes(exercise.name),
            })),
            add: response.data.add.map((exercise: ExerciseItem) => ({
              ...exercise,
              isCompleted: completedExercises.add.includes(exercise.name),
            })),
          };

          setExercises(exercisesWithCompletionStatus);
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

    initializeExercises();
  }, []);

  const handleExerciseComplete = async (exerciseName: string, type: 'main' | 'add') => {
    try {
      const currentExercise = exercises?.[type].find(ex => ex.name === exerciseName);
      if (currentExercise?.isCompleted) {
        return;
      }

      const response = await api.post('/exercise/done_exercise', {
        [type]: exerciseName,
      });

      if (response.status === 200) {
        await saveCompletedExercise(exerciseName, type);

        setExercises(prev => {
          if (!prev) return null;
          const updatedExercises = {
            ...prev,
            [type]: prev[type].map(exercise =>
              exercise.name === exerciseName ? {...exercise, isCompleted: true} : exercise,
            ),
          };
          console.log('Updated exercises:', updatedExercises);
          return updatedExercises;
        });
      }
    } catch (error) {
      console.error('운동 완료 처리 실패:', error);
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

      {!error && (
        <ScrollView style={styles.content}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Main Exercises</Text>
            {exercises?.main.map(exercise => (
              <TouchableOpacity
                key={exercise.id}
                style={[styles.exerciseItem, exercise.isCompleted && styles.exerciseItemCompleted]}
                onPress={() => handleExerciseComplete(exercise.name, 'main')}
              >
                <Icon
                  name={exercise.isCompleted ? 'check-circle' : 'dumbbell'}
                  size={24}
                  color={exercise.isCompleted ? '#4CAF50' : '#4ECDC4'}
                  style={styles.exerciseIcon}
                />
                <View style={styles.exerciseInfo}>
                  <Text style={[styles.exerciseName, exercise.isCompleted && styles.completedText]}>
                    {exercise.name}
                  </Text>
                  <Text style={styles.exerciseDetail}>
                    {exercise.muscle_part} - {exercise.sub_part}
                  </Text>
                  <Text style={styles.exerciseSet}>{exercise.setnum} sets</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Additional Exercises</Text>
            {exercises?.add.map(exercise => (
              <TouchableOpacity
                key={exercise.id}
                style={[styles.exerciseItem, exercise.isCompleted && styles.exerciseItemCompleted]}
                onPress={() => handleExerciseComplete(exercise.name, 'add')}
              >
                <Icon
                  name={exercise.isCompleted ? 'check-circle' : 'arm-flex'}
                  size={24}
                  color={exercise.isCompleted ? '#4CAF50' : '#6C5CE7'}
                  style={styles.exerciseIcon}
                />
                <View style={styles.exerciseInfo}>
                  <Text style={[styles.exerciseName, exercise.isCompleted && styles.completedText]}>
                    {exercise.name}
                  </Text>
                  <Text style={styles.exerciseDetail}>
                    {exercise.muscle_part} - {exercise.sub_part}
                  </Text>
                  <Text style={styles.exerciseSet}>{exercise.setnum} sets</Text>
                </View>
              </TouchableOpacity>
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
  exerciseInfo: {
    flex: 1,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  exerciseDetail: {
    fontSize: 14,
    color: '#fff',
  },
  exerciseSet: {
    fontSize: 12,
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
  exerciseItemCompleted: {
    backgroundColor: '#2A3A2A',
    borderColor: '#4CAF50',
    borderWidth: 1,
  },
  completedText: {
    color: '#4CAF50',
    textDecorationLine: 'line-through',
  },
});
