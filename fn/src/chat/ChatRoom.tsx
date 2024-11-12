import React, {useState, useRef, useEffect} from 'react';

import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Animated,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import LinearGradient from 'react-native-linear-gradient'; // Linear Gradient 사용

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
}

export default function ChatRoom(): React.ReactElement {
  const navigation = useNavigation();

  const [messages, setMessages] = useState<Message[]>([
    {id: '1', text: "How's your project going?", sender: 'ai'},
    {id: '2', text: 'Hi Brooke!', sender: 'user'},
    {id: '3', text: "It's going well. Thanks for asking!", sender: 'user'},
    {id: '4', text: 'No worries. Let me know if you need any help 😊', sender: 'ai'},
    {id: '5', text: "You're the best!", sender: 'user'},
  ]);
  const [inputText, setInputText] = useState('');

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (inputText.trim() !== '') {
      // Show the button with animation
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 5,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Hide the button with animation
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [inputText, fadeAnim, scaleAnim]);

  const handleSend = () => {
    if (inputText.trim() !== '') {
      const newMessage: Message = {
        id: `${messages.length + 1}`,
        text: inputText,
        sender: 'user',
      };
      setMessages([...messages, newMessage]);
      setInputText('');

      // Simulate AI response (This would usually come from the server)
      setTimeout(() => {
        const aiMessage: Message = {
          id: `${messages.length + 2}`,
          text: 'This is an AI response to your message.',
          sender: 'ai',
        };
        setMessages(prevMessages => [...prevMessages, aiMessage]);
      }, 1000);
    }
  };

  const handleCameraPress = () => {
    launchCamera({mediaType: 'photo'}, response => {
      if (!response.didCancel && !response.errorCode) {
        console.log('Camera Image URI:', response.assets?.[0]?.uri);
      }
    });
  };

  const handleGalleryPress = () => {
    launchImageLibrary({mediaType: 'photo'}, response => {
      if (!response.didCancel && !response.errorCode) {
        console.log('Gallery Image URI:', response.assets?.[0]?.uri);
      }
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Header */}
        <SafeAreaView style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerButton}>
            <Text style={styles.headerButtonText}>뒤로</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>FLEX Coach</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('Profile')}
            style={styles.headerButton}
          >
            <Text style={styles.headerButtonText}>프로필</Text>
          </TouchableOpacity>
        </SafeAreaView>

        {/* Chat List */}
        <LinearGradient colors={['#1e1e1e', '#222']} style={{flex: 1, paddingTop: 14}}>
          <FlatList
            data={messages}
            keyExtractor={item => item.id}
            renderItem={({item}) => (
              <View
                style={[
                  styles.messageContainer,
                  item.sender === 'user' ? styles.userMessage : styles.aiMessage,
                ]}
              >
                <Text style={item.sender === 'user' ? styles.userText : styles.aiText}>
                  {item.text}
                </Text>
              </View>
            )}
            contentContainerStyle={{paddingBottom: 20}}
          />
        </LinearGradient>

        {/* Input Field */}
        <LinearGradient
          colors={['#222', '#303030']} // 아래에서 위로 갈수록 색이 연해지도록 설정
          style={styles.inputWrapper}
        >
          <View style={styles.inputContainer}>
            <TouchableOpacity onPress={handleCameraPress} style={styles.addButton}>
              <Text style={styles.addButtonText}>+</Text>
            </TouchableOpacity>

            <TextInput
              style={styles.textInput}
              value={inputText}
              onChangeText={setInputText}
              placeholder='Type a message...'
              placeholderTextColor='#888'
            />

            {/* Animated Send Button */}
            {inputText.trim() !== '' && (
              <Animated.View
                style={[
                  styles.sendButton,
                  {
                    opacity: fadeAnim, // 애니메이션을 통한 투명도 조절
                    transform: [{scale: scaleAnim}], // 애니메이션을 통한 크기 조절
                  },
                ]}
              >
                <TouchableOpacity onPress={handleSend}>
                  <Text style={styles.sendButtonText}>↑</Text>
                </TouchableOpacity>
              </Animated.View>
            )}
          </View>
        </LinearGradient>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#303030',
  },
  container: {
    flex: 1,
    backgroundColor: '#1e1e1e',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#303030',
  },
  headerButton: {
    padding: 10,
  },
  headerButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  messageContainer: {
    maxWidth: '80%',
    borderRadius: 10,
    padding: 10,
    marginVertical: 5,
    marginHorizontal: 10,
  },
  userMessage: {
    backgroundColor: '#007AFF',
    alignSelf: 'flex-end',
  },
  aiMessage: {
    backgroundColor: '#f2f2f2',
    alignSelf: 'flex-start',
  },
  userText: {
    color: '#ffffff',
    fontWeight: '500',
  },
  aiText: {
    color: '#000000',
    fontWeight: '500',
  },
  inputWrapper: {
    // borderTopLeftRadius: 20,
    // borderTopRightRadius: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 15,
    backgroundColor: 'transparent',
  },
  textInput: {
    flex: 1,
    height: 40,
    backgroundColor: '#2e2e2e',
    color: '#ffffff',
    borderRadius: 20,
    paddingHorizontal: 15,
    marginRight: 10,
  },
  addButton: {
    backgroundColor: '#007AFF',
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  sendButton: {
    backgroundColor: '#007AFF',
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
