import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Dimensions,
  Modal,
} from 'react-native';
import {LineChart} from 'react-native-chart-kit';
import {useNavigation} from '@react-navigation/native';
import api from '../api/axiosConfig';
import Icon from 'react-native-vector-icons/AntDesign';
import {ProgressChart} from 'react-native-chart-kit';
import {BarChart} from 'react-native-chart-kit';
import {BlurView} from '@react-native-community/blur';

const screenWidth = Dimensions.get('window').width;

interface MuscleData {
  date: string;
  right_arm_muscle_mass: number;
  left_arm_muscle_mass: number;
  body_muscle_mass: number;
  right_leg_muscle_mass: number;
  left_leg_muscle_mass: number;
}

interface MuscleHistory {
  date: string;
  right_arm_muscle_mass: number;
  left_arm_muscle_mass: number;
  body_muscle_mass: number;
  right_leg_muscle_mass: number;
  left_leg_muscle_mass: number;
}

export default function ExerciseProgress(): React.ReactElement {
  const navigation = useNavigation();
  const [weightData, setWeightData] = useState<number[]>([]);
  const [muscleMassData, setMuscleMassData] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [latestMuscleData, setLatestMuscleData] = useState<MuscleData | null>(null);
  const [muscleHistory, setMuscleHistory] = useState<MuscleHistory[]>([]);
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const weightResponse = await api.get('/exercise/weight');
      if (weightResponse.status === 200) {
        const weights = weightResponse.data.weights.map((entry: {weight: number}) => entry.weight);
        setWeightData(weights);
      }

      const muscleResponse = await api.get('/exercise/muscle');
      if (muscleResponse.status === 200 && muscleResponse.data.muscles.length > 0) {
        const muscles = muscleResponse.data.muscles;
        setMuscleMassData(muscles.map((entry: MuscleData) => entry.body_muscle_mass));
        setLatestMuscleData(muscles[0]);
      }
    } catch (error: any) {
      if (error.response?.status === 404) {
        setError('아직 기록된 데이터가 없습니다.');
      } else if (error.response?.status === 401) {
        setError('인증에 실패했습니다. 다시 로그인해주세요.');
      } else {
        setError('데이터를 불러오는데 실패했습니다.');
      }
      console.error('데이터 조회 실패:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMuscleHistory = async () => {
    try {
      const response = await api.get('/exercise/muscle');
      if (response.status === 200) {
        setMuscleHistory(
          response.data.muscles.sort(
            (a: MuscleHistory, b: MuscleHistory) =>
              new Date(a.date).getTime() - new Date(b.date).getTime(),
          ),
        );
      }
    } catch (error) {
      console.error('근육 이력 조회 실패:', error);
    }
  };

  useEffect(() => {
    fetchMuscleHistory();
  }, []);

  const renderChart = (title: string, data: number[], suffix: string) => {
    if (data.length === 0) {
      return (
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>{title}</Text>
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>데이터가 없습니다</Text>
          </View>
        </View>
      );
    }

    return (
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>{title}</Text>
        <LineChart
          data={{
            labels: data.map((_, index) => `Day ${index + 1}`),
            datasets: [{data}],
          }}
          width={screenWidth - 40}
          height={220}
          yAxisSuffix={suffix}
          chartConfig={chartConfig}
          style={styles.chart}
        />
      </View>
    );
  };

  const renderMuscleBarChart = (latestMuscleData: MuscleData | null) => {
    if (!latestMuscleData) {
      return (
        <View style={styles.chartContainer}>
          <Text>if you want to see the muscle history, please press the chart</Text>
          <Text style={styles.chartTitle}>Muscle Distribution</Text>

          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>데이터가 없습니다</Text>
          </View>
        </View>
      );
    }

    const data = {
      labels: ['왼팔', '오른팔', '몸통', '왼다리', '오른다리'],
      datasets: [
        {
          data: [
            latestMuscleData.left_arm_muscle_mass,
            latestMuscleData.right_arm_muscle_mass,
            latestMuscleData.body_muscle_mass,
            latestMuscleData.left_leg_muscle_mass,
            latestMuscleData.right_leg_muscle_mass,
          ],
        },
      ],
    };

    return (
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Muscle Distribution (kg)</Text>
        <TouchableOpacity onPress={() => setShowHistoryModal(true)}>
          <BarChart
            data={data}
            width={screenWidth - 40}
            height={220}
            yAxisSuffix='kg'
            chartConfig={{
              ...chartConfig,
              barPercentage: 0.7,
              propsForLabels: {
                fontSize: 12,
              },
              propsForVerticalLabels: {
                fontSize: 10,
              },
            }}
            style={styles.chart}
            showValuesOnTopOfBars={true}
            fromZero={true}
          />
        </TouchableOpacity>
        <View style={styles.muscleCompareContainer}>
          <View style={styles.compareRow}>
            <Text style={styles.compareTitle}>팔 근육 좌우 비교:</Text>
            <Text style={styles.compareValue}>
              {Math.abs(
                latestMuscleData.left_arm_muscle_mass - latestMuscleData.right_arm_muscle_mass,
              ).toFixed(2)}
              kg 차이
            </Text>
          </View>
          <View style={styles.compareRow}>
            <Text style={styles.compareTitle}>다리 근육 좌우 비교:</Text>
            <Text style={styles.compareValue}>
              {Math.abs(
                latestMuscleData.left_leg_muscle_mass - latestMuscleData.right_leg_muscle_mass,
              ).toFixed(2)}
              kg 차이
            </Text>
          </View>
        </View>
      </View>
    );
  };

  const renderMuscleHistoryModal = () => {
    if (muscleHistory.length === 0) return null;

    const dates = muscleHistory.map(data => data.date.split('T')[0]);
    const muscleTypes = [
      {key: 'left_arm_muscle_mass', label: '왼팔', color: 'rgba(255, 99, 132, 1)'},
      {key: 'right_arm_muscle_mass', label: '오른팔', color: 'rgba(54, 162, 235, 1)'},
      {key: 'body_muscle_mass', label: '몸통', color: 'rgba(255, 206, 86, 1)'},
      {key: 'left_leg_muscle_mass', label: '왼다리', color: 'rgba(75, 192, 192, 1)'},
      {key: 'right_leg_muscle_mass', label: '오른다리', color: 'rgba(153, 102, 255, 1)'},
    ];

    return (
      <Modal
        visible={showHistoryModal}
        transparent
        animationType='fade'
        onRequestClose={() => setShowHistoryModal(false)}
      >
        <BlurView style={styles.modalContainer} blurType='dark' blurAmount={10}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>근육량 변화 추이</Text>
            <ScrollView>
              {muscleTypes.map(muscleType => (
                <View key={muscleType.key} style={styles.chartWrapper}>
                  <Text style={styles.muscleTypeTitle}>{muscleType.label} 근육량 변화</Text>
                  <LineChart
                    data={{
                      labels: dates,
                      datasets: [
                        {
                          data: muscleHistory.map(
                            data => data[muscleType.key as keyof MuscleHistory],
                          ),
                          color: () => muscleType.color,
                        },
                      ],
                    }}
                    width={screenWidth - 80}
                    height={180}
                    chartConfig={{
                      ...chartConfig,
                      color: () => muscleType.color,
                      propsForLabels: {
                        fontSize: 10,
                      },
                    }}
                    bezier
                    style={[styles.chart, {marginVertical: 8}]}
                    withDots={true}
                    withInnerLines={true}
                    yAxisSuffix='kg'
                  />
                </View>
              ))}
            </ScrollView>
            <TouchableOpacity style={styles.closeButton} onPress={() => setShowHistoryModal(false)}>
              <Text style={styles.closeButtonText}>닫기</Text>
            </TouchableOpacity>
          </View>
        </BlurView>
      </Modal>
    );
  };

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size='large' color='#ffffff' />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchData}>
          <Text style={styles.retryButtonText}>다시 시도</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} stickyHeaderIndices={[0]}>
      <SafeAreaView style={styles.safeArea}>
        <TouchableOpacity style={styles.header} onPress={() => navigation.goBack()}>
          <Text style={styles.headerTitle}>Go back</Text>
        </TouchableOpacity>
      </SafeAreaView>

      {renderChart('Weight Trend', weightData, ' kg')}
      {renderMuscleBarChart(latestMuscleData)}
      {renderMuscleHistoryModal()}
    </ScrollView>
  );
}

const chartConfig = {
  backgroundGradientFrom: '#1e1e1e',
  backgroundGradientTo: '#1e1e1e',
  color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
  strokeWidth: 2,
  barPercentage: 0.5,
  decimalPlaces: 1,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e1e1e',
    padding: 20,
  },
  header: {
    marginTop: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    marginBottom: 20,
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  chartContainer: {
    marginBottom: 30,
  },
  chartTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  chart: {
    borderRadius: 16,
  },
  centerContainer: {
    flex: 1,
    backgroundColor: '#1e1e1e',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: '#ff6b6b',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#4a90e2',
    padding: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyContainer: {
    height: 220,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2a2a2a',
    borderRadius: 16,
  },
  emptyText: {
    color: '#9e9e9e',
    fontSize: 16,
  },
  radarContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  legendContainer: {
    padding: 10,
    marginTop: 10,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  legendText: {
    color: '#ffffff',
    fontSize: 14,
  },
  muscleCompareContainer: {
    marginTop: 15,
    padding: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
  },
  compareRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 5,
  },
  compareTitle: {
    color: '#ffffff',
    fontSize: 14,
  },
  compareValue: {
    color: '#48D1CC',
    fontSize: 14,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '95%',
    maxHeight: '90%',
    backgroundColor: '#1e1e1e',
    borderRadius: 20,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 20,
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: '#4a90e2',
    padding: 12,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  chartWrapper: {
    marginVertical: 10,
    padding: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 10,
  },
  muscleTypeTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
});
