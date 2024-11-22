import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Modal,
} from 'react-native';
import api from '../api/axiosConfig';
import { useUserStore } from '../store/userStore';

export default function AllergyRegistration({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const [allergies, setAllergies] = useState('');
  const updateAllergyStatus = useUserStore((state: { updateAllergyStatus: boolean }) => state.updateAllergyStatus);

  const handleSubmit = async () => {
    try {
      await api.post('/food/user_allergy', { allergies: allergies.split(',').map(a => a.trim()) });
      updateAllergyStatus(true);
      onClose();
    } catch (error) {
      console.error('알러지 등록 실패:', error);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>알러지 등록</Text>
          <TextInput
            style={styles.input}
            placeholder="알러지 항목을 쉼표로 구분하여 입력하세요"
            placeholderTextColor="#888"
            value={allergies}
            onChangeText={setAllergies}
            multiline
          />
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
              <Text style={styles.buttonText}>등록</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={onClose}>
              <Text style={styles.buttonText}>취소</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#333',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  input: {
    backgroundColor: '#444',
    color: '#fff',
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
    height: 100,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#FF3B30',
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
}); 