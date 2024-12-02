import React, {useState} from 'react';
import {Modal, View, Text, StyleSheet, TouchableOpacity, TextInput} from 'react-native';
import api from '../api/axiosConfig';
import useBodyInfoStore from '../store/bodyInfoStore';

interface BodyInfoRegistrationProps {
  visible: boolean;
  onClose: () => void;
}

export default function BodyInfoRegistration({visible, onClose}: BodyInfoRegistrationProps) {
  const setHasBodyInfo = useBodyInfoStore(state => state.setHasBodyInfo);
  const [form, setForm] = useState({
    height: '',
    duration: '',
    goal: 0,
  });

  const handleSubmit = async () => {
    try {
      const response = await api.post('/exercise/body_info', {
        height: parseInt(form.height),
        duration: parseInt(form.duration),
        goal: form.goal,
      });

      if (response.status === 200) {
        setHasBodyInfo(true);
        onClose();
        setForm({height: '', duration: '', goal: 0});
      }
    } catch (error) {
      console.error('Body info registration failed:', error);
    }
  };

  return (
    <Modal visible={visible} transparent animationType='slide'>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>Register Body Information</Text>
          <TextInput
            style={styles.input}
            value={form.height}
            onChangeText={text => setForm(prev => ({...prev, height: text}))}
            placeholder='Height (cm)'
            keyboardType='numeric'
            placeholderTextColor='#666'
          />
          <TextInput
            style={styles.input}
            value={form.duration}
            onChangeText={text => setForm(prev => ({...prev, duration: text}))}
            placeholder='Exercise Duration (minutes)'
            keyboardType='numeric'
            placeholderTextColor='#666'
          />
          <View style={styles.goalContainer}>
            <TouchableOpacity
              style={[styles.goalButton, form.goal === -1 && styles.selectedGoal]}
              onPress={() => setForm(prev => ({...prev, goal: -1}))}
            >
              <Text style={styles.goalText}>Diet</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.goalButton, form.goal === 0 && styles.selectedGoal]}
              onPress={() => setForm(prev => ({...prev, goal: 0}))}
            >
              <Text style={styles.goalText}>Maintain</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.goalButton, form.goal === 1 && styles.selectedGoal]}
              onPress={() => setForm(prev => ({...prev, goal: 1}))}
            >
              <Text style={styles.goalText}>Bulk Up</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
              <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={onClose}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
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
    width: '80%',
    backgroundColor: '#262626',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#f3f3f3',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 40,
    backgroundColor: '#363636',
    borderRadius: 10,
    marginBottom: 10,
    paddingHorizontal: 10,
    color: '#f3f3f3',
  },
  goalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginVertical: 10,
  },
  goalButton: {
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#363636',
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  selectedGoal: {
    backgroundColor: '#0066ff',
  },
  goalText: {
    color: '#f3f3f3',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 20,
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
