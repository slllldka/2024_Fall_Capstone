import React, {useState} from 'react';
import {Modal, View, Text, StyleSheet, TouchableOpacity, TextInput, Animated} from 'react-native';
import {BlurView} from '@react-native-community/blur';
import api from '../api/axiosConfig';

interface FoodInputProps {
  visible: boolean;
  onClose: () => void;
}

export default function FoodInput({visible, onClose}: FoodInputProps): React.ReactElement {
  const [food, setFood] = useState('');
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
      const response = await api.post('/food/select_food', {food});
      if (response.status === 201) {
        onClose();
        setFood('');
      }
    } catch (error) {
      console.error('음식 등록 실패:', error);
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
          <Text style={styles.modalTitle}>Food Tracking</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={food}
              onChangeText={setFood}
              placeholder="Enter the food you ate"
              placeholderTextColor="#666"
            />
          </View>
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
    backgroundColor: '#262626',
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
    color: '#f3f3f3',
    marginBottom: 20,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 40,
    backgroundColor: '#363636',
    borderRadius: 10,
    paddingHorizontal: 10,
    color: '#f3f3f3',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  button: {
    backgroundColor: '#0066ff',
    padding: 10,
    borderRadius: 10,
    width: '45%',
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#666',
  },
  buttonText: {
    color: '#f3f3f3',
    fontWeight: 'bold',
  },
}); 