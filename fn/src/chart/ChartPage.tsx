import React from 'react';
import {View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView} from 'react-native';
import {LineChart} from 'react-native-chart-kit';
import {Dimensions} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/AntDesign';

const screenWidth = Dimensions.get('window').width;

export default function ExerciseProgress(): React.ReactElement {
  const navigation = useNavigation();

  // Dummy data for demonstration
  const weightData = [78, 77.5, 77, 76.8, 76.5, 76];
  const muscleMassData = [30, 30.5, 31, 31.2, 31.5, 31.8];
  const exerciseTimeData = [30, 45, 50, 40, 55, 60];
  const calorieBurnData = [200, 300, 400, 350, 450, 500];
  const calorieIntakeData = [2200, 2100, 2300, 2400, 2000, 2150];

  return (
    <ScrollView style={styles.container} stickyHeaderIndices={[0]}>
      <SafeAreaView style={styles.safeArea}>
        <TouchableOpacity style={styles.header} onPress={() => navigation.goBack()}>
          <Text style={styles.headerTitle}>Go back</Text>
        </TouchableOpacity>
      </SafeAreaView>
      {/* Header */}
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Weight Trend</Text>
        <LineChart
          data={{
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{data: weightData}],
          }}
          width={screenWidth - 40}
          height={220}
          yAxisSuffix=' kg'
          chartConfig={chartConfig}
          style={styles.chart}
        />
      </View>

      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Muscle Mass Trend</Text>
        <LineChart
          data={{
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{data: muscleMassData}],
          }}
          width={screenWidth - 40}
          height={220}
          yAxisSuffix=' kg'
          chartConfig={chartConfig}
          style={styles.chart}
        />
      </View>

      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Exercise Time</Text>
        <LineChart
          data={{
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
            datasets: [{data: exerciseTimeData}],
          }}
          width={screenWidth - 40}
          height={220}
          yAxisSuffix=' min'
          chartConfig={chartConfig}
          style={styles.chart}
        />
      </View>

      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Calories Burned</Text>
        <LineChart
          data={{
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
            datasets: [{data: calorieBurnData}],
          }}
          width={screenWidth - 40}
          height={220}
          yAxisSuffix=' kcal'
          chartConfig={chartConfig}
          style={styles.chart}
        />
      </View>

      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Calories Intake</Text>
        <LineChart
          data={{
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
            datasets: [{data: calorieIntakeData}],
          }}
          width={screenWidth - 40}
          height={220}
          yAxisSuffix=' kcal'
          chartConfig={chartConfig}
          style={styles.chart}
        />
      </View>
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
  headerButton: {
    paddingHorizontal: 15,
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
});
