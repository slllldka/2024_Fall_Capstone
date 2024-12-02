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
  ActivityIndicator,
  ScrollView,
} from 'react-native';

import {useNavigation} from '@react-navigation/native';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import LinearGradient from 'react-native-linear-gradient'; // Linear Gradient 사용
import api from '../api/axiosConfig';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  isRecommendation?: boolean;
  isSelected?: boolean;
}

const GRADIENT_COLORS = [
  ['#4ECDC4', '#45B7AF'], // 민트
  ['#FF9A9E', '#FAD0C4'], // 연한 핑크
  ['#A18CD1', '#FBC2EB'], // 라벤더
  ['#96E6A1', '#D4FC79'], // 연두
  ['#FFD1FF', '#FAD0C4'], // 연한 보라
  ['#FFC3A0', '#FFAFBD'], // 살몬
];

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
  const [loading, setLoading] = useState(false);

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

  const handleFoodSelection = async (selectedFood: string) => {
    try {
      const response = await api.post('/food/select_food', {
        food: selectedFood,
      });

      if (response.status === 201) {
        // 선택된 음식 표시
        setMessages(prevMessages =>
          prevMessages.map(msg =>
            msg.text === selectedFood && msg.isRecommendation ? {...msg, isSelected: true} : msg,
          ),
        );

        // 선택 확인 메시지 추가
        const confirmMessage: Message = {
          id: `${messages.length + 1}`,
          text: `${selectedFood}를 선택하셨습니다!`,
          sender: 'ai',
        };
        setMessages(prevMessages => [...prevMessages, confirmMessage]);
      }
    } catch (error) {
      console.error('음식 선택 실패:', error);
    }
  };

  const handleSend = async () => {
    if (inputText.trim() !== '') {
      setLoading(true);
      try {
        const response = await api.post('/food/food_text', {
          text: inputText,
        });

        if (response.data.foods && Array.isArray(response.data.foods)) {
          setMessages([
            {
              id: '1',
              text: response.data.foods.join(','),
              sender: 'ai',
              isRecommendation: true,
            },
          ]);
        }
      } catch (error) {
        console.error('API 요청 실패:', error);
      } finally {
        setLoading(false);
      }
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

  const renderMessage = ({item}: {item: Message}) => (
    <View
      style={[
        styles.messageContainer,
        item.sender === 'user' ? styles.userMessage : styles.aiMessage,
        item.isSelected && styles.selectedMessage,
      ]}
    >
      {item.isRecommendation ? (
        <TouchableOpacity onPress={() => handleFoodSelection(item.text)} disabled={item.isSelected}>
          <Text
            style={[
              item.sender === 'user' ? styles.userText : styles.aiText,
              item.isSelected && styles.selectedText,
            ]}
          >
            {item.text}
          </Text>
        </TouchableOpacity>
      ) : (
        <Text style={item.sender === 'user' ? styles.userText : styles.aiText}>{item.text}</Text>
      )}
    </View>
  );

  const renderFoodRecommendations = (foods: string[]) => (
    <View style={styles.recommendationsContainer}>
      <Text style={styles.recommendationTitle}>추천 메뉴</Text>
      <View style={styles.foodGrid}>
        {foods.map((food, index) => (
          <TouchableOpacity
            key={index}
            style={styles.foodCard}
            onPress={() => handleFoodSelection(food)}
          >
            <LinearGradient
              colors={GRADIENT_COLORS[index % GRADIENT_COLORS.length]}
              style={styles.foodCardGradient}
            >
              <Text style={styles.foodName}>{food}</Text>
              <Text style={styles.selectText}>선택하기</Text>
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient colors={['#2e2e2e', '#1e1e1e']} style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerButton}>
          <Text style={styles.headerButtonText}>뒤로</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>음식 추천</Text>
        <View style={styles.headerButton} />
      </LinearGradient>

      <View style={styles.container}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size='large' color='#4ECDC4' />
            <Text style={styles.loadingText}>Loading...</Text>
          </View>
        ) : (
          <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
            {messages.length > 0 &&
              messages[0].isRecommendation &&
              renderFoodRecommendations(messages[0].text.split(','))}
          </ScrollView>
        )}

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.inputWrapper}
        >
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={inputText}
              onChangeText={setInputText}
              placeholder='어떤 음식을 찾으시나요?'
              placeholderTextColor='#888'
            />
            <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
              <Text style={styles.sendButtonText}>검색</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#1e1e1e',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#2e2e2e',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  container: {
    flex: 1,
    backgroundColor: '#1e1e1e',
  },
  scrollContainer: {
    flex: 1,
    padding: 15,
  },
  inputWrapper: {
    borderTopWidth: 1,
    borderTopColor: '#333',
    backgroundColor: '#1e1e1e',
    paddingBottom: Platform.OS === 'ios' ? 20 : 0,
  },
  inputContainer: {
    flexDirection: 'row',
    paddingVertical: 15,
  },
  input: {
    flex: 1,
    backgroundColor: '#2e2e2e',
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 12,
    color: '#ffffff',
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: '#4ECDC4',
    borderRadius: 25,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  sendButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  recommendationsContainer: {
    flex: 1,
  },
  recommendationTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 20,
  },
  foodGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  foodCard: {
    width: '48%',
    marginBottom: 15,
    borderRadius: 15,
    overflow: 'hidden',
  },
  foodCardGradient: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 100,
  },
  foodName: {
    color: '#000000',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  selectText: {
    color: '#000000',
    fontSize: 14,
    opacity: 0.7,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#ffffff',
  },
});
