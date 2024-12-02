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
import api from '../api/axiosConfig';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
}

export default function ChatRoom(): React.ReactElement {
  const navigation = useNavigation();

  const [messages, setMessages] = useState<Message[]>([
    // {id: '1', text: 'What kind of things you want to eat?', sender: 'ai'},
    // {id: '3', text: 'I want protein for to night!', sender: 'user'},
    // {id: '4', text: 'Click your meal  😊', sender: 'ai'},
    // {id: '4', text: 'chicken breast', sender: 'ai'},
    // {id: '4', text: 'beef steak', sender: 'ai'},
    // {id: '4', text: 'Milk with cereals', sender: 'ai'},
    // {id: '4', text: 'Grilled Mackerel', sender: 'ai'},
    // {id: '4', text: 'I dont want all of them', sender: 'ai'},
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

  const handleSend = async () => {
    if (inputText.trim() !== '') {
      // 사용자 메시지 추가
      const newMessage: Message = {
        id: `${messages.length + 1}`,
        text: inputText,
        sender: 'user',
      };
      setMessages(prevMessages => [...prevMessages, newMessage]);

      try {
        // 설정된 api 인스턴스로 요청
        const response = await api.post('/food/food_text', {
          text: inputText,
        });

        // API 응답으로 받은 음식 목록을 채팅창에 표시
        if (response.data.foods && Array.isArray(response.data.foods)) {
          // AI 응답 메시지 추가
          const aiMessage: Message = {
            id: `${messages.length + 2}`,
            text: '추천 음식 리스트입니다:',
            sender: 'ai',
          };
          setMessages(prevMessages => [...prevMessages, aiMessage]);

          // 각 추천 음식을 개별 메시지로 추가
          response.data.foods.forEach((food: string, index: number) => {
            const foodMessage: Message = {
              id: `${messages.length + 3 + index}`,
              text: food,
              sender: 'ai',
            };
            setMessages(prevMessages => [...prevMessages, foodMessage]);
          });
        }
      } catch (error) {
        console.error('API 요청 실패:', error);
        const errorMessage: Message = {
          id: `${messages.length + 2}`,
          text: '죄송합니다. 현재 요청을 처리할 수 없습니다.',
          sender: 'ai',
        };
        setMessages(prevMessages => [...prevMessages, errorMessage]);
      }

      // 입력창 초기화
      setInputText('');
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
