// components/BlueBtn.tsx

import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  GestureResponderEvent,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native';

interface BlueBtnProps {
  title: string;
  onPress: (event: GestureResponderEvent) => void;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  disabled?: boolean;
}

const BlueBtn: React.FC<BlueBtnProps> = ({title, onPress, style, textStyle, disabled = false}) => {
  return (
    <TouchableOpacity
      style={[styles.button, style, disabled && styles.disabledButton]}
      onPress={onPress}
      activeOpacity={0.7}
      disabled={disabled}
    >
      <Text style={[styles.buttonText, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#0064D2', // Dodger Blue
    paddingVertical: 18,
    paddingHorizontal: 30,
    borderRadius: 30,
    alignItems: 'center',
    marginVertical: 10,
    width: '80%',
  },
  disabledButton: {
    backgroundColor: '#A9A9A9', // Dark Gray
  },
  buttonText: {
    color: '#F3f3f3',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default BlueBtn;
