import React, {useState} from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Animated,
} from 'react-native';
import {BlurView} from '@react-native-community/blur';
import api from '../api/axiosConfig';

interface MuscleRegistrationProps {
  visible: boolean;
  onClose: () => void;
}

export default function MuscleRegistration({visible, onClose}: MuscleRegistrationProps) {
  const [muscleData, setMuscleData] = useState({
    right_arm_muscle_mass: '',
    left_arm_muscle_mass: '',
    body_muscle_mass: '',
    right_leg_muscle_mass: '',
    left_leg_muscle_mass: '',
  });
  const [animation] = useState(new Animated.Value(0));

  React.useEffect(() => {
    if (visible) {
      Animated.spring(animation, {
        toValue: 1,
        useNativeDriver: true,
        tension: 50,
        friction: 7,
      }).start();
    } else {
      Animated.spring(animation, {
        toValue: 0,
        useNativeDriver: true,
        tension: 50,
        friction: 7,
      }).start();
    }
  }, [visible]);

  const handleSubmit = async () => {
    try {
      const formattedData = Object.entries(muscleData).reduce(
        (acc, [key, value]) => ({
          ...acc,
          [key]: parseFloat(value),
        }),
        {},
      );

      const response = await api.post('/exercise/muscle', formattedData);

      if (response.status === 201) {
        onClose();
        setMuscleData({
          right_arm_muscle_mass: '',
          left_arm_muscle_mass: '',
          body_muscle_mass: '',
          right_leg_muscle_mass: '',
          left_leg_muscle_mass: '',
        });
      }
    } catch (error) {
      console.error('근육 정보 등록 실패:', error);
    }
  };

  return (
    <Modal visible={visible} transparent animationType='fade' onRequestClose={onClose}>
      <BlurView
        style={styles.centeredView}
        blurType='dark'
        blurAmount={20}
        reducedTransparencyFallbackColor='transparent'
      >
        <Animated.View
          style={[
            styles.modalView,
            {
              transform: [
                {
                  scale: animation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.9, 1],
                  }),
                },
              ],
              opacity: animation,
            },
          ]}
        >
          <Text style={styles.modalTitle}>Register Muscle Information</Text>
          <ScrollView style={styles.scrollView}>
            {Object.entries(muscleData).map(([key, value]) => (
              <View key={key} style={styles.inputContainer}>
                <Text style={styles.label}>{key.split('_').join(' ').toUpperCase()}</Text>
                <TextInput
                  style={styles.input}
                  value={value}
                  onChangeText={text => setMuscleData(prev => ({...prev, [key]: text}))}
                  placeholder='Enter mass'
                  keyboardType='decimal-pad'
                  placeholderTextColor='#666'
                />
              </View>
            ))}
          </ScrollView>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
              <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={onClose}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </BlurView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: '#333',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  scrollView: {
    width: '100%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 15,
  },
  label: {
    color: '#fff',
    marginBottom: 5,
    fontSize: 14,
  },
  input: {
    width: '100%',
    backgroundColor: '#444',
    borderRadius: 8,
    padding: 12,
    color: '#fff',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 15,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 8,
    width: '45%',
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#FF3B30',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
