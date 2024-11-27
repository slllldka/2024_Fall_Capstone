import React, {useState} from 'react';
import {View, Text, StyleSheet, TextInput, TouchableOpacity, Modal} from 'react-native';
import api from '../api/axiosConfig';
import {useUserStore} from '../store/userStore';

export default function AllergyRegistration({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) {
  const [allergyList, setAllergyList] = useState<string[]>([]);
  const [currentAllergy, setCurrentAllergy] = useState('');
  const updateAllergyStatus = useUserStore(state => state.updateAllergyStatus);

  const addAllergy = () => {
    if (currentAllergy.trim()) {
      setAllergyList([...allergyList, currentAllergy.trim()]);
      setCurrentAllergy('');
    }
  };

  const removeAllergy = (index: number) => {
    setAllergyList(allergyList.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    try {
      console.log({allergies: allergyList});
      await api.post('/food/user_allergy', {allergies: allergyList});
      updateAllergyStatus(true);
      onClose();
    } catch (error) {
      console.error('알러지 등록 실패:', error);
    }
  };

  return (
    <Modal visible={visible} transparent animationType='slide'>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>알러지 등록</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder='알러지 항목을 입력하세요'
              placeholderTextColor='#888'
              value={currentAllergy}
              onChangeText={setCurrentAllergy}
              onSubmitEditing={addAllergy}
            />
            <TouchableOpacity style={styles.addButton} onPress={addAllergy}>
              <Text style={styles.buttonText}>추가</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.allergyList}>
            {allergyList.map((allergy, index) => (
              <View key={index} style={styles.allergyItem}>
                <Text style={styles.allergyText}>{allergy}</Text>
                <TouchableOpacity onPress={() => removeAllergy(index)}>
                  <Text style={styles.removeButton}>X</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, allergyList.length === 0 && styles.disabledButton]}
              onPress={handleSubmit}
              disabled={allergyList.length === 0}
            >
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
    maxHeight: '80%',
  },
  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  input: {
    flex: 1,
    backgroundColor: '#444',
    color: '#fff',
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  addButton: {
    backgroundColor: '#28a745',
    padding: 10,
    borderRadius: 5,
    justifyContent: 'center',
  },
  allergyList: {
    marginBottom: 15,
  },
  allergyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#444',
    padding: 10,
    borderRadius: 5,
    marginBottom: 5,
  },
  allergyText: {
    color: '#fff',
  },
  removeButton: {
    color: '#ff4444',
    fontSize: 16,
    fontWeight: 'bold',
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
  disabledButton: {
    backgroundColor: '#666',
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
