// components/InputBtn.tsx

import React from 'react';
import {TextInput, StyleSheet, TextInputProps} from 'react-native';

interface InputBtnProps extends TextInputProps {
  placeholder: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
}

const InputBtn: React.FC<InputBtnProps> = ({
  placeholder,
  onChangeText,
  secureTextEntry = false,
  ...rest
}) => {
  return (
    <TextInput
      style={styles.input}
      placeholder={placeholder}
      placeholderTextColor='#888'
      onChangeText={onChangeText}
      secureTextEntry={secureTextEntry}
      autoCapitalize='none'
      {...rest}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    width: '85%',
    height: 45,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    color: '#fff',
    backgroundColor: '#333',
  },
});

export default InputBtn;
