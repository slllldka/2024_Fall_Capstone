import React, {useState} from 'react';
import {Modal, View, Text, StyleSheet, TouchableOpacity, TextInput, Animated} from 'react-native';
import {BlurView} from '@react-native-community/blur';
import api from '../api/axiosConfig';

interface WeightRegistrationProps {
  visible: boolean;
  onClose: () => void;
}

export default function WeightRegistration({visible, onClose}: WeightRegistrationProps) {
  const [weight, setWeight] = useState('');
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
      const response = await api.post('/exercise/weight', {
        weight: parseFloat(weight),
      });

      if (response.status === 201) {
        onClose();
        setWeight('');
      }
    } catch (error) {
      console.error('체중 등록 실패:', error);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <BlurView
        style={styles.centeredView}
        blurType="dark"
        blurAmount={20}
        reducedTransparencyFallbackColor="transparent">
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
          ]}>
          <Text style={styles.modalTitle}>Register Weight</Text>
          <TextInput
            style={styles.input}
            value={weight}
            onChangeText={setWeight}
            placeholder="Enter weight (kg)"
            keyboardType="decimal-pad"
            placeholderTextColor="#666"
          />
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
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  modalView: {
    width: '80%',
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
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
  },
  input: {
    width: '100%',
    backgroundColor: '#444',
    borderRadius: 8,
    padding: 12,
    color: '#fff',
    marginBottom: 15,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
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
