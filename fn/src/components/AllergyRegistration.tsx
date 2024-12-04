import React, {useState} from 'react';
import {View, Text, StyleSheet, TextInput, TouchableOpacity, Modal} from 'react-native';
import api from '../api/axiosConfig';
import {useUserStore} from '../store/userStore';
import {BlurView} from '@react-native-community/blur';

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
      console.log('Submitting allergies:', allergyList);
      await api.post('/food/user_allergy', {allergies: allergyList});
      updateAllergyStatus(true);
      onClose();
    } catch (error) {
      console.error('Failed to submit allergies:', error);
    }
  };

  const handleCancel = () => {
    console.log('Cancel button pressed');
    setAllergyList([]);
    setCurrentAllergy('');
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType='fade'>
      <BlurView
        style={styles.modalOverlay}
        blurType='dark'
        blurAmount={40}
        reducedTransparencyFallbackColor='transparent'
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.title}>Allergy Registration</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder='Enter allergy item'
                placeholderTextColor='#888'
                value={currentAllergy}
                onChangeText={setCurrentAllergy}
                onSubmitEditing={addAllergy}
              />
              <TouchableOpacity style={styles.addButton} onPress={addAllergy}>
                <Text style={styles.buttonText}>ADD</Text>
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
                <Text style={styles.buttonText}>SUBMIT</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={handleCancel}>
                <Text style={styles.buttonText}>CANCEL</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </BlurView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  modalContainer: {
    width: '90%',
    backgroundColor: '#262626',
    borderRadius: 20,
    padding: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalContent: {
    width: '100%',
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
